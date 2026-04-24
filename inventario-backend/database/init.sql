-- Inventario DB - Siguiendo el modelo del profe con UUIDs
-- Axel Yamil Severiano Ruiz - 0239970

-- Habilitar UUID igual que el profe
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de productos
CREATE TABLE products (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(200)    NOT NULL,
    quantity      INTEGER         NOT NULL DEFAULT 0,
    price         DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
    category      VARCHAR(100),
    description   TEXT,
    created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Tabla de movimientos de inventario
CREATE TABLE inventory_movements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type  VARCHAR(10) NOT NULL CHECK (movement_type IN ('entrada', 'salida')),
    quantity       INTEGER     NOT NULL CHECK (quantity > 0),
    reason         VARCHAR(255),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices igual que el profe
CREATE INDEX idx_movements_product_id ON inventory_movements(product_id);
CREATE INDEX idx_products_name        ON products(name);
CREATE INDEX idx_products_category    ON products(category);

-- Datos de ejemplo
INSERT INTO products (name, quantity, price, category, description) VALUES
    ('Laptop Dell Inspiron', 15, 899.99, 'Electrónica', 'Laptop 15", 8GB RAM'),
    ('Mouse Logitech MX',    45, 79.99,  'Accesorios',  'Mouse inalámbrico'),
    ('Teclado Mecánico RGB', 28, 129.99, 'Accesorios',  'Teclado con luces RGB'),
    ('Monitor LG 27"',       12, 350.00, 'Electrónica', 'Monitor Full HD'),
    ('Silla Ergonómica',      8, 450.00, 'Muebles',     'Soporte lumbar');
