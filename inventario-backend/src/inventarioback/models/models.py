"""
Models - Operaciones CRUD contra la base de datos
"""
import psycopg
from psycopg.rows import dict_row
from uuid import UUID
from typing import Optional
from db import get_connection


class ProductModel:
    """Operaciones de base de datos para productos"""

    def get_all(self) -> list[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT * FROM products ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows

    def get_by_id(self, product_id: UUID) -> Optional[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute("SELECT * FROM products WHERE id = %s", (str(product_id),))
        row = cur.fetchone()
        cur.close()
        conn.close()
        return row

    def create(self, name: str, quantity: int, price: float,
               category: str, description: str) -> dict:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute(
            """
            INSERT INTO products (name, quantity, price, category, description)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
            """,
            (name, quantity, price, category, description)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return row

    def update(self, product_id: UUID, name: Optional[str], quantity: Optional[int],
               price: Optional[float], category: Optional[str],
               description: Optional[str]) -> Optional[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)

        fields = []
        values = []
        if name is not None:
            fields.append("name = %s")
            values.append(name)
        if quantity is not None:
            fields.append("quantity = %s")
            values.append(quantity)
        if price is not None:
            fields.append("price = %s")
            values.append(price)
        if category is not None:
            fields.append("category = %s")
            values.append(category)
        if description is not None:
            fields.append("description = %s")
            values.append(description)

        if not fields:
            return self.get_by_id(product_id)

        values.append(str(product_id))
        cur.execute(
            f"UPDATE products SET {', '.join(fields)} WHERE id = %s RETURNING *",
            values
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return row

    def delete(self, product_id: UUID) -> bool:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM products WHERE id = %s", (str(product_id),))
        deleted = cur.rowcount > 0
        conn.commit()
        cur.close()
        conn.close()
        return deleted


class MovementModel:
    """Operaciones de base de datos para movimientos de inventario"""

    def get_all(self) -> list[dict]:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)
        cur.execute(
            """
            SELECT im.*, p.name AS product_name
            FROM inventory_movements im
            JOIN products p ON im.product_id = p.id
            ORDER BY im.created_at DESC
            LIMIT 50
            """
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows

    def create(self, product_id: UUID, movement_type: str,
               quantity: int, reason: str) -> dict:
        conn = get_connection()
        cur = conn.cursor(row_factory=dict_row)

        cur.execute("SELECT quantity, name FROM products WHERE id = %s",
                    (str(product_id),))
        product = cur.fetchone()

        if not product:
            cur.close()
            conn.close()
            raise ValueError("Producto no encontrado")

        if movement_type == "salida" and product["quantity"] < quantity:
            cur.close()
            conn.close()
            raise ValueError(f"Stock insuficiente. Stock actual: {product['quantity']}")

        cur.execute(
            """
            INSERT INTO inventory_movements (product_id, movement_type, quantity, reason)
            VALUES (%s, %s, %s, %s)
            RETURNING *
            """,
            (str(product_id), movement_type, quantity, reason)
        )
        movement = cur.fetchone()

        if movement_type == "entrada":
            cur.execute("UPDATE products SET quantity = quantity + %s WHERE id = %s",
                        (quantity, str(product_id)))
        else:
            cur.execute("UPDATE products SET quantity = quantity - %s WHERE id = %s",
                        (quantity, str(product_id)))

        conn.commit()
        movement["product_name"] = product["name"]
        cur.close()
        conn.close()
        return movement

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

        cur.close()
        conn.close()

        return {
            "total_products": total_products,
            "total_value": total_value,
            "total_movements": total_movements,
            "low_stock_products": low_stock,
        }