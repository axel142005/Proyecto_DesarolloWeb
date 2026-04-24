# Inventario Backend

**Axel Yamil Severiano Ruiz - 0239970**

Backend del Sistema de Gestión de Inventario construido con **FastAPI** siguiendo
el patrón de arquitectura en capas visto en clase.

## Stack

- **FastAPI** - Framework web
- **PostgreSQL** - Base de datos
- **Pydantic** - Validación de datos
- **psycopg2** - Conector PostgreSQL
- **uvicorn** - Servidor ASGI

## Arquitectura (patrón del profe)

```
app.py  →  Schemas → Models → Services → Routers → Server
```

```
src/inventarioback/
├── app.py              # Punto de entrada, arma todo
├── db.py               # Conexión a PostgreSQL
├── schemas/
│   └── schemas.py      # Validación de datos (Pydantic)
├── models/
│   └── models.py       # Operaciones CRUD a la BD
├── services/
│   ├── products.py     # Lógica de negocio productos
│   └── movements.py    # Lógica de negocio movimientos
└── routers/
    ├── base.py         # Clase base de routers
    ├── products.py     # Endpoints de productos
    └── movements.py    # Endpoints de movimientos
```

## Instalación

### 1. Base de datos

```bash
psql -U postgres < database/init.sql
```

### 2. Variables de entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL
```

### 3. Instalar dependencias

```bash
pip install fastapi uvicorn psycopg2-binary python-dotenv pydantic passlib bcrypt
```

### 4. Ejecutar

```bash
cd src/inventarioback
python app.py
```

Servidor en: **http://127.0.0.1:8000**  
Docs automáticas: **http://127.0.0.1:8000/docs**

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /products/ | Listar productos |
| POST | /products/ | Crear producto |
| GET | /products/{id} | Ver producto |
| PATCH | /products/{id} | Actualizar producto |
| DELETE | /products/{id} | Eliminar producto |
| GET | /movements/ | Listar movimientos |
| POST | /movements/ | Registrar movimiento |
| GET | /movements/stats | Estadísticas |
| GET | /health | Estado del servidor |
