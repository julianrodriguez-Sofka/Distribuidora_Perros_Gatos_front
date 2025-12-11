# 🐾 Distribuidora Perros y Gatos – Frontend (React)

Frontend del MVP del sistema distribuido de gestión de pedidos.  
Este frontend se comunica con el backend mediante API REST y muestra el catálogo de productos, carrito y estado de pedidos.

> **Tecnologías**: React 18, Redux, React Router, Axios  
> **Arquitectura**: Desacoplada, asíncrona y escalable

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js 16+** y npm instalados
- **Backend API** corriendo en http://localhost:8000
- **Windows PowerShell 5.1+** (para scripts de configuración)

### Instalación Automática (Recomendada)

```powershell
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Distribuidora_Perros_Gatos_front

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (script interactivo)
.\setup-env.ps1

# 4. Iniciar aplicación
npm start
```

**El navegador abrirá automáticamente en http://localhost:3000**

---

## ⚠️ Configuración de Variables de Entorno

**IMPORTANTE**: El proyecto requiere configuración de `.env` para conectarse al backend.

### Opción 1: Script Automático (Recomendado)
```powershell
.\setup-env.ps1
```

**¿Qué hace el script?**
- ✅ Verifica si existe `.env`
- ✅ Crea `.env` desde `.env.example` si no existe
- ✅ Solicita URL del backend (default: http://localhost:8000/api)
- ✅ Configura entorno (development/production)
- ✅ Valida la configuración

### Opción 2: Configuración Manual
```bash
# 1. Copiar archivo de ejemplo
cp .env.example .env

# 2. Editar .env con tus valores
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### Variables Disponibles

| Variable | Descripción | Valor Default |
|----------|-------------|---------------|
| `REACT_APP_API_URL` | URL del backend API | `http://localhost:8000/api` |
| `REACT_APP_ENV` | Entorno de ejecución | `development` |

**Si no configuras `.env`, obtendrás el error "Cannot connect to API"**

---

## 🧰 Instalación Manual Paso a Paso

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Backend

Asegúrate de que el backend esté corriendo:

```powershell
# En el directorio del backend
cd ..\Distribuidora_Perros_Gatos_back
.\setup.ps1
```

Ver [Backend README](../Distribuidora_Perros_Gatos_back/README.md) para más detalles.

### 3. Configurar Variables de Entorno

```powershell
# Automático
.\setup-env.ps1

# O manual
cp .env.example .env
```

### 4. Iniciar Aplicación

```bash
npm start
```

El script `prestart` verificará automáticamente tu configuración antes de iniciar.

---

## 📋 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Desarrollo** | `npm start` | Inicia servidor de desarrollo en http://localhost:3000 |
| **Build** | `npm build` | Construye para producción en `/build` |
| **Tests** | `npm test` | Ejecuta tests en modo interactivo |
| **Eject** | `npm eject` | ⚠️ Operación irreversible - expone configuración |
| **Setup .env** | `.\setup-env.ps1` | Configura variables de entorno interactivamente |
| **Verificar .env** | `node check-env.js` | Valida configuración de variables |

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

### Para Usuarios (Públicas)
- ✅ **Catálogo de Productos**
  - Visualización por categorías y subcategorías
  - Filtros dinámicos
  - Carrusel de imágenes destacadas
  - Tarjetas de productos mejoradas
  
- ✅ **Carrito de Compras**
  - Persistencia en localStorage (usuarios anónimos)
  - Sincronización con backend (usuarios autenticados)
  - Validación de stock en tiempo real
  - Gestión de cantidades

- ✅ **Autenticación**
  - Registro con validación de email
  - Login con JWT y refresh tokens
  - Verificación por código de 6 dígitos
  - Recuperación de contraseña

- ✅ **Mis Pedidos**
  - Historial de pedidos del usuario
  - Seguimiento de estado en tiempo real
  - Detalles completos de cada pedido

- ✅ **Sistema de Calificaciones**
  - Calificar productos comprados (1-5 estrellas)
  - Ver calificaciones promedio
  - Sistema de validación (solo productos comprados)

### Para Administradores
- ✅ **Dashboard Estadísticas**
  - Métricas de ventas en tiempo real
  - Gráficos de productos más vendidos
  - Estadísticas de usuarios

- ✅ **Gestión de Pedidos**
  - Visualizar todos los pedidos
  - Filtros avanzados (estado, fecha, usuario)
  - Actualizar estados (Pendiente → Enviado → Entregado)
  - Historial de cambios

- ✅ **Gestión de Usuarios**
  - Listado completo de usuarios
  - Búsqueda por nombre/email/cédula
  - Ver historial de pedidos por usuario
  - Estadísticas individuales

- ✅ **Gestión de Productos**
  - Crear/editar/eliminar productos
  - Subida de múltiples imágenes
  - Asignación de categorías
  - Control de inventario

- ✅ **Gestión de Categorías**
  - CRUD completo de categorías y subcategorías
  - Validación de unicidad
  - Restricciones de eliminación

- ✅ **Gestión de Carrusel**
  - Subida de imágenes (máx. 5)
  - Reordenamiento drag & drop
  - URLs de destino opcionales

- ✅ **Gestión de Inventario**
  - Reabastecimiento de productos
  - Historial de movimientos
  - Auditoría completa

- ✅ **Chatbot de Soporte**
  - Respuestas automáticas a preguntas frecuentes
  - Información de productos
  - Estado de pedidos

---

## 🔧 Configuración Avanzada

### Conexión con Backend

El frontend se conecta automáticamente al backend configurado en `.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

**Endpoints principales:**
- Autenticación: `/auth/register`, `/auth/login`
- Productos: `/home/productos`, `/productos/{id}`
- Carrito: `/cart`, `/cart/items`
- Pedidos: `/pedidos`, `/pedidos/myorders`
- Admin: `/admin/*`

### Verificar Conexión

```bash
# Ejecutar script de verificación
node check-env.js
```

---

## 🐛 Troubleshooting (Solución de Problemas)

### ❌ Error: "Cannot connect to API"
**Causa**: Variables de entorno no configuradas o backend no disponible

**Solución**:
```powershell
# 1. Verificar .env existe
ls .env

# 2. Si no existe, ejecutar setup
.\setup-env.ps1

# 3. Verificar backend corriendo
curl http://localhost:8000/health
```

### ❌ Error: "Module not found"
**Causa**: Dependencias no instaladas

**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "Port 3000 already in use"
**Causa**: Otra aplicación usa el puerto 3000

**Solución**:
```powershell
# Opción 1: Detener proceso en puerto 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id <PID>

# Opción 2: Usar otro puerto
$env:PORT=3001; npm start
```

### ❌ Página en blanco después de build
**Causa**: Configuración incorrecta de rutas en producción

**Solución**:
```json
// package.json - Agregar homepage
{
  "homepage": ".",
  ...
}
```

### ❌ CORS errors
**Causa**: Backend no permite origen del frontend

**Solución**: Verificar configuración CORS en backend (`backend/api/main.py`)

---

## 📖 Documentación Adicional

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Flujo de Trabajo con IA](./AI_WORKFLOW.md)
- [Historias de Usuario](./HU/README_HU.md)
- [Guía de Testing](./TESTING_STATUS.md)
- [Auditoría de Código](./AUDIT_REPORT.md)
- [Instalación Rápida](./Pronts/INSTALACION_RAPIDA.md)

---

## 🔗 Integración con Backend

### Setup Completo (Frontend + Backend)

```powershell
# 1. Configurar Backend
cd Distribuidora_Perros_Gatos_back
.\fix-migrations.ps1
.\setup.ps1

# 2. Configurar Frontend
cd ..\Distribuidora_Perros_Gatos_front
npm install
.\setup-env.ps1

# 3. Iniciar ambos servicios
# Terminal 1 (Backend ya está corriendo desde setup.ps1)
# Terminal 2 (Frontend)
npm start
```

### Verificación del Sistema Completo

```powershell
# Backend API Swagger
Start-Process "http://localhost:8000/docs"

# Frontend
Start-Process "http://localhost:3000"

# RabbitMQ Management
Start-Process "http://localhost:15672"
```

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm test -- --coverage

# Tests específicos
npm test -- auth.test.js
```

Ver [TESTING_STATUS.md](./TESTING_STATUS.md) para más detalles.

---