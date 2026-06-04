-- Heladeria DB - Axel Yamil Severiano Ruiz - 0239970
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(200)   NOT NULL,
    quantity      INTEGER        NOT NULL DEFAULT 0,
    price         DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    category      VARCHAR(100),
    description   TEXT,
    created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_movements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type  VARCHAR(10) NOT NULL CHECK (movement_type IN ('entrada', 'salida')),
    quantity       INTEGER     NOT NULL CHECK (quantity > 0),
    reason         VARCHAR(255),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movements_product_id ON inventory_movements(product_id);
CREATE INDEX idx_products_category    ON products(category);
CREATE INDEX idx_users_username       ON users(username);

-- Usuario admin por defecto (password: admin123)
INSERT INTO users (username, email, password_hash) VALUES
    ('admin', 'admin@heladeria.com', crypt('admin123', gen_salt('bf')));

INSERT INTO products (name, quantity, price, category, description) VALUES
    ('Helado de Vainilla',   50,  35.00, 'Helados',  'Sabor clasico cremoso'),
    ('Helado de Chocolate',  45,  35.00, 'Helados',  'Con chispas de chocolate'),
    ('Helado de Fresa',      30,  35.00, 'Helados',  'Con trozos reales de fresa'),
    ('Helado de Pistache',   25,  40.00, 'Helados',  'Sabor premium'),
    ('Cono de Galleta',     200,   8.00, 'Envases',  'Cono waffle crujiente'),
    ('Vaso Carton 8oz',     500,   3.50, 'Envases',  'Vaso biodegradable'),
    ('Jarabe de Caramelo',   15,  45.00, 'Toppings', 'Topping dulce'),
    ('Chispas de Chocolate', 25,  30.00, 'Toppings', 'Decoracion estandar'),
    ('Nueces Picadas',        8,  55.00, 'Toppings', 'Mix de nueces'),
    ('Cucharas Plasticas',  600,   1.50, 'Insumos',  'Cuchara descartable');
