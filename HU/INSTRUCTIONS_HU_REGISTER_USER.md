# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Registro de Nuevo Cliente con Verificación de Correo"

**Objetivo**: Permitir a un cliente potencial registrarse con datos válidos, recibir un código de verificación por correo, y activar su cuenta de forma segura, con validaciones claras y retroalimentación inmediata mediante **Toast alerts**.

> 🔍 Este documento está escrito para ser **consumido literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🗃️ Modelo de Datos del Usuario (Registro)

### Campos obligatorios
| Campo | Tipo | Validación |
|------|------|------------|
| `nombreCompleto` | string | ≥ 2 caracteres, solo letras y espacios |
| `cedula` | string | ≥ 6 caracteres, solo dígitos |
| `email` | string | Formato válido con `@` y dominio (ej: `usuario@dominio.com`) |
| `telefono` | string | ≥ 8 dígitos, puede incluir `+`, `-`, espacios |
| `password` | string | Ver reglas de contraseña más abajo |
| `tienePerros` | boolean | Opcional (por defecto: `false`) |
| `tieneGatos` | boolean | Opcional (por defecto: `false`) |

### Estado de la cuenta
- Al registrarse: `estado = "pendiente_verificacion"`
- Tras verificar código: `estado = "activo"`

---

## 🔐 Reglas de Contraseña (AC 3)

La contraseña debe cumplir **TODAS** las siguientes condiciones:
- Mínimo **10 caracteres**
- Al menos **1 letra mayúscula** (`A-Z`)
- Al menos **1 número** (`0-9`)
- Al menos **1 carácter especial** (ej: `! @ # $ % & *`)

> ✅ Ejemplo válido: `"MiClave2025!"`  
> ❌ Ejemplo inválido: `"clave123"` (falta mayúscula, especial, y <10)

---

## 🖥️ Flujo de Registro (Paso a Paso)

### Paso 1: Formulario de registro (`/registro`)
Campos visibles:
- Nombre completo (texto)
- Cédula (texto, solo números)
- Correo electrónico (email)
- Teléfono (texto)
- Contraseña (password)
- Confirmar contraseña (password)
- Preferencias de mascotas (checkboxes):
  - ☑️ Perros
  - ☑️ Gatos
- Botón: `"Registrarse"`

### Paso 2: Validación en frontend (AC 2, AC 3)
- **Antes de enviar**, validar:
  - Todos los campos obligatorios completos.
  - Correo con formato válido (debe contener `@` y `.`).
  - Cédula y teléfono: solo dígitos y símbolos permitidos.
  - Contraseña cumple reglas.
  - Contraseñas coinciden.
- **Si hay error**, mostrar **Toast por cada campo inválido** (o uno general si se prefiere):
  - `"El correo debe contener '@'."`
  - `"La contraseña debe tener al menos 10 caracteres, 1 mayúscula, 1 número y 1 carácter especial."`

> ⚠️ **Nunca usar `window.alert()`**. Solo **Toast alerts**.

### Paso 3: Envío al backend
- Si pasa validación, enviar `POST /api/auth/register` con:
  ```json
  {
    "nombreCompleto": "Ana Rojas",
    "cedula": "12345678",
    "email": "ana@ejemplo.com",
    "telefono": "+56912345678",
    "password": "MiClave2025!",
    "tienePerros": true,
    "tieneGatos": false
  }