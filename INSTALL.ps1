#!/usr/bin/env pwsh
# =============================================================================
# Script de Instalación Automática - Distribuidora Perros y Gatos (Frontend)
# =============================================================================
# Este script configura automáticamente el proyecto frontend React
# Ejecutar como: .\INSTALL.ps1
# =============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalación Automática - Frontend" -ForegroundColor Cyan
Write-Host "  Distribuidora Perros y Gatos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/4] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js no está instalado"
    }
    
    # Extraer versión numérica
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 16) {
        throw "Node.js versión 16 o superior es requerida (actual: $nodeVersion)"
    }
    
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    Write-Host "Por favor instala Node.js 16 o superior." -ForegroundColor Red
    Write-Host "Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "npm no está disponible"
    }
    Write-Host "✓ npm encontrado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Configurar archivo .env
Write-Host "[2/4] Configurando variables de entorno..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✓ Archivo .env creado desde .env.example" -ForegroundColor Green
    } else {
        # Crear .env por defecto
        $envContent = @"
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Environment
REACT_APP_ENV=development
"@
        Set-Content -Path ".env" -Value $envContent
        Write-Host "✓ Archivo .env creado con configuración por defecto" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Archivo .env ya existe" -ForegroundColor Green
}

Write-Host ""

# Instalar dependencias
Write-Host "[3/4] Instalando dependencias de npm..." -ForegroundColor Yellow
Write-Host "Esto puede tardar unos minutos..." -ForegroundColor Cyan

# Limpiar caché si existe node_modules
if (Test-Path "node_modules") {
    Write-Host "Limpiando instalación anterior..." -ForegroundColor DarkGray
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
}

npm install 2>&1 | ForEach-Object {
    if ($_ -match "^(added|removed|updated|changed|audited)") {
        Write-Host $_ -ForegroundColor DarkGray
    } elseif ($_ -match "warn") {
        Write-Host $_ -ForegroundColor Yellow
    } elseif ($_ -match "error|ERR") {
        Write-Host $_ -ForegroundColor Red
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
    Write-Host "Intenta ejecutar manualmente: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Dependencias instaladas exitosamente" -ForegroundColor Green
Write-Host ""

# Verificar conectividad con backend
Write-Host "[4/4] Verificando conexión con el backend..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Backend está disponible en http://localhost:8000" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Backend no está disponible" -ForegroundColor Yellow
    Write-Host "Asegúrate de ejecutar el backend primero:" -ForegroundColor Yellow
    Write-Host "  cd ..\Distribuidora_Perros_Gatos_back" -ForegroundColor DarkGray
    Write-Host "  .\INSTALL.ps1" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el servidor de desarrollo:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "La aplicación se abrirá en:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Cyan
Write-Host "  • Desarrollo:        npm start" -ForegroundColor White
Write-Host "  • Build producción:  npm run build" -ForegroundColor White
Write-Host "  • Tests:             npm test" -ForegroundColor White
Write-Host ""
Write-Host "¡El frontend está listo para usar! 🚀" -ForegroundColor Green
Write-Host ""
