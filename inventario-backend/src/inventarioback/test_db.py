"""
test_db.py - Probar conexión a PostgreSQL
Uso: python test_db.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from db import get_connection


def test_connection():
    print("=" * 50)
    print("🔍 Probando conexión a PostgreSQL...")
    print("=" * 50)

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"✅ Conexión exitosa!")
        print(f"📊 Versión: {version[0]}")

        cur.execute("SELECT COUNT(*) FROM products;")
        count = cur.fetchone()
        print(f"📦 Productos en la BD: {count[0]}")

        cur.close()
        conn.close()
        print("=" * 50)
        print("✅ TODO OK - La BD está funcionando")
        print("=" * 50)
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print("=" * 50)
        print("Verifica:")
        print("1. Docker está corriendo (en WSL: sudo docker ps)")
        print("2. El contenedor inventario_db está activo")
        print("3. Ejecutaste el SQL de database/init.sql")
        print("=" * 50)


if __name__ == "__main__":
    test_connection()
