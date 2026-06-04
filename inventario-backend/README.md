# Inventario Backend — FastAPI

Backend del sistema de gestión de inventario para heladería.

## Stack

- **FastAPI** — Framework web moderno para Python
- **psycopg v3** — Driver PostgreSQL (maneja encoding UTF-8 en Windows)
- **Pydantic v2** — Validación de datos
- **python-dotenv** — Variables de entorno
- **pgcrypto** — Hashing de contraseñas en PostgreSQL

## Arquitectura en capas


```
Request HTTP
     ↓
  Routers    → recibe la petición, valida con schemas
     ↓
  Services   → aplica lógica de negocio
     ↓
   Models    → ejecuta SQL en PostgreSQL
     ↓
 PostgreSQL
```

## Estructura

```
src/inventarioback/
├── app.py              ← Punto de entrada, wiring de dependencias
├── db.py               ← Conexión a PostgreSQL
├── schemas/
│   └── schemas.py      ← Modelos Pydantic (validación)
├── models/
│   └── models.py       ← CRUD directo con psycopg
├── services/
│   ├── auth.py         ← Lógica de autenticación
│   ├── products.py     ← Lógica de productos
│   ├── movements.py    ← Lógica de movimientos
│   └── ai_service.py   ← Integración con Claude API
└── routers/
    ├── base.py         ← BaseRouter (patrón del profe)
    ├── auth.py         ← POST /auth/register, /auth/login
    ├── products.py     ← GET/POST/PATCH/DELETE /products/
    ├── movements.py    ← GET/POST /movements/
    └── ai_router.py    ← POST /ai/chat
```

## 🔌 Endpoints API

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |

### Products
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products/` | Listar todos los productos |
| POST | `/products/` | Crear producto |
| GET | `/products/{id}` | Obtener producto por ID |
| PATCH | `/products/{id}` | Actualizar producto |
| DELETE | `/products/{id}` | Eliminar producto |
| GET | `/products/stats/summary` | Estadísticas generales |

### Movements
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/movements/` | Últimos 50 movimientos |
| POST | `/movements/` | Registrar entrada/salida |

### AI
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/ai/chat` | Chat con asistente IA |
| GET | `/ai/status` | Estado de la IA |

## Instalación

```powershell
# 1. Crear entorno virtual
uv venv
.venv\Scripts\activate

# 2. Instalar dependencias
uv add fastapi uvicorn "psycopg[binary]" python-dotenv pydantic

# 3. Configurar variables de entorno
# Edita .env con tus credenciales

# 4. Correr el servidor
cd src\inventarioback
python app.py
```

## Base de datos

PostgreSQL 15 corriendo en Docker dentro de WSL2.

```bash
# Crear contenedor
sudo docker run --name inventario_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=inventario_db \
  -p 5432:5432 -d postgres:15

# Cargar esquema
sudo docker exec -i inventario_db psql -U postgres -d inventario_db < database/init.sql
```

## Integración IA

El chatbot usa la API de Claude (Anthropic). Configura tu API key en `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

El servicio inyecta el inventario real como contexto en cada conversación.

## Decisiones técnicas

- **psycopg v3** en lugar de psycopg2 — maneja mejor el encoding en Windows en español
- **Contraseñas con pgcrypto** — `crypt()` y `gen_salt('bf')` directamente en PostgreSQL
- **UUIDs** con `gen_random_uuid()` — igual que el patrón del profesor
- **Sin ORM** — SQL directo con psycopg para máximo control y transparencia
- **BaseRouter** — clase base que todos los routers heredan (patrón del profesor)
