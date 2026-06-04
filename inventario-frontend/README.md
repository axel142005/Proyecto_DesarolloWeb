# ⚛️ Inventario Frontend — Next.js

Frontend del sistema de gestión de inventario para heladería.

## Stack

- **Next.js 16** — Framework React con App Router
- **TypeScript** — Tipado estático
- **Tailwind CSS v4** — Utilidades CSS
- **DM Sans / DM Serif Display** — Tipografía

## Estructura

```
src/app/
├── api/
│   └── auth_handler.tsx    ← Todas las llamadas al backend
├── components/
│   ├── navbar.tsx          ← Navbar con login/logout
│   ├── footer.tsx          ← Footer
│   └── chatbot.tsx         ← Chatbot IA flotante
├── login/
│   └── page.tsx            ← Página de login
├── register/
│   └── page.tsx            ← Página de registro
├── products/
│   └── page.tsx            ← Catálogo de productos
├── movements/
│   └── page.tsx            ← Registro de movimientos
├── stats/
│   └── page.tsx            ← Dashboard con métricas
├── globals.css             ← Variables CSS y estilos globales
├── layout.tsx              ← Layout principal con Navbar y Chatbot
└── page.tsx                ← Redirección a /products
```

## Comunicación con el Backend

Todas las llamadas HTTP están centralizadas en `api/auth_handler.tsx`:

```typescript
// Auth
loginUser(username, password)
registerUser(username, email, password)

// Productos
getProducts()
createProduct(data)
deleteProduct(id)

// Movimientos
getMovements()
createMovement(data)

// Stats
getStats()

// IA
sendChatMessage(message)
```

## Manejo de sesión

La sesión se guarda en `localStorage` con la clave `heladeria_user`. El navbar detecta automáticamente si hay usuario activo y muestra el botón de "Salir".

## Chatbot IA

Botón flotante en la esquina inferior derecha. Al abrirlo:
1. Muestra sugerencias de preguntas predefinidas
2. El usuario escribe o selecciona una pregunta
3. El frontend manda `POST /ai/chat` al backend
4. Claude responde con datos reales del inventario

## Instalación

```powershell
# 1. Instalar dependencias
npm install

# 2. Correr en desarrollo
npm run dev

# 3. Build de producción (opcional)
npm run build
npm start
```

## URLs

| Página | Ruta |
|--------|------|
| Catálogo | http://localhost:3000/products |
| Movimientos | http://localhost:3000/movements |
| Dashboard | http://localhost:3000/stats |
| Login | http://localhost:3000/login |
| Registro | http://localhost:3000/register |

## Variables de entorno

El backend URL está configurado en `auth_handler.tsx`:
```typescript
const BASE = "http://localhost:8000";
```

Para producción, crea `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://tu-servidor:8000
```
