# Sistema de Gestión de Inventario
**Axel Yamil Severiano Ruiz — 0239970**
Desarrollo de Aplicaciones Web 2026

---

## Stack
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend:** FastAPI + Python 3.11+
- **Base de datos:** PostgreSQL 15 (en Docker dentro de WSL2)

---

## 🚀 Cómo correr el proyecto

Necesitas **3 terminales** abiertas al mismo tiempo.

### Terminal 1 — Base de Datos (WSL)

```powershell
wsl
sudo service docker start
sudo docker start inventario_db
```

Verifica que funciona:
```bash
sudo docker ps
```

Debe mostrar `inventario_db` como **Up**.

### Terminal 2 — Backend

```powershell
cd C:\Users\Usertemp\Downloads\proyecto-final\proyecto-final\inventario-backend
.venv\Scripts\activate
cd src\inventarioback
python app.py
```

**O más fácil** — haz doble clic en `inventario-backend\run.bat`

Verifica en el navegador: http://localhost:8000/docs

### Terminal 3 — Frontend

```powershell
cd C:\Users\Usertemp\Downloads\proyecto-final\proyecto-final\inventario-frontend
npm run dev
```

**O más fácil** — haz doble clic en `inventario-frontend\run.bat`

Abre: http://localhost:3000

---

## 🆘 Si algo falla

### Probar la conexión a la base de datos
```powershell
cd inventario-backend
.venv\Scripts\activate
cd src\inventarioback
python test_db.py
```

Te dirá exactamente qué está mal.

### Si Docker no está corriendo
```powershell
wsl
sudo service docker start
```

### Si el contenedor no existe
Ejecuta en WSL:
```bash
sudo docker run --name inventario_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=inventario_db \
  -p 5432:5432 \
  -d postgres:15

# Esperar 5 segundos y luego:
sudo docker exec -i inventario_db psql -U postgres -d inventario_db < /mnt/c/Users/Usertemp/Downloads/proyecto-final/proyecto-final/inventario-backend/database/init.sql
```

---

## 📁 Estructura del proyecto

```
proyecto-final/
├── inventario-backend/
│   ├── database/init.sql          ← Script SQL
│   ├── src/inventarioback/
│   │   ├── app.py                 ← Punto de entrada
│   │   ├── db.py                  ← Conexión a PostgreSQL
│   │   ├── test_db.py             ← Probar conexión
│   │   ├── schemas/               ← Validación (Pydantic)
│   │   ├── models/                ← CRUD a la BD
│   │   ├── services/              ← Lógica de negocio
│   │   └── routers/               ← Endpoints HTTP
│   ├── .env                       ← Variables de entorno
│   ├── pyproject.toml
│   └── run.bat                    ← Iniciar backend
│
├── inventario-frontend/
│   └── src/app/
│       ├── layout.tsx
│       ├── components/
│       ├── api/                   ← Handlers al backend
│       ├── products/
│       ├── movements/
│       └── stats/
│   ├── package.json
│   └── run.bat                    ← Iniciar frontend
│
└── README.md
```

---

## 🏗️ Arquitectura del Backend

```
Schemas → Models → Services → Routers → Server
```

- **Schemas:** Validación de datos (Pydantic)
- **Models:** Operaciones CRUD a la base de datos
- **Services:** Lógica de negocio
- **Routers:** Endpoints HTTP (FastAPI)

Este patrón es el mismo que usa el profesor en `minischoolback`.

---

## 🔗 URLs

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| Docs API | http://localhost:8000/docs |

---

## 📝 Features implementadas

- ✅ CRUD completo de productos
- ✅ Registro de movimientos (entradas/salidas)
- ✅ Estadísticas en tiempo real
- ✅ Validación de stock en salidas
- ✅ UUIDs como identificadores (igual que el profe)
- ✅ Arquitectura en capas (igual que el profe)
- ✅ CORS configurado
- ✅ Documentación automática con Swagger
