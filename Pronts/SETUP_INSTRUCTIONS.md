# 🚀 Instrucciones de Configuración - Frontend

## 📋 Requisitos Previos

- Node.js 16+ y npm instalado
- Git instalado
- Backend corriendo en `http://localhost:8000`

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Distribuidora_Perros_Gatos_front/Distribuidora_Perros_Gatos_front
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar si es necesario
notepad .env
```

**Variables importantes:**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### 4. Iniciar la Aplicación

```bash
# Modo desarrollo
npm start

# La aplicación se abrirá en http://localhost:3000
```

## 📦 Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Crear build de producción
npm run build

# Ejecutar tests
npm test

# Analizar bundle
npm run build
```

## 🎨 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Admin/           # Componentes de administración
│   ├── carousel/        # Carrusel de imágenes
│   ├── featured/        # Productos destacados
│   ├── hero/            # Banner principal
│   ├── layout/          # Layouts (header, footer, etc)
│   └── ui/              # Componentes UI básicos
│
├── pages/               # Páginas de la aplicación
│   ├── Admin/           # Páginas de administración
│   ├── cart/            # Carrito de compras
│   ├── home/            # Página principal
│   ├── login/           # Inicio de sesión
│   ├── register/        # Registro
│   └── my-orders/       # Mis pedidos
│
├── redux/               # Estado global
│   ├── actions/         # Acciones Redux
│   ├── reducers/        # Reducers Redux
│   └── store.js         # Configuración store
│
├── services/            # Servicios API
│   ├── api-client.js    # Cliente Axios configurado
│   ├── auth-service.js  # Autenticación
│   ├── productos-service.js
│   ├── pedidos-service.js
│   └── ...
│
├── hooks/               # Custom hooks
│   ├── use-auth.js
│   ├── use-cart.js
│   └── use-toast.js
│
└── utils/               # Utilidades
    ├── auth.js          # Helpers de autenticación
    ├── cart.js          # Helpers del carrito
    └── validation.js    # Validaciones
```

## 👤 Usuarios de Prueba

Una vez que el backend esté corriendo con datos semilla:

**Administrador:**
- Email: `admin@distribuidora.com`
- Password: `Admin123!`

**Cliente:**
- Email: `cliente@example.com`
- Password: `Cliente123!`

## 🔄 Flujo de Trabajo

1. **Desarrollo:**
   ```bash
   npm start
   # Edita archivos
   # La app se recarga automáticamente
   ```

2. **Testing:**
   ```bash
   npm test
   ```

3. **Build para Producción:**
   ```bash
   npm run build
   # Los archivos se generan en /build
   ```

## 🎯 Funcionalidades Principales

### Para Clientes:
- ✅ Ver catálogo de productos
- ✅ Buscar y filtrar productos
- ✅ Agregar al carrito
- ✅ Realizar pedidos
- ✅ Ver historial de pedidos ("Mis Pedidos")
- ✅ Registro y verificación por email

### Para Administradores:
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de categorías y subcategorías
- ✅ Gestión de pedidos
- ✅ Gestión de usuarios
- ✅ Dashboard con estadísticas
- ✅ Gestión de carrusel de imágenes
- ✅ Control de inventario

## 🐛 Solución de Problemas

### Error: "Cannot connect to backend"
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/

# Verificar variables de entorno en .env
cat .env
```

### Error: "npm install fails"
```bash
# Limpiar caché
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en Windows
set PORT=3001 && npm start

# O en .env
PORT=3001
```

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- Nunca subas archivos `.env` a Git
- Las credenciales de prueba son solo para desarrollo
- En producción, usa HTTPS
- Configura CORS correctamente en el backend

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🎨 Temas y Estilos

Los estilos globales están en:
- `src/index.css` - Estilos base
- `src/styles/theme.css` - Variables de tema
- Cada componente tiene su propio archivo `.css`

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador (F12)
3. Verifica las variables de entorno en `.env`
4. Consulta los logs de npm

## 🚀 Deploy

Para desplegar en producción:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Servir archivos estáticos** con:
   - Nginx
   - Apache
   - Vercel
   - Netlify
   - Firebase Hosting

3. **Configurar variables de entorno** según el hosting:
   ```env
   REACT_APP_API_URL=https://api.tu-dominio.com
   ```
