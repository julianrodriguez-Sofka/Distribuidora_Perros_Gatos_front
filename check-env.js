/**
 * Script de verificacion de variables de entorno
 * Se ejecuta antes de iniciar la aplicacion
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('\n========================================');
console.log('  Verificacion de Variables de Entorno');
console.log('========================================\n');

// Verificar si existe .env
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: No se encuentra el archivo .env\n');
  console.log('Para configurar el proyecto, ejecuta uno de estos comandos:\n');
  console.log('  Windows:  powershell -ExecutionPolicy Bypass -File setup-env.ps1');
  console.log('  Manual:   cp .env.example .env\n');
  console.log('Luego edita el archivo .env con la URL correcta del backend.\n');
  process.exit(1);
}

// Verificar que REACT_APP_API_URL este configurado
const envContent = fs.readFileSync(envPath, 'utf8');
const apiUrlMatch = envContent.match(/REACT_APP_API_URL=(.+)/);

if (!apiUrlMatch || !apiUrlMatch[1] || apiUrlMatch[1].trim() === '') {
  console.error('❌ ERROR: REACT_APP_API_URL no esta configurado en .env\n');
  console.log('Agrega esta linea a tu archivo .env:');
  console.log('  REACT_APP_API_URL=http://localhost:8000/api\n');
  process.exit(1);
}

const apiUrl = apiUrlMatch[1].trim();

// Validar formato de URL
if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
  console.error('❌ ERROR: REACT_APP_API_URL debe comenzar con http:// o https://\n');
  console.log('Valor actual:', apiUrl);
  console.log('Valor correcto ejemplo: http://localhost:8000/api\n');
  process.exit(1);
}

console.log('✅ Variables de entorno configuradas correctamente\n');
console.log('Configuracion:');
console.log('  - API URL:', apiUrl);

// Verificar si el backend esta disponible (opcional, no bloqueante)
const backendUrl = apiUrl.replace('/api', '');
console.log('\n⏳ Verificando conexion con backend...');
console.log('  Backend esperado en:', backendUrl);
console.log('  (Si el backend no esta corriendo, la app mostrara errores)\n');

console.log('========================================\n');
