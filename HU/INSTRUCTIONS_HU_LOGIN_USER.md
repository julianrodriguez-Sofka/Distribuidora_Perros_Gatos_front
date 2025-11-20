# 🧩 Instrucciones Técnicas para Implementar la HU:  
## "Inicio de Sesión de Clientes Registrados"

**Objetivo**: Permitir a un cliente registrado autenticarse de forma segura con credenciales válidas, acceder a funcionalidades personalizadas, y gestionar su carrito con fusión de sesiones, usando **JWT y cookies seguras**.

> 🔍 Este documento está escrito para ser **consumido literalmente por una IA**. No infieras comportamientos no especificados.

---

## 🔐 Modelo de Autenticación

- **Token**: JWT (JSON Web Token)
- **Almacenamiento**: HTTP-only, Secure, SameSite=Strict cookie (`auth_token`)
- **Duración del token**: 7 días (renovable si es necesario en futuras HUs)
- **Cifrado de contraseñas**: bcrypt (costo 12) en base de datos
- **Estado de cuenta**: Solo usuarios con `estado = "activo"` pueden iniciar sesión

---

## 🖥️ Interfaz de Inicio de Sesión

### Ruta
- `/login`

### Formulario obligatorio
- Campo: `"Correo electrónico"` (tipo `email`)
- Campo: `"Contraseña"` (tipo `password`)
- Botón: `"Iniciar Sesión"`
- Enlaces visibles debajo del botón:
  - `"¿No tienes cuenta? Regístrate"` → enlace a `/registro`
  - `"¿Olvidaste tu contraseña?"` → enlace a `/recuperar-contrasena`

> ✅ Estos enlaces **siempre deben estar visibles** (AC 3).

---

## ✅ Criterios de Aceptación – Implementación Detallada

### AC 1: Inicio de sesión exitoso
- **Condiciones**:
  - Usuario existe en BD con `email` y `password` coincidentes.
  - `estado = "activo"`.
- **Acciones**:
  1. Enviar `POST /api/auth/login` con:
     ```json
     { "email": "usuario@ejemplo.com", "password": "MiClave2025!" }
     ```
  2. Backend:
     - Valida credenciales.
     - Genera JWT con `userId`, `email`, `exp`.
     - Establece cookie `auth_token` (HTTP-only, Secure, SameSite=Strict).
  3. Frontend:
     - Recibe respuesta 200.
     - **Redirección**:
       - Si venía de `/carrito` → redirigir a `/carrito`
       - Si no, redirigir a `/`
     - Muestra **Toast de bienvenida**: `"¡Bienvenido de nuevo!"` (opcional pero recomendado).

---

### AC 2: Inicio de sesión fallido
- **Condiciones**:
  - Email no existe.
  - Contraseña incorrecta.
  - Cuenta no activa (`estado ≠ "activo"`).
- **Acciones**:
  - Backend responde con `401 Unauthorized`.
  - **Mensaje de error genérico** (nunca revelar si el email existe):
    > `"Correo o contraseña incorrectos."`
  - Mostrar este mensaje como **Toast alert**.
  - **No establecer cookie ni token**.

> ⚠️ **Nunca usar `window.alert()`**. Solo **Toast**.

---

### AC 3: Acceso a registro y recuperación
- **Requisito UI**:
  - En `/login`, deben aparecer **dos enlaces visibles**:
    - `"Registrarse"` → `/registro`
    - `"Recuperar Contraseña"` → `/recuperar-contrasena`
- **Resultado**: El usuario puede navegar a esas páginas sin restricción.

---

### AC 4: Requerimiento de inicio de sesión para comprar
- **Condiciones**:
  - Usuario **no autenticado**.
  - Tiene productos en el carrito (en `localStorage` o estado temporal).
  - Hace clic en `"Comprar"` o `"Proceder al pago"` en el carrito.
- **Acciones**:
  - **No redirigir directamente**.
  - Mostrar **Toast alert**:  
    `"Debes iniciar sesión o registrarte para continuar con la compra."`
  - Incluir botón en el Toast (o en el mensaje) que redirija a `/login`.

> ✅ El carrito **debe persistir** hasta que inicie sesión.

---

## 🛒 Fusión de Carritos (Regla Adicional)

- **Escenario**:
  - Usuario tiene carrito en `localStorage` en un dispositivo (carrito A).
  - Inicia sesión desde otro dispositivo donde ya tiene un carrito guardado en BD (carrito B).
- **Acción al iniciar sesión**:
  1. Backend o frontend (preferiblemente frontend) **fusiona ambos carritos**:
     - Para cada producto en carrito A:
       - Si existe en carrito B → sumar cantidades (sin exceder stock).
       - Si no existe → añadir.
     - Eliminar duplicados, respetar stock.
  2. Guardar carrito fusionado en BD y sincronizar en `localStorage`.
- **Resultado**: El usuario ve **todos sus productos** en un solo carrito.

> 💡 **Nota para MVP**: La fusión puede hacerse en el frontend tras login, consultando el carrito del servidor y combinándolo con el local.

---

## 🔒 Seguridad de Sesiones

- **JWT debe incluir**:
  ```json
  {
    "sub": "usr-123",
    "email": "usuario@ejemplo.com",
    "iat": 1712345678,
    "exp": 1712950478
  }