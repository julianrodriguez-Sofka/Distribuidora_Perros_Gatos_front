# Tests Frontend - Pendientes de Implementación

## ⚠️ Estado Actual

Los archivos de prueba han sido **removidos temporalmente** porque referencian módulos que no existen en la estructura actual del proyecto.

## 📝 Tests Creados (Plantillas)

Se crearon las siguientes plantillas de pruebas que necesitan ser adaptadas:

1. **OrderCard.test.js** - Pruebas de componente de tarjeta de pedido
2. **RatingStars.test.js** - Pruebas de componente de estrellas de calificación
3. **authActions.test.js** - Pruebas de acciones de Redux para autenticación
4. **authReducer.test.js** - Pruebas de reducer de Redux para autenticación
5. **useAuth.test.js** - Pruebas de custom hook de autenticación
6. **userFlow.integration.test.js** - Pruebas de integración E2E

## 🔧 Para Implementar las Pruebas

### Paso 1: Verificar Estructura del Proyecto

Primero necesitas verificar la estructura real de carpetas en `src/`:

```bash
# Ver estructura de componentes
Get-ChildItem -Path src/components -Recurse -Directory

# Ver estructura de Redux
Get-ChildItem -Path src/redux -Recurse -File

# Ver hooks
Get-ChildItem -Path src/hooks -Recurse -File
```

### Paso 2: Ajustar Imports

Los tests están configurados para esta estructura (ejemplo):

```javascript
// Estructura esperada por los tests
src/
├── components/
│   ├── Orders/
│   │   └── OrderCard.jsx
│   └── Ratings/
│       └── RatingStars.jsx
├── redux/
│   ├── actions/
│   │   └── authActions.js
│   ├── reducers/
│   │   └── authReducer.js
│   └── actionTypes.js
└── hooks/
    └── useAuth.js
```

**Debes ajustar los imports según tu estructura real**.

### Paso 3: Instalar Dependencias de Testing

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event redux-mock-store
```

### Paso 4: Crear Tests Adaptados

Crea tests específicos para los componentes y módulos que **realmente existen** en tu proyecto.

## 📚 Documentación

Ver documentación completa de testing en:
- `GUIA_PRUEBAS.md` - Guía completa de pruebas
- `TESTING_STATUS.md` - Estado actual del sistema de pruebas

## 🎯 Próximos Pasos Recomendados

1. **Mapear estructura real** del proyecto frontend
2. **Identificar componentes críticos** a probar
3. **Crear tests simples** primero (componentes básicos)
4. **Expandir gradualmente** a pruebas de integración
5. **Configurar CI/CD** cuando tengas cobertura básica

## 💡 Nota Importante

Los tests del **backend están listos** y funcionan correctamente. El frontend requiere adaptación a la estructura específica de este proyecto.
