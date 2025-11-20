# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Gestión de Inventario: Reabastecer Existencias de Productos"

**Objetivo**: Permitir al administrador buscar un producto existente, ver su stock actual, y **agregar unidades positivas** a su inventario, registrando quién hizo el cambio y cuándo. Todo debe validarse y notificarse mediante **Toast alerts**.

> 🔍 Este documento está escrito para ser **consumido literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🗃️ Modelo de Datos Relevante

### Tabla: `productos`
| Campo | Tipo | Descripción |
|------|------|-------------|
| `id` | string | UUID o ID único |
| `nombre` | string | Nombre del producto |
| `stock` | integer | Cantidad actual en inventario (≥ 0) |

### Tabla: `historial_inventario` (obligatoria)
| Campo | Tipo | Descripción |
|------|------|-------------|
| `id` | string | UUID |
| `productoId` | string | Referencia a `productos.id` |
| `cantidadAnterior` | integer | Stock antes del cambio |
| `cantidadNueva` | integer | Stock después del cambio |
| `cantidadAgregada` | integer | Valor positivo agregado |
| `usuarioId` | string | ID del administrador que realizó la acción |
| `usuarioNombre` | string | Nombre legible del administrador (ej: "María López") |
| `fechaHora` | timestamp | Fecha y hora en formato ISO 8601 (UTC o zona local clara) |

> ✅ Cada operación de reabastecimiento **debe crear un registro en `historial_inventario`**.

---

## 🖥️ Interfaz de Usuario (Panel de Inventario)

### Ruta
- `/admin/inventario`

### Componentes obligatorios

1. **Barra de búsqueda**:
   - Placeholder: `"Buscar por nombre o ID de producto"`
   - Filtrado en tiempo real (frontend) o búsqueda por API (backend).
   - Al seleccionar un producto, se muestra su ficha de reabastecimiento.

2. **Ficha de producto seleccionado** (solo visible tras selección):
   - Nombre del producto
   - **Stock actual**: mostrado claramente (ej: `"Existencias actuales: 7 unidades"`)
   - Campo de entrada: `"Unidades a agregar"` (input numérico)
   - Botón: `"Actualizar Existencias"`

3. **Notificación automática si stock ≥ 10**:
   - Tan pronto se carga la ficha de un producto con `stock >= 10`, mostrar **Toast informativo**:
     > `"Este producto tiene stock suficiente."`

---

## ✅ Criterios de Aceptación – Implementación Detallada

### AC 1: Reabastecimiento exitoso
- **Condiciones**:
  - Producto seleccionado.
  - Cantidad ingresada: entero **positivo** (≥ 1).
- **Acciones**:
  1. Enviar a `PATCH /api/admin/inventario/{productoId}` con:
     ```json
     {
       "cantidadAgregada": 25,
       "usuarioId": "usr-789",
       "usuarioNombre": "Carlos Méndez"
     }
     ```
  2. Backend:
     - Actualiza `stock = stock + cantidadAgregada`.
     - Inserta registro en `historial_inventario`.
  3. Frontend:
     - Muestra **Toast de éxito**: `"Existencias actualizadas exitosamente."`
     - Actualiza el valor de stock mostrado sin recargar.

---

### AC 2: Validación de cantidad a agregar
- **Condiciones de error**:
  - Campo vacío.
  - Valor ≤ 0.
  - Texto no numérico (ej: "abc", "-5", "0").
- **Acciones**:
  - **No enviar** petición al backend.
  - Mostrar **Toast de error**: `"La cantidad a agregar debe ser un número entero positivo."`
  - Resaltar campo como inválido (borde rojo).

> ⚠️ **Restricción**: Nunca usar `window.alert()`. Solo componente `Toast`.

---

### AC 3: Búsqueda y selección de producto
- **Mecanismo**:
  - La búsqueda debe coincidir con `nombre` (case-insensitive) o `id` del producto.
  - Resultados deben mostrarse en una lista desplegable o tabla.
  - Al hacer clic en un resultado, se carga su ficha de reabastecimiento.
- **Resultado esperado**: El usuario puede encontrar un producto aunque tenga cientos en el catálogo.

---

### AC 4: Visualización de existencias actuales + historial
- **Visualización**:
  - Al seleccionar un producto, se muestra:  
    `"Existencias actuales: X unidades"`
- **Notificación automática**:
  - Si `X >= 10`, **inmediatamente** al cargar la ficha, mostrar **Toast**:  
    `"Este producto tiene stock suficiente."`
- **Historial visible (opcional en MVP, pero registro obligatorio)**:
  - En una sección expandida o en tooltip, debe poder verse:
    - Última modificación:  
      `"Última actualización por: Ana Rojas | 2025-04-05 14:30"`
  - Este dato **debe provenir del último registro en `historial_inventario`**.

---

## 🔁 Flujo Completo de la Operación

1. Administrador entra a `/admin/inventario`.
2. Busca `"Alimento Gato Premium"`.
3. Selecciona el producto → se muestra ficha con `stock: 3`.
4. Ingresa `20` en "Unidades a agregar".
5. Clic en `"Actualizar Existencias"`.
6. Frontend valida → envía a backend.
7. Backend:
   - Actualiza stock: `3 + 20 = 23`
   - Inserta en `historial_inventario`
8. Frontend:
   - Muestra Toast de éxito.
   - Actualiza stock a `23`.
   - **No muestra Toast de "stock suficiente"** (porque se muestra solo al **cargar** la ficha, no tras actualización).

> ✨ **Nota**: El Toast de "stock suficiente" **solo se dispara al seleccionar/cargar** el producto, **no** tras la actualización.

---

## 🧪 Ejemplos de Payload Válido

```json
{
  "cantidadAgregada": 50,
  "usuarioId": "admin-001",
  "usuarioNombre": "Lucía Fernández"
}