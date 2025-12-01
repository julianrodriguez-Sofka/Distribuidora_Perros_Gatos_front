# Solución: Error "Invalid time value" en Página de Pedidos

## Problema Identificado

Al acceder a la sección de "Pedidos" en el área administrativa, se mostraba un error en rojo:
> "RangeError: Invalid time value"

El error ocurría en la función `formatDate` cuando intentaba formatear valores de fecha que eran `null`, `undefined`, o valores inválidos.

## Causa Raíz

1. **Función `formatDate` no manejaba valores nulos**: La función intentaba crear un objeto `Date` sin validar si el valor era válido.
2. **Inconsistencia en nombres de campos**: El backend devolvía `fecha_creacion` pero el frontend buscaba `fecha`.
3. **Falta de información del cliente**: El backend no incluía el nombre del cliente en la respuesta.

## Solución Implementada

### 1. Función `formatDate` Mejorada (`src/utils/validation.js`)

```javascript
export const formatDate = (dateString) => {
  // Handle null, undefined, or empty values
  if (!dateString) {
    return 'N/A';
  }
  
  // Try to parse the date
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date value:', dateString);
    return 'Fecha inválida';
  }
  
  try {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Fecha inválida';
  }
};
```

**Mejoras:**
- ✅ Valida valores nulos/undefined antes de procesar
- ✅ Verifica que la fecha sea válida antes de formatear
- ✅ Maneja errores con try-catch
- ✅ Retorna valores por defecto seguros ('N/A' o 'Fecha inválida')

### 2. Backend Actualizado (`app/routers/orders.py`)

La función `_pedido_to_response` ahora:
- ✅ Incluye información del cliente (nombre e ID)
- ✅ Formatea fechas a ISO string para compatibilidad
- ✅ Proporciona múltiples alias de campos para compatibilidad con el frontend:
  - `fecha_creacion`, `fecha`, `created_at`
  - `clienteNombre`, `cliente_nombre`
  - `clienteId`, `cliente_id`
  - `direccion_entrega`, `direccionEnvio`

### 3. Frontend Actualizado (`src/pages/Admin/pedidos/index.js`)

**En la tabla de pedidos:**
- ✅ Usa múltiples campos posibles para obtener la fecha
- ✅ Usa múltiples campos posibles para obtener el nombre del cliente
- ✅ Maneja valores nulos de forma segura

**En el modal de detalles:**
- ✅ Usa campos alternativos si los principales no existen
- ✅ Muestra valores por defecto ('N/A') cuando falta información

## Archivos Modificados

### Backend
- `backend/api/app/routers/orders.py`: Función `_pedido_to_response` mejorada

### Frontend
- `src/utils/validation.js`: Función `formatDate` mejorada con validaciones
- `src/pages/Admin/pedidos/index.js`: Manejo robusto de datos del pedido

## Resultado

✅ La página de pedidos ahora carga correctamente sin errores
✅ Las fechas se muestran correctamente o muestran 'N/A' si no están disponibles
✅ La información del cliente se muestra correctamente
✅ El sistema es más robusto ante datos faltantes o inválidos

## Pruebas Realizadas

- ✅ Página de pedidos carga sin errores
- ✅ Fechas se formatean correctamente
- ✅ Valores nulos se manejan apropiadamente
- ✅ Información del cliente se muestra correctamente
- ✅ Modal de detalles funciona correctamente

