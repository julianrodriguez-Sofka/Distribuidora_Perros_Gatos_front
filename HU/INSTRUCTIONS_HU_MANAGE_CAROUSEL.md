# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Gestión de Contenido: Administrar Carrusel de la Página de Inicio"

**Objetivo**: Permitir al administrador subir, ordenar y eliminar imágenes del carrusel principal de la tienda, con soporte opcional para enlaces, respetando un límite máximo de 5 imágenes y validando formatos.

> 🔍 Este documento está escrito para ser **consumido literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🗃️ Modelo de Datos del Carrusel

Cada entrada del carrusel debe almacenarse como un objeto con los siguientes campos:

| Campo | Tipo | Requerido | Validación |
|------|------|----------|------------|
| `id` | string | ✅ | UUID o ID autoincremental |
| `imagenUrl` | string | ✅ | URL de la imagen (almacenada en `/uploads/carousel/`) |
| `orden` | integer | ✅ | 1 a 5 (único por posición) |
| `enlaceUrl` | string | ❌ | Opcional. Si existe, debe ser URL válida (http/https) |
| `fechaCreacion` | timestamp | ✅ | Para auditoría |

> ⚠️ **Regla crítica**:  
> - El carrusel **nunca debe tener más de 5 imágenes**.  
> - Si hay **0 imágenes**, el carrusel **no se muestra** en la página de inicio.  
> - Si hay **1 a 5 imágenes**, se muestran **todas**, en el orden definido.

---

## 🖥️ Interfaz de Administración

### Ruta
- `/admin/carrusel`

### Componentes obligatorios

1. **Vista previa del carrusel actual**:
   - Miniaturas de las imágenes en el orden actual.
   - Si no hay imágenes: mensaje `"No hay imágenes en el carrusel."`

2. **Formulario para subir nueva imagen**:
   - Input tipo `file`:  
     `accept=".jpg,.jpeg,.png,.svg,.webp"`
   - Campo opcional: `"Enlace (URL)"` (input de texto)
   - Botón: `"Añadir al Carrusel"`

3. **Lista editable de imágenes actuales**:
   - Por cada imagen:
     - Miniatura
     - Campo editable: `"Orden"` (número entero entre 1 y 5)
     - Campo editable: `"Enlace"` (opcional)
     - Botón: `"Eliminar"`

4. **Botón de guardar cambios globales** (opcional pero recomendado si se edita en bloque):
   - O bien, cada acción (subir, eliminar, reordenar) se guarda inmediatamente.

---

## ✅ Criterios de Aceptación – Implementación Detallada

### AC 1: Subir y añadir imagen válida
- **Condiciones**:
  - Archivo con extensión: `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`
  - Tamaño ≤ 10 MB (10,485,760 bytes)
- **Acciones**:
  1. Validar en frontend (extensión + tamaño con File API).
  2. Si válido, subir a `POST /api/admin/carousel` con:
     ```json
     {
       "imagenFile": "<binary>",
       "enlaceUrl": "https://tienda.com/oferta-gatos"
     }
     ```
  3. Backend:
     - Rechaza si ya hay 5 imágenes.
     - Guarda imagen en `/uploads/carousel/{uuid}.{ext}`
     - Asigna `orden = max(órdenes existentes) + 1` (o 1 si está vacío).
  4. Frontend:
     - Muestra miniatura inmediatamente.
     - **No muestra Toast si no falla** (opcional: Toast de éxito: `"Imagen añadida al carrusel."`)

> ❌ Si el archivo no cumple:  
> - Mostrar **Toast**: `"Formato o tamaño no válido. Usa JPG, PNG, SVG o WebP (máx. 10 MB)."`

---

### AC 2: Eliminar imagen
- **Condiciones**: Imagen seleccionada en la lista.
- **Acciones**:
  1. Confirmación visual (no modal, solo botón de acción).
  2. Enviar `DELETE /api/admin/carousel/{id}`
  3. Backend elimina registro (y opcionalmente el archivo).
  4. Frontend:
     - Elimina miniatura de la lista.
     - Reajusta visualmente el carrusel.

> ✅ **Resultado**: La imagen ya no aparece en la página de inicio.

---

### AC 3: Reordenar imágenes
- **Mecanismo**:
  - El administrador modifica el campo `"Orden"` de una o más imágenes (valores enteros entre 1 y 5).
  - Al guardar (o al perder foco), se envía `PATCH /api/admin/carousel/reorder` con:
    ```json
    [
      { "id": "img-1", "orden": 1 },
      { "id": "img-2", "orden": 2 }
    ]
    ```
- **Validación**:
  - Backend rechaza si hay duplicados en `orden` o valores fuera de [1,5].
- **Resultado**:
  - El carrusel en la página de inicio muestra las imágenes **en el nuevo orden**.

> 💡 Alternativa MVP: Permitir arrastrar y soltar (drag & drop) con librería como `react-beautiful-dnd`, pero **el orden final debe guardarse como enteros 1-5**.

---

### AC 4: Visualización de imágenes actuales
- **Requisitos**:
  - Mostrar **todas las imágenes actuales** como miniaturas.
  - Mostrar su `orden` y `enlaceUrl` (si existe).
  - Si no hay imágenes: mostrar mensaje claro, **sin carrusel**.
- **En la página de inicio (frontend público)**:
  - Si `carousel.length === 0` → **no renderizar el carrusel**.
  - Si `1 ≤ carousel.length ≤ 5` → renderizar todas en orden ascendente por `orden`.

---

## 🚫 Reglas de Negocio Adicionales

### 📏 Límite de 5 imágenes
- **Nunca permitir más de 5**.
- Al intentar subir la sexta:
  - Mostrar **Toast**: `"El carrusel no puede tener más de 5 imágenes."`
  - **No subir** el archivo.

### 🔗 Enlaces opcionales
- Si se proporciona `enlaceUrl`, al hacer clic en la imagen del carrusel **debe redirigir** a esa URL.
- Si no se proporciona, la imagen **no es clickeable** (o redirige a `/`).

### 🖼️ Formatos y tamaño
- **Extensiones permitidas**: `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`
- **Tamaño máximo**: 10 MB
- **Validación en frontend y backend**

---

## 🧪 Ejemplo de Estado Válido del Carrusel

```json
[
  {
    "id": "car-001",
    "imagenUrl": "/uploads/carousel/oferta-gatos.webp",
    "orden": 1,
    "enlaceUrl": "https://tienda.com/gatos/oferta"
  },
  {
    "id": "car-002",
    "imagenUrl": "/uploads/carousel/nuevo-perro.jpg",
    "orden": 2,
    "enlaceUrl": null
  }
]