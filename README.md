# 🍦 Sistema de Gestión de Inventario — Heladería

**Axel Yamil Severiano Ruiz — 0239970**  
Desarrollo de Aplicaciones Web · Primavera 2026

---

## Descripción

Sistema web completo para gestionar el inventario de una heladería. Permite controlar el stock de productos, registrar entradas y salidas, visualizar estadísticas en tiempo real y consultar al asistente de IA integrado.

## Features

- **Autenticación** — Login y registro con contraseñas hasheadas (bcrypt via pgcrypto)
- **Catálogo de productos** — CRUD completo con categorías y precios
- **Movimientos de inventario** — Entradas y salidas con validación de stock
- **Dashboard** — Métricas en tiempo real, valor total, stock bajo
- **Asistente IA** — Chatbot integrado con Claude (Anthropic) que conoce el inventario
- **Diseño moderno** — Tema rosa coral, tipografía elegante, totalmente responsivo

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS v4 |
| Backend | FastAPI + Python 3.11+ |
| Base de datos | PostgreSQL 15 (Docker en WSL2) |
| IA | Claude API (Anthropic) |
| Gestor de paquetes | uv (Python) + npm (Node) |

## 🏗️ Arquitectura

```
Frontend (Next.js :3000)
        ↕ HTTP/JSON
Backend (FastAPI :8000)
        ↕ SQL (psycopg v3)
PostgreSQL (Docker :5432)
```

```
Schemas → Models → Services → Routers → Server
```

## 🚀 Cómo correr el proyecto

Necesitas **3 terminales** abiertas simultáneamente.

### Terminal 1 — Base de datos (WSL)
```bash
wsl
sudo service docker start
sudo docker start inventario_db
```

### Terminal 2 — Backend
```powershell
cd inventario-backend
.venv\Scripts\activate
cd src\inventarioback
python app.py
```

### Terminal 3 — Frontend
```powershell
cd inventario-frontend
npm run dev
```

Abre **http://localhost:3000** en el navegador.

## 🔗 URLs

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

## Usuario por defecto

- **Usuario:** `admin`
- **Contraseña:** `admin123`

## Variables de entorno

Crea/edita `inventario-backend/.env`:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=inventario_db
ANTHROPIC_API_KEY=sk-ant-...
```

## Inicializar la base de datos

```bash
# En WSL, después de crear el contenedor:
sudo docker exec -i inventario_db psql -U postgres -d inventario_db \
  < /mnt/c/ruta/al/proyecto/inventario-backend/database/init.sql
```

## Nota importante

Si tienes PostgreSQL instalado en Windows, desactívalo para evitar conflictos:
```powershell
# PowerShell como Administrador
Stop-Service postgresql-x64-18
Set-Service -Name postgresql-x64-18 -StartupType Manual
```

---

**Materia:** Desarrollo de Aplicaciones Web  
**Semestre:** Primavera 2026
