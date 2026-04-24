# Inventario Frontend

**Axel Yamil Severiano Ruiz - 0239970**

Frontend del Sistema de Inventario construido con **Next.js + TypeScript + Tailwind CSS**
siguiendo el patrón del proyecto de clase (minischoolfront).

## Stack

- **Next.js 16** - Framework React
- **React 19** - UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS v4** - Estilos

## Estructura (patrón del profe)

```
src/app/
├── layout.tsx              # Layout global con Navbar
├── page.tsx                # Redirige a /products
├── globals.css             # Estilos globales + Tailwind
├── components/
│   ├── navbar.tsx          # Barra de navegación
│   └── footer.tsx          # Pie de página
├── api/
│   ├── products_handler.tsx   # Funciones fetch para productos
│   └── movements_handler.tsx  # Funciones fetch para movimientos
├── products/
│   └── page.tsx            # Vista de productos
├── movements/
│   └── page.tsx            # Vista de movimientos
└── stats/
    └── page.tsx            # Vista de estadísticas
```

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

Aplicación en: **http://localhost:3000**

> Asegúrate de que el backend esté corriendo en **http://127.0.0.1:8000**

## Vistas

| Ruta | Descripción |
|------|-------------|
| `/products` | Lista y creación de productos |
| `/movements` | Registro e historial de movimientos |
| `/stats` | Dashboard de estadísticas |
