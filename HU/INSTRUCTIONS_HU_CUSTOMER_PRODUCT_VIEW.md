# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Visualización y Gestión de Productos en Inicio"

**Objetivo**: Permitir al cliente (autenticado o no) explorar productos por categorías, ver detalles clave, agregar al carrito con control de stock, e iniciar sesión cuando sea necesario para finalizar la compra.

> 🔍 Este documento está escrito para ser **consumido literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🗃️ Modelo de Datos del Producto (Frontend)

Cada producto visible en la página de inicio debe tener los siguientes campos **disponibles en el frontend**:

| Campo | Tipo | Requerido | Ejemplo |
|------|------|----------|--------|
| `id` | string | ✅ | `"prod-123"` |
| `nombre` | string | ✅ | `"Alimento Premium para Gatos"` |
| `precio` | number | ✅ | `24.99` |
| `peso` | number | ✅ | `1500` → se muestra como `"1.5 kg"` |
| `stock` | integer | ✅ | `0`, `5`, `20` |
| `categoria` | string | ✅ | `"Perros"` o `"Gatos"` |
| `subcategoria` | string | ✅ | `"Alimento"`, `"Accesorios"`, `"Productos de aseo"` |
| `imagenUrl` | string | ✅ | Ruta pública (ej: `/images/prod-123.webp`) |

> ✅ El peso se almacena en **gramos (entero)**, pero se **muestra en kg o g según conveniencia**:
> - Si `peso >= 1000` → mostrar como `"{peso/1000} kg"` (ej: `"1.5 kg"`)
> - Si `peso < 1000` → mostrar como `"{peso} g"` (ej: `"500 g"`)

---

## 🖥️ Estructura de la Página de Inicio

### Ruta
- `/` (página principal)

### Secciones obligatorias

1. **Banner / Navegación superior**:
   - Logo de la tienda.
   - Botones visibles:  
     - `"Registro"` → lleva a `/registro`  
     - `"Iniciar Sesión"` → lleva a `/login`

2. **Catálogo de productos** (AC 1):
   - Organizado en **dos grandes secciones**:  
     - **Perros**  
     - **Gatos**
   - Dentro de cada sección, **subsecciones**:  
     - `"Alimento"`  
     - `"Accesorios"`  
     - `"Productos de aseo"`
   - Cada subsección muestra una **cuadrícula de cards** con los productos correspondientes.

3. **Carrito (ícono en navbar)**:
   - Muestra número de productos (badge).
   - Al hacer clic, abre sidebar o página de resumen.

---

## 🎨 Card de Producto (AC 3)

Cada card debe mostrar **obligatoriamente**:

- **Imagen** del producto (formato WebP/JPG/PNG, con `alt` descriptivo)
- **Nombre** del producto
- **Precio** formateado: `"$24.99"`
- **Peso** formateado según regla de gramos/kg
- **Stock visible**:  
  - Si `stock > 0` → texto: `"Disponible: {stock} unidades"`  
  - Si `stock === 0` → texto: `"Sin existencias"`
- **Botón "Agregar al carrito"**:
  - Si `stock > 0` → botón habilitado
  - Si `stock === 0` → botón **deshabilitado** y con estilo opaco

> ✅ **No se permite** que un usuario añada un producto sin stock.

---

## 🛒 Carrito y Flujo de Compra (AC 2, AC 5)

### AC 2: Agregar producto al carrito
- **Condición**: `stock > 0`
- **Acción**: Clic en `"Agregar al carrito"`
- **Resultado**:
  - Producto se añade al carrito (almacenado en `localStorage` o estado global si no hay sesión).
  - Se muestra **Toast de éxito**: `"Producto añadido al carrito."`
  - El contador del ícono del carrito se actualiza.

> ⚠️ **No se reduce el stock real al añadir al carrito**.  
> El stock se valida **solo al confirmar el pedido** (HUs de backend).

### AC 5: Intento de compra sin autenticación
- **Condición**: Usuario no autenticado + clic en `"Comprar"` en carrito (o `"Proceder al pago"`)
- **Acción**:
  - **No redirigir directamente**.
  - Mostrar **Toast de advertencia**:  
    `"Debes iniciar sesión o registrarte para continuar con la compra."`
  - Incluir **botón en el Toast** (o modal) que redirija a `/login`.

> ✅ El carrito **debe persistir** en `localStorage` incluso sin sesión.

---

## 🔍 Organización por Categorías (AC 1)

### Estructura visual esperada:

```text
Perros
├── Alimento
│   ├── Card 1
│   └── Card 2
├── Accesorios
│   └── Card 3
└── Productos de aseo
    └── Card 4

Gatos
├── Alimento
│   └── Card 5
├── Accesorios
└── Productos de aseo