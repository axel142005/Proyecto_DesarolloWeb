import psycopg

def get_connection():
    conn = psycopg.connect(
        "host=localhost port=5432 dbname=inventario_db user=postgres password=postgres123",
        client_encoding="UTF8",
    )
    return conn
