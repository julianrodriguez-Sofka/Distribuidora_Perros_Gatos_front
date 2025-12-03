# 🚀 Guía de Instalación Rápida

## ⚠️ ANTES DE EMPEZAR

Este proyecto requiere configurar variables de entorno. **NO TE PREOCUPES**, es muy fácil.

---

## 📋 Requisitos Previos

- ✅ Node.js 14 o superior instalado
- ✅ Backend corriendo en `http://localhost:8000`

---

## 🔧 Instalación en 3 Pasos

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

**Opción A - Automática (Recomendada para Windows):**

```powershell
powershell -ExecutionPolicy Bypass -File setup-env.ps1
```

Este script te guiará interactivamente.

**Opción B - Manual:**

```bash
# Linux/Mac
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

### Paso 3: Iniciar Aplicación

```bash
npm start
```

¡Eso es todo! La aplicación se abrirá en http://localhost:3000

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "No se encuentra el archivo .env"

**Solución:**
```bash
cp .env.example .env
npm start
```

### ❌ Error: "Network Error" o "Cannot connect to API"

**Causa:** El backend no está corriendo.

**Solución:**
1. Ve a la carpeta del backend
2. Ejecuta: `docker-compose up -d`
3. Espera 30 segundos
4. Vuelve al frontend y ejecuta: `npm start`

### ❌ Error: "REACT_APP_API_URL is not defined"

**Causa:** El archivo `.env` no tiene la configuración correcta.

**Solución:**
```bash
# Ejecuta el script de configuración
powershell -ExecutionPolicy Bypass -File setup-env.ps1
```

O edita manualmente el archivo `.env` y agrega:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### ❌ Puerto 3000 ya está en uso

**Solución:**
```powershell
# Encontrar y matar el proceso
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Luego reinicia
npm start
```

---

## 🔍 Verificación de Configuración

Para verificar que todo está bien configurado:

```bash
npm run setup
```

Este comando verificará que:
- ✅ Existe el archivo `.env`
- ✅ La variable `REACT_APP_API_URL` está configurada
- ✅ El formato de la URL es correcto

---

## 📝 Configuración Avanzada

### Cambiar la URL del Backend

Edita el archivo `.env`:

```env
# Para backend local
REACT_APP_API_URL=http://localhost:8000/api

# Para backend en otra máquina
REACT_APP_API_URL=http://192.168.1.100:8000/api

# Para producción
REACT_APP_API_URL=https://api.midominio.com/api
```

**IMPORTANTE:** Después de cambiar el `.env`, reinicia el servidor:
```bash
# Detén el servidor (Ctrl+C)
# Inicia nuevamente
npm start
```

---

## 🎯 Instalación Completa (Primer Uso)

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Distribuidora_Perros_Gatos_front

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
powershell -ExecutionPolicy Bypass -File setup-env.ps1

# 4. Iniciar aplicación
npm start
```

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Node.js instalado (`node --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` existe
- [ ] Variable `REACT_APP_API_URL` configurada en `.env`
- [ ] Backend corriendo en puerto 8000 (`curl http://localhost:8000/docs`)
- [ ] Puerto 3000 disponible

---

## 🆘 Ayuda Adicional

Si después de seguir todos los pasos aún tienes problemas:

1. Ejecuta el script de verificación del sistema completo:
   ```bash
   cd ..
   powershell -ExecutionPolicy Bypass -File verificar-sistema.ps1
   ```

2. Revisa la documentación completa: `VERIFICACION_CONECTIVIDAD.md`

3. Verifica los logs del backend:
   ```bash
   cd ../Distribuidora_Perros_Gatos_back
   docker logs distribuidora-api --tail 50
   ```

---

## 📚 Archivos Importantes

- `.env` - Variables de entorno (NO subir a git)
- `.env.example` - Plantilla de variables
- `setup-env.ps1` - Script de configuración automática
- `check-env.js` - Verificación de variables
- `package.json` - Dependencias y scripts

---

**¿Listo?** Ejecuta `npm start` y ve a http://localhost:3000 🎉
