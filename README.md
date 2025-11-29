# 🐾 Distribuidora Perros y Gatos – Frontend (React)

Frontend del MVP del sistema distribuido de gestión de pedidos.  
Este frontend se comunica con el backend mediante API REST y muestra el catálogo de productos, carrito y estado de pedidos.

> **Tecnologías**: React 18, Redux, React Router, Axios  
> **Arquitectura**: Desacoplada, asíncrona y escalable

---

## 🧰 Requisitos previos

- Node.js 16+ y npm
- Backend API corriendo (configurar URL en `.env`)

---

## 🚀 Instrucciones de instalación y ejecución

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env y configura REACT_APP_API_URL
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI base (Button, Input, Toast, etc.)
│   └── layout/         # Layouts y navegación
├── pages/              # Páginas de la aplicación
│   ├── home/          # Página principal con catálogo
│   ├── login/         # Inicio de sesión
│   ├── register/      # Registro de usuarios
│   ├── cart/          # Carrito de compras
│   └── admin/         # Páginas de administración
├── services/           # Servicios de API
├── redux/              # Estado global (Redux)
│   ├── actions/       # Acciones
│   └── reducers/      # Reducers
├── hooks/              # Custom hooks
├── utils/              # Utilidades
└── App.js              # Componente principal con rutas
```

---

## 🎯 Funcionalidades Implementadas

### Públicas
- ✅ Visualización de catálogo de productos por categorías
- ✅ Carrito de compras con persistencia en localStorage
- ✅ Registro de nuevos usuarios con validación
- ✅ Inicio de sesión con JWT y cookies
- ✅ Carrusel de imágenes en página principal

### Administración
- ✅ Gestión de pedidos (visualizar, filtrar, actualizar estado)
- ✅ Visualización de usuarios y sus pedidos
- ✅ Estructura base para gestión de productos
- ✅ Estructura base para gestión de categorías
- ✅ Estructura base para gestión de carrusel
- ✅ Estructura base para gestión de inventario

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

---

## 📦 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta los tests

---

## 🏗️ Arquitectura

El frontend sigue la arquitectura descrita en `ARCHITECTURE.md`:
- Comunicación asíncrona con el backend mediante API REST
- Estado global gestionado con Redux
- Componentes reutilizables y modulares
- Accesibilidad WCAG 2.1 Nivel A (en progreso)

---

## 📝 Historias de Usuario (HU)

El proyecto implementa las siguientes HUs:
- HU: Login de usuarios
- HU: Registro de usuarios
- HU: Visualización de productos
- HU: Gestión de pedidos (admin)
- HU: Visualización de usuarios (admin)
- HU: Estructura base para las demás HUs

Ver detalles en la carpeta `HU/`