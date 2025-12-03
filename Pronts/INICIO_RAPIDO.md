# 🚀 Guía Rápida de Configuración - Frontend

## ⚡ Configuración Automática (Recomendado)

### Windows:

```powershell
# 1. Clonar el repositorio
git clone <url-frontend> -b Front_Refactor
cd Distribuidora_Perros_Gatos_front\Distribuidora_Perros_Gatos_front

# 2. Ejecutar script de configuración
.\setup.ps1

# El script hará todo automáticamente:
# - Instalar dependencias
# - Configurar .env
# - Verificar conexión con backend
# - Iniciar la aplicación
```

### Linux/Mac:

```bash
# 1. Clonar el repositorio
git clone <url-frontend> -b Front_Refactor
cd Distribuidora_Perros_Gatos_front/Distribuidora_Perros_Gatos_front

# 2. Ejecutar script de configuración
chmod +x setup.sh
./setup.sh
```

---

## 🎯 Acceso a la Aplicación

Una vez iniciado:
- **URL:** http://localhost:3000
- **Backend debe estar en:** http://localhost:8000

---

## ⚙️ Configuración Manual (Solo si falla la automática)

```powershell
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env

# 3. Iniciar aplicación
npm start
```

---

## 📝 Usuarios de Prueba

**Administrador:**
- Email: `admin@distribuidora.com`
- Password: `Admin123!`

**Cliente:**
- Regístrate en http://localhost:3000/register

---

## 🐛 Solución de Problemas Comunes

### "Cannot connect to backend"
```powershell
# Verifica que el backend esté corriendo
curl http://localhost:8000/

# Si no responde, inicia el backend primero
```

### "npm install fails"
```powershell
# Limpia caché y reinstala
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"
```powershell
# Opción 1: Cambiar puerto temporalmente
$env:PORT=3001; npm start

# Opción 2: Matar el proceso que usa el puerto
netstat -ano | findstr :3000
taskkill /PID <numero-pid> /F
```

---

## 🚀 Comandos Útiles

```powershell
npm start          # Iniciar en desarrollo
npm run build      # Build para producción
npm test           # Ejecutar tests
```

---

## ✅ Verificación

La aplicación funciona correctamente si:
- ✅ Se abre automáticamente en http://localhost:3000
- ✅ Puedes ver el catálogo de productos
- ✅ Puedes registrar un usuario
- ✅ Puedes iniciar sesión

---

**¿Problemas?** Revisa que el backend esté corriendo primero.
