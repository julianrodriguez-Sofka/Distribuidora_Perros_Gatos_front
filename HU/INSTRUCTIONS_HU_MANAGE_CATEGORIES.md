# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Gestión de Catálogo: Crear y Administrar Categorías y Subcategorías"

**Objetivo**: Permitir al administrador crear, visualizar y modificar categorías y subcategorías de productos, manteniendo una estructura jerárquica clara y consistente, sin permitir duplicados ni eliminaciones peligrosas.

> 🔍 Este documento está escrito para ser **consumido y ejecutado literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🗂️ Modelo de Datos (Estructura Obligatoria)

### Categoría Principal
- `id`: string (UUID o entero autoincremental)
- `nombre`: string **único**, case-insensitive
- `tipo`: "categoria"
- **No tiene padre**

### Subcategoría
- `id`: string
- `nombre`: string **único dentro de su categoría padre**, case-insensitive
- `tipo`: "subcategoria"
- `categoriaPadreId`: referencia a una categoría principal

> ⚠️ **Regla crítica**:  
> - Dos categorías principales **no pueden tener el mismo nombre**.  
> - Dos subcategorías **bajo la misma categoría** no pueden tener el mismo nombre.  
> - Pero `"Juguetes"` puede existir bajo `"Perros"` y también bajo `"Gatos"` (son contextos distintos).

---

## 🖥️ Interfaz de Usuario (Panel de Administración)

### Ruta
- `/admin/categorias`

### Elementos visibles
1. **Lista jerárquica**:
   - Cada categoría principal se muestra como un encabezado.
   - Debajo, sus subcategorías en una lista anidada.
   - Ejemplo visual:
     ```
     Perros
     ├── Alimento
     ├── Juguetes
     └── Accesorios

     Gatos
     ├── Alimento
     ├── Arena
     └── Rascadores
     ```

2. **Formulario para crear categoría principal**:
   - Campo: `Nombre de la categoría` (input de texto)
   - Botón: `"Crear Categoría"`

3. **Formulario para crear subcategoría**:
   - Select: `Categoría padre` (solo categorías existentes)
   - Campo: `Nombre de la subcategoría` (input de texto)
   - Botón: `"Crear Subcategoría"`

4. **Edición in-place (opcional pero recomendada)**:
   - Al hacer clic en el nombre de una categoría o subcategoría, se convierte en input editable.
   - Botón: `"Guardar"` o `"Cancelar"`.

> ❌ **No se muestra botón de "Eliminar"** si la categoría/subcategoría tiene productos asociados.  
> ✅ **Siempre se permite "Editar nombre"**, incluso si tiene productos.

---

## ✅ Criterios de Aceptación – Implementación Detallada

### AC 1: Creación exitosa de categoría principal
- **Entrada válida**: nombre único (ej: `"Aves"`)
- **Acciones**:
  1. Enviar a `POST /admin/categorias` con `{ "nombre": "Aves", "tipo": "categoria" }`
  2. Si éxito → mostrar **Toast**: `"Categoría creada exitosamente."`
  3. Actualizar lista en UI sin recargar.
- **Resultado**: La nueva categoría aparece en el listado y es seleccionable al crear productos.

---

### AC 2: Creación exitosa de subcategoría
- **Entrada válida**: 
  - Categoría padre: `"Perros"` (ID válido)
  - Nombre: `"Juguetes"` (único bajo `"Perros"`)
- **Acciones**:
  1. Enviar a `POST /api/admin/categorias` con:
     ```json
     {
       "nombre": "Juguetes",
       "tipo": "subcategoria",
       "categoriaPadreId": "id-de-perros"
     }
     ```
  2. Si éxito → **Toast**: `"Subcategoría creada exitosamente."`
  3. Aparece bajo `"Perros"` en la lista.
- **Resultado**: Seleccionable al crear/editar productos.

---

### AC 3: Validación de nombres únicos
- **Casos de error**:
  - Crear categoría `"Perros"` si ya existe.
  - Crear subcategoría `"Alimento"` bajo `"Perros"` si ya existe ahí.
- **Acciones**:
  - Backend responde con error 409: `{ "error": "nombre_duplicado" }`
  - Frontend muestra **Toast**: `"Ya existe una categoría o subcategoría con ese nombre."`
  - **No se crea** el registro.
- **Validación**: case-insensitive (ej: `"PERROS"` = `"Perros"`).

---

### AC 4: Visualización clara de la estructura
- **Requisitos UI**:
  - Las categorías y subcategorías se muestran en **árbol visual** (jerarquía clara).
  - Cada elemento debe tener un **indicador visual** de su tipo (ícono o etiqueta).
  - Si una categoría tiene productos, debe mostrarse un ícono o texto como:  
    `"📍 12 productos"` (solo informativo, no editable para eliminación).

---

## 🚫 Reglas de Negocio Adicionales (Obligatorias)

### ❌ Eliminación prohibida
- **Nunca se permite eliminar** una categoría o subcategoría que tenga **al menos 1 producto asociado**.
- Si no hay productos, **opcionalmente se puede permitir eliminación**, pero **no es requerido en esta HU**.
- **Enfoque preferido para MVP**: **ocultar botón de eliminar siempre**. Solo permitir **edición de nombre**.

### ✏️ Edición de nombre (siempre permitida)
- Endpoint: `PATCH /api/admin/categorias/{id}`
- Payload: `{ "nombre": "Nuevo nombre" }`
- Validación: el nuevo nombre debe ser único en su contexto (según reglas de AC 3).
- Si éxito → actualizar en UI + Toast de confirmación.

### ∞ Sin límite de categorías
- El sistema debe escalar a **cientos de categorías/subcategorías**.
- No imponer límites artificiales.

---

## 🔁 Flujo de Validación (Frontend + Backend)

1. **Frontend** valida:
   - Campo de nombre no vacío.
   - Categoría padre seleccionada (para subcategoría).
2. **Envía petición a backend**.
3. **Backend** valida:
   - Unicidad del nombre en contexto correcto.
   - Existencia de categoría padre (para subcategoría).
4. **Si error**, responde con código HTTP y mensaje estandarizado.
5. **Frontend** muestra **Toast** (nunca `alert()`).

---

## 🧪 Ejemplos de Payloads Válidos

### Crear categoría
```json
{ "nombre": "Perros ", "tipo": "categoria" }