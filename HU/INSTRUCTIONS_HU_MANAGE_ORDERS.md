# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Gestión de Pedidos: Visualizar y Actualizar Estado de Pedidos"

**Objetivo**: Permitir al administrador visualizar todos los pedidos, filtrarlos por estado, ver detalles completos y actualizar su estado de forma segura y en tiempo real.

> 🔍 Este documento está escrito para ser **consumido literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🗃️ Modelo de Datos del Pedido

### Tabla: `pedidos`
| Campo | Tipo | Descripción |
|------|------|-------------|
| `id` | string | UUID o ID único (ej: `"pedido-123"`) |
| `clienteId` | string | ID del cliente |
| `clienteNombre` | string | Nombre legible del cliente |
| `fecha` | timestamp | Fecha y hora de creación (ISO 8601) |
| `total` | number | Total en moneda local (float o entero en centavos) |
| `estado` | string | Uno de: `"Pendiente de envío"`, `"Enviado"`, `"Entregado"`, `"Cancelado"` |
| `direccionEnvio` | string | Dirección completa de entrega |
| `productos` | array | Lista de objetos con `sku`, `nombre`, `cantidad`, `precioUnitario` |

> ✅ El campo `estado` **solo puede contener los 4 valores exactos listados** (case-sensitive).

---

## 🖥️ Interfaz de Administración

### Ruta
- `/admin/pedidos`

### Componentes obligatorios

1. **Filtros de estado**:
   - Grupo de botones o select con opciones:
     - `"Todos"`
     - `"Pendiente de envío"`
     - `"Enviado"`
     - `"Entregado"`
     - `"Cancelado"`

2. **Tabla de pedidos** (solo si hay pedidos):
   | Columna | Contenido |
   |--------|----------|
   | ID | `pedido-123` |
   | Cliente | `María López` |
   | Fecha | `2025-04-05 14:30` |
   | Total | `$125.90` |
   | Estado | Badge con color según estado |
   | Acciones | Botón `"Ver"` + select/dropdown para cambiar estado |

3. **Vista detallada de pedido** (modal o nueva ruta `/admin/pedidos/{id}`):
   - Información del cliente y envío.
   - Lista de productos con cantidades y precios.
   - Estado actual (editable solo si el pedido no está "Cancelado" o "Entregado").

4. **Cambio de estado**:
   - Dropdown con estados permitidos **según reglas de transición** (ver más abajo).
   - Botón de confirmación (no requiere modal adicional si es dropdown in-place).

---

## ✅ Criterios de Aceptación – Implementación Detallada

### AC 1: Visualización de todos los pedidos
- **Acción**: Acceder a `/admin/pedidos`.
- **Resultado**:
  - Se muestra una tabla con **todos los pedidos** (sin paginación en MVP, o con paginación básica si hay >50).
  - Cada fila incluye: `id`, `clienteNombre`, `fecha`, `total`, `estado`.
- **Formato de fecha**: `YYYY-MM-DD HH:mm` (ej: `2025-04-05 14:30`).

---

### AC 2: Filtrar pedidos por estado
- **Acción**: Seleccionar un filtro (ej: `"Enviado"`).
- **Resultado**:
  - La tabla se actualiza **sin recargar la página**.
  - Solo se muestran los pedidos con `estado === "Enviado"`.
  - Si no hay resultados: mensaje `"No se encontraron pedidos con ese estado."`

> ✅ El filtro `"Todos"` muestra todos los pedidos.

---

### AC 3: Actualizar el estado de un pedido
- **Condiciones**:
  - El pedido **no está en estado "Entregado" ni "Cancelado"** (estos son estados terminales).
  - Solo se permiten transiciones válidas:
    - `"Pendiente de envío"` → `"Enviado"` o `"Cancelado"`
    - `"Enviado"` → `"Entregado"` o `"Cancelado"`
- **Acción**:
  1. Administrador cambia el estado desde un dropdown.
  2. Al seleccionar un nuevo estado válido, se envía `PATCH /admin/pedidos/{id}` con:
     ```json
     { "estado": "Enviado" }
     ```
  3. Backend valida transición.
  4. Si éxito:
     - Actualiza registro en BD.
     - Responde con el pedido actualizado.
     - Frontend actualiza el estado en la tabla **sin recargar**.
- **Resultado**: El nuevo estado es visible inmediatamente.

---

### AC 4: Ver detalles de un pedido
- **Acción**: Hacer clic en `"Ver"` en una fila de la tabla.
- **Resultado**:
  - Se abre una vista con:
    - **Cliente**: nombre, ID
    - **Envío**: dirección completa
    - **Productos**: lista con `nombre`, `cantidad`, `precioUnitario`, `subtotal`
    - **Total general**
    - **Estado actual** (editable si aplica)
    - **Fecha de creación**

> ✅ Los datos deben coincidir exactamente con los almacenados en la base de datos.

---

## 🚫 Reglas de Negocio Adicionales

### 🔁 Transiciones de estado permitidas
| Estado actual | Puede cambiar a |
|---------------|-----------------|
| Pendiente de envío | Enviado, Cancelado |
| Enviado | Entregado, Cancelado |
| Entregado | ❌ (no editable) |
| Cancelado | ❌ (no editable) |

> ⚠️ **No se permite retroceder** (ej: de "Enviado" a "Pendiente").

### 🧾 Visualización de estados
- Usa **badges de color** para claridad:
  - `"Pendiente de envío"` → naranja
  - `"Enviado"` → azul
  - `"Entregado"` → verde
  - `"Cancelado"` → rojo

### 🔍 Búsqueda (fuera de alcance, pero no prohibida)
- **No se requiere** implementar búsqueda por ID, cliente o fecha en esta HU.
- **Pero si se implementa**, debe ser opcional y no afectar los criterios de aceptación.

### 📬 Notificaciones al cliente
- **Fuera de alcance** de esta HU.
- **No se debe implementar** lógica de notificación en esta historia.

---

## 🔄 Flujo de Actualización de Estado (Ejemplo)

1. Pedido en estado `"Pendiente de envío"`.
2. Administrador selecciona `"Enviado"` en dropdown.
3. Frontend envía:
   ```json
   PATCH /admin/pedidos/pedido-123
   { "estado": "Enviado" }