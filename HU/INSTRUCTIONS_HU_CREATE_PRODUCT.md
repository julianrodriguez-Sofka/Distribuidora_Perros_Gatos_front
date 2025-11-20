# 🧩 Instrucciones Técnicas para Implementar la HU: "Gestión de Productos: Crear Nuevo Producto"

**Objetivo**: Generar una interfaz y lógica completa para que un administrador pueda crear un nuevo producto en el sistema **Distribuidora Perros y Gatos**, cumpliendo con todos los criterios de aceptación definidos.

> 🔍 Este documento está escrito para ser **consumido y ejecutado por IA**. Cada paso debe interpretarse literalmente. No asumas comportamientos no especificados.

---

## 🧾 Datos del Producto (Estructura Obligatoria)

Todo producto debe tener los siguientes campos **almacenados en la base de datos**:

| Campo | Tipo | Requerido | Validación |
|------|------|----------|------------|
| `nombre` | string | ✅ | Único en el sistema. Mínimo 2 caracteres. |
| `descripcion` | string | ✅ | Mínimo 10 caracteres. Texto libre. |
| `precio` | number (float) | ✅ | > 0. Solo valores numéricos positivos. |
| `peso` | number (integer) | ✅ | > 0. Representa **gramos** (entero). Ej: 500 = 500g, 1000 = 1kg. |
| `categoria` | string | ✅ | Debe coincidir con una categoría existente (ej: "Perros", "Gatos"). |
| `subcategoria` | string | ✅ | Debe coincidir con una subcategoría existente dentro de la categoría seleccionada (ej: "Alimento", "Juguetes"). |
| `imagenUrl` | string | ✅ | URL de la imagen subida (almacenada en sistema de archivos o CDN). |

> ⚠️ **Nota**: El peso se almacena **siempre en gramos como entero**, sin importar si el usuario piensa en kg o g. La UI puede mostrar "1 kg", pero el valor guardado es `1000`.

---

## 🖥️ Interfaz de Usuario (Formulario de Creación)

### Ubicación
- Ruta: `/admin/productos/nuevo`
- Accesible solo para usuarios con rol `admin`.

### Campos del formulario (todos visibles)

1. **Nombre del producto** (input de texto)
2. **Descripción detallada** (textarea, ≥10 caracteres)
3. **Precio** (input numérico con `step="0.01"`, solo positivos)
4. **Peso** (input numérico entero ≥1, con etiqueta: "Peso en gramos")
5. **Categoría** (select con opciones predefinidas: `["Perros", "Gatos"]`)
6. **Subcategoría** (select dinámico: se actualiza según categoría)
   - Si `Perros`: `["Alimento", "Juguetes", "Accesorios", "Higiene"]`
   - Si `Gatos`: `["Alimento", "Rascadores", "Arena", "Accesorios"]`
7. **Imagen** (input tipo `file`)
   - Atributo: `accept=".jpg,.jpeg,.png,.svg,.webp"`
   - Validación al subir: tamaño ≤ 10 MB

### Botón
- Etiqueta: `"Guardar producto"`
- Tipo: `submit`

---

## ✅ Criterios de Aceptación – Implementación Detallada

### AC 1: Creación exitosa
- **Condiciones**:
  - Todos los campos requeridos están completos y válidos.
  - `nombre` no existe en la base de datos.
- **Acciones**:
  1. Enviar datos al endpoint `POST /api/admin/productos`.
  2. Subir imagen a `/uploads/products/` (o simulación en memoria si es MVP).
  3. Guardar registro en base de datos.
  4. Mostrar **Toast de éxito**: `"Producto creado exitosamente"`.
  5. Redirigir a `/admin/productos` o mantener en formulario con estado limpio.
- **Resultado esperado**: El producto aparece en el catálogo público.

---

### AC 2: Validación de campos obligatorios
- **Condiciones**: Al hacer clic en "Guardar", al menos un campo requerido está vacío.
- **Acciones**:
  - **No enviar** la petición al backend.
  - Mostrar **Toast de error**: `"Por favor, completa todos los campos obligatorios."`
  - Resaltar visualmente los campos faltantes (borde rojo).
- **Restricción**: **NO usar** `window.alert()`. Usar solo componente `Toast`.

---

### AC 3: Asociación a categorías y subcategorías
- **Condiciones**: Categoría y subcategoría seleccionadas desde las listas predefinidas.
- **Acciones**:
  - El valor de `categoria` y `subcategoria` debe coincidir **exactamente** con las opciones permitidas.
  - Al guardar, el producto debe poder filtrarse en la tienda por esas clasificaciones.
- **Resultado esperado**: 
  - Al visitar `/productos?categoria=Perros&subcategoria=Alimento`, el producto aparece.

---

### AC 4: Gestión de imagen y validación numérica

#### Validación de imagen:
- **Formatos permitidos**: `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`
- **Tamaño máximo**: 10 MB (10,485,760 bytes)
- **Si el archivo no cumple**:
  - Mostrar **Toast de error**: `"Formato o tamaño de imagen no válido. Usa JPG, PNG, SVG o WebP (máx. 10 MB)."`

#### Validación numérica (precio y peso):
- **Precio**:
  - Solo aceptar números > 0.
  - Si se ingresa texto o ≤ 0 → marcar como inválido.
- **Peso**:
  - Solo aceptar enteros ≥ 1.
  - Mostrar ayuda: *"Ingresa el peso en gramos (ej: 500 para 500g)"*

#### Nombre duplicado:
- **Si el nombre ya existe** (comparación case-insensitive):
  - Mostrar **Toast de error**: `"Ya existe un producto con ese nombre."`
  - No guardar.

---

## 🔁 Flujo de Validación (Frontend + Backend)

1. **Frontend** valida:
   - Campos vacíos.
   - Formato de imagen (extensión y tamaño usando File API).
   - Valores numéricos > 0.
2. **Si pasa frontend**, envía a `POST /api/admin/productos`.
3. **Backend** valida:
   - Nombre único (case-insensitive).
   - Categoría/subcategoría válidas.
   - Imagen no maliciosa (en MVP: asume que el frontend ya validó).
4. **Si backend rechaza**, devuelve JSON con error → mostrar Toast correspondiente.

---

## 🧪 Ejemplo de Payload Válido

```json
{
  "nombre": "Croquetas Premium para Gatos",
  "descripcion": "Alimento balanceado con proteína de salmón, ideal para gatos adultos.",
  "precio": 2499,
  "peso": 1500,
  "categoria": "Gatos",
  "subcategoria": "Alimento",
  "imagenFile": "<binary>"
}