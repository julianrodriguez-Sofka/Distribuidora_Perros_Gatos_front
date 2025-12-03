# Script de Configuracion Automatica de Variables de Entorno
# Distribuidora Perros y Gatos - Frontend

Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  Configuracion de Variables de Entorno - Frontend" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"
$envExampleFile = ".env.example"

# Verificar si .env ya existe
if (Test-Path $envFile) {
    Write-Host "El archivo .env ya existe." -ForegroundColor Yellow
    $overwrite = Read-Host "¿Deseas sobrescribirlo? (S/N)"
    
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "Configuracion cancelada. Usando .env existente." -ForegroundColor Yellow
        exit 0
    }
    
    # Hacer backup del .env existente
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = ".env.backup.$timestamp"
    Copy-Item $envFile $backupFile
    Write-Host "Backup creado: $backupFile" -ForegroundColor Green
}

# Verificar que existe .env.example
if (-not (Test-Path $envExampleFile)) {
    Write-Host "ERROR: No se encuentra el archivo .env.example" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Configurando variables de entorno..." -ForegroundColor Yellow
Write-Host ""

# Leer valores por defecto de .env.example
$envExampleContent = Get-Content $envExampleFile

# Solicitar URL del API (con valor por defecto)
Write-Host "URL del Backend API:" -ForegroundColor Cyan
Write-Host "  Por defecto: http://localhost:8000/api" -ForegroundColor Gray
Write-Host "  Presiona Enter para usar el valor por defecto" -ForegroundColor Gray
$apiUrl = Read-Host "  Ingresa la URL del API"

if ([string]::IsNullOrWhiteSpace($apiUrl)) {
    $apiUrl = "http://localhost:8000/api"
}

# Validar formato de URL
if ($apiUrl -notmatch '^https?://') {
    Write-Host "  ADVERTENCIA: La URL debe comenzar con http:// o https://" -ForegroundColor Yellow
    $apiUrl = "http://$apiUrl"
    Write-Host "  URL corregida: $apiUrl" -ForegroundColor Yellow
}

# Solicitar entorno
Write-Host ""
Write-Host "Entorno de ejecucion:" -ForegroundColor Cyan
Write-Host "  1) development (por defecto)" -ForegroundColor Gray
Write-Host "  2) production" -ForegroundColor Gray
$envChoice = Read-Host "  Selecciona (1 o 2)"

$environment = "development"
if ($envChoice -eq "2") {
    $environment = "production"
}

# Crear contenido del .env
$envContent = @"
# API Configuration
REACT_APP_API_URL=$apiUrl

# Environment
REACT_APP_ENV=$environment

# Generado automaticamente por setup-env.ps1
# Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

# Escribir archivo .env
Set-Content -Path $envFile -Value $envContent -Encoding UTF8

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "  Configuracion completada exitosamente" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Archivo .env creado con:" -ForegroundColor White
Write-Host "  - API URL: $apiUrl" -ForegroundColor Cyan
Write-Host "  - Environment: $environment" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "  1. Asegurate de que el backend este corriendo en:" -ForegroundColor White
Write-Host "     $($apiUrl -replace '/api$', '')" -ForegroundColor Cyan
Write-Host "  2. Ejecuta 'npm install' si no lo has hecho" -ForegroundColor White
Write-Host "  3. Ejecuta 'npm start' para iniciar el frontend" -ForegroundColor White
Write-Host ""
