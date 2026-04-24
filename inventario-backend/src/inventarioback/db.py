"""
db.py - Conexión a PostgreSQL usando psycopg 3
psycopg 3 maneja mejor el encoding en Windows en español
"""
import psycopg


def get_connection():
    """Conexión a PostgreSQL."""
    conn = psycopg.connect(
        "host=localhost port=5432 dbname=inventario_db user=postgres password=postgres123",
        client_encoding="UTF8",
    )
    return conn