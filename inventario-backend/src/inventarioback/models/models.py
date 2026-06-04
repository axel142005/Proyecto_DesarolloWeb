import psycopg
from psycopg.rows import dict_row
from uuid import UUID
from typing import Optional
from db import get_connection


class UserModel:
    def get_by_username(self, username: str) -> Optional[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        row = cur.fetchone()
        cur.close(); conn.close()
        return row

    def get_by_email(self, email: str) -> Optional[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        cur.close(); conn.close()
        return row

    def create(self, username: str, email: str, password: str) -> dict:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, crypt(%s, gen_salt('bf'))) RETURNING id, username, email, created_at",
            (username, email, password)
        )
        row = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        return row

    def verify_password(self, username: str, password: str) -> Optional[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute(
            "SELECT id, username, email, created_at FROM users WHERE username = %s AND password_hash = crypt(%s, password_hash)",
            (username, password)
        )
        row = cur.fetchone()
        cur.close(); conn.close()
        return row


class ProductModel:
    def get_all(self) -> list:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT * FROM products ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close(); conn.close()
        return rows

    def get_by_id(self, product_id: UUID) -> Optional[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT * FROM products WHERE id = %s", (str(product_id),))
        row = cur.fetchone()
        cur.close(); conn.close()
        return row

    def create(self, name, quantity, price, category, description) -> dict:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute(
            "INSERT INTO products (name, quantity, price, category, description) VALUES (%s, %s, %s, %s, %s) RETURNING *",
            (name, quantity, price, category, description)
        )
        row = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        return row

    def update(self, product_id, name, quantity, price, category, description) -> Optional[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        fields, values = [], []
        if name is not None: fields.append("name = %s"); values.append(name)
        if quantity is not None: fields.append("quantity = %s"); values.append(quantity)
        if price is not None: fields.append("price = %s"); values.append(price)
        if category is not None: fields.append("category = %s"); values.append(category)
        if description is not None: fields.append("description = %s"); values.append(description)
        if not fields: return self.get_by_id(product_id)
        values.append(str(product_id))
        cur.execute(f"UPDATE products SET {', '.join(fields)} WHERE id = %s RETURNING *", values)
        row = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        return row

    def delete(self, product_id) -> bool:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM products WHERE id = %s", (str(product_id),))
        deleted = cur.rowcount > 0
        conn.commit(); cur.close(); conn.close()
        return deleted

    def get_all_for_ai(self) -> list:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT name, quantity, price, category, (quantity * price) as total_value FROM products ORDER BY category, name")
        rows = cur.fetchall()
        cur.close(); conn.close()
        return rows

    def get_stats(self) -> dict:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT COUNT(*) AS total FROM products")
        total_products = cur.fetchone()["total"]
        cur.execute("SELECT COALESCE(SUM(quantity * price), 0) AS total FROM products")
        total_value = float(cur.fetchone()["total"])
        cur.execute("SELECT COUNT(*) AS total FROM inventory_movements")
        total_movements = cur.fetchone()["total"]
        cur.execute("SELECT COUNT(*) AS total FROM products WHERE quantity < 10")
        low_stock = cur.fetchone()["total"]
        cur.close(); conn.close()
        return {"total_products": total_products, "total_value": total_value, "total_movements": total_movements, "low_stock_products": low_stock}


class MovementModel:
    def get_all(self) -> list:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT im.*, p.name AS product_name FROM inventory_movements im JOIN products p ON im.product_id = p.id ORDER BY im.created_at DESC LIMIT 50")
        rows = cur.fetchall()
        cur.close(); conn.close()
        return rows

    def create(self, product_id, movement_type, quantity, reason) -> dict:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT quantity, name FROM products WHERE id = %s", (str(product_id),))
        product = cur.fetchone()
        if not product: cur.close(); conn.close(); raise ValueError("Producto no encontrado")
        if movement_type == "salida" and product["quantity"] < quantity:
            cur.close(); conn.close(); raise ValueError(f"Stock insuficiente. Stock actual: {product['quantity']}")
        cur.execute("INSERT INTO inventory_movements (product_id, movement_type, quantity, reason) VALUES (%s, %s, %s, %s) RETURNING *",
                    (str(product_id), movement_type, quantity, reason))
        movement = cur.fetchone()
        if movement_type == "entrada":
            cur.execute("UPDATE products SET quantity = quantity + %s WHERE id = %s", (quantity, str(product_id)))
        else:
            cur.execute("UPDATE products SET quantity = quantity - %s WHERE id = %s", (quantity, str(product_id)))
        conn.commit()
        movement["product_name"] = product["name"]
        cur.close(); conn.close()
        return movement
