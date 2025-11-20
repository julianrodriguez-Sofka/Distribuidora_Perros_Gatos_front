# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Gestión de Usuarios: Visualizar Detalles de Clientes"

**Objetivo**: Permitir al administrador **consultar de forma segura y completa** la información de los clientes registrados, incluyendo sus datos personales, preferencias de mascotas y historial de pedidos, **sin permitir modificaciones**.

> 🔍 Este documento está escrito para ser **consumido literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🗃️ Modelo de Datos del Usuario

### Tabla: `usuarios`
| Campo | Tipo | Requerido | Descripción |
|------|------|----------|-------------|
| `id` | string | ✅ | UUID o ID único (ej: `"usr-123"`) |
| `nombreCompleto` | string | ✅ | Nombre y apellido |
| `cedula` | string | ✅ | Número de identificación (único) |
| `email` | string | ✅ | Correo electrónico (único) |
| `telefono` | string | ✅ | Número de contacto |
| `direccionEnvio` | string | ✅ | Dirección completa |
| `tienePerros` | boolean | ✅ | `true` si el cliente tiene perros |
| `tieneGatos` | boolean | ✅ | `true` si el cliente tiene gatos |

> 💡 **Preferencias de mascotas**:  
> - Si `tienePerros = true` y `tieneGatos = false` → `"Perros"`  
> - Si `tienePerros = false` y `tieneGatos = true` → `"Gatos"`  
> - Si ambos `true` → `"Perros y Gatos"`  
> - Si ambos `false` → `"Sin mascotas registradas"`

---

## 🗃️ Modelo de Datos: Pedidos del Usuario

### Relación
- Cada `pedido` tiene un campo `clienteId` que referencia a `usuarios.id`.
- **No se almacenan pedidos en el perfil del usuario**; se consultan desde la tabla `pedidos`.

---

## 🖥️ Interfaz de Administración

### Ruta
- `/admin/usuarios`

### Componentes obligatorios

1. **Barra de búsqueda**:
   - Placeholder: `"Buscar por ID, nombre, cédula o correo"`
   - Filtrado en tiempo real (frontend) o por API (backend con debouncing).

2. **Tabla de usuarios** (AC 1):
   | Columna | Contenido |
   |--------|----------|
   | ID | `usr-123` |
   | Nombre | `María López` |
   | Cédula | `12345678` |
   | Correo | `maria@ejemplo.com` |
   | Dirección | `Calle Falsa 123` |
   | Acciones | Botón `"Ver perfil"` |

3. **Vista detallada de usuario** (AC 2) – ruta: `/admin/usuarios/{id}`
   - **Datos personales**:
     - ID: `usr-123`
     - Nombre completo: `María López`
     - Cédula: `12345678`
     - Correo: `maria@ejemplo.com`
     - Teléfono: `+56 9 1234 5678`
     - Dirección de envío: `Calle Falsa 123, Ciudad`
   - **Preferencias de mascotas**:  
     `"Perros y Gatos"` (según lógica de `tienePerros`/`tieneGatos`)
   - **Sección: "Pedidos del Usuario"** (AC 3):
     - Tabla con: `ID de pedido`, `fecha`, `total`, `estado`
     - Ordenados por fecha descendente (más reciente primero)

4. **Botón de regreso**:  
   - En la vista de perfil, un botón `"Volver a la lista"`.

---

## ✅ Criterios de Aceptación – Implementación Detallada

### AC 1: Visualización de la lista de usuarios
- **Acción**: Acceder a `/admin/usuarios`.
- **Resultado**:
  - Se muestra una tabla con **todos los usuarios registrados**.
  - Cada fila incluye: `id`, `nombreCompleto`, `cedula`, `email`, `direccionEnvio`.
- **Formato**: Datos legibles, sin truncar información crítica.

---

### AC 2: Ver perfil detallado de un usuario
- **Acción**: Hacer clic en `"Ver perfil"` en una fila.
- **Resultado**:
  - Se carga la vista `/admin/usuarios/{id}`.
  - Se muestran **todos los campos del modelo de datos**.
  - Las preferencias de mascotas se muestran como texto legible (no como booleanos).

> ✅ **No se muestran campos sensibles no listados** (ej: contraseñas, tokens).

---

### AC 3: Visualizar pedidos asociados a un usuario
- **Acción**: Estar en la vista de perfil del usuario.
- **Resultado**:
  - Se muestra una sección titulada `"Pedidos del Usuario"`.
  - Lista de pedidos vinculados por `clienteId`.
  - Cada pedido muestra: `id`, `fecha` (YYYY-MM-DD HH:mm), `total` (formateado), `estado`.
  - Si no hay pedidos: mensaje `"Este usuario no tiene pedidos registrados."`

---

### AC 4: Búsqueda de usuarios
- **Mecanismo**:
  - La búsqueda debe coincidir (case-insensitive) con:
    - `id`
    - `nombreCompleto`
    - `cedula`
    - `email`
- **Resultado**:
  - La tabla se filtra **en tiempo real** o tras 300ms de inactividad (debouncing).
  - Si no hay coincidencias: mensaje `"No se encontraron usuarios."`

---

## 🚫 Reglas de Negocio Adicionales

### 🔒 Solo lectura
- **El administrador NO puede**:
  - Editar ningún campo del usuario.
  - Eliminar usuarios.
  - Acceder a contraseñas, tokens o datos no listados.
- **No deben existir botones de "Editar", "Guardar" o "Eliminar"** en esta HU.

### 📊 Datos de mascotas
- Las preferencias se derivan **exclusivamente** de los campos booleanos `tienePerros` y `tieneGatos`.
- **No se permite** inferir mascotas desde los pedidos.

### 📁 Privacidad
- Aunque es un panel de administración, **nunca se exponen contraseñas** ni datos de autenticación.
- Todos los endpoints deben requerir rol `admin`.

---

## 🧪 Ejemplo de Usuario Válido

```json
{
  "id": "usr-789",
  "nombreCompleto": "Carlos Méndez",
  "cedula": "98765432",
  "email": "carlos@ejemplo.com",
  "telefono": "+56 9 8765 4321",
  "direccionEnvio": "Avenida Siempre Viva 742",
  "tienePerros": true,
  "tieneGatos": false
}