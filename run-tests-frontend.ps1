# Script para ejecutar pruebas del FRONTEND

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ejecutando Pruebas del FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables de control
$ErrorActionPreference = "Continue"
$testsPassed = $false

# Verificar si existe node_modules
if (Test-Path "node_modules") {
    Write-Host "  Instalando/verificando dependencias de pruebas..." -ForegroundColor Green
    npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event redux-mock-store --silent
    
    Write-Host ""
    Write-Host "  Ejecutando Jest..." -ForegroundColor Cyan
    Write-Host ""
    
    # Ejecutar tests con cobertura (sin watch mode)
    # Usar --passWithNoTests para no fallar si no hay tests aún
    npm test -- --coverage --watchAll=false --passWithNoTests --verbose
    
    if ($LASTEXITCODE -eq 0) {
        $testsPassed = $true
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  PRUEBAS COMPLETADAS" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        
        if (Test-Path "coverage\lcov-report\index.html") {
            Write-Host "  Reporte de cobertura: coverage\lcov-report\index.html" -ForegroundColor Cyan
        }
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ALGUNAS PRUEBAS FALLARON" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
    }
} else {
    Write-Host "  ERROR: No se encontro node_modules." -ForegroundColor Red
    Write-Host "  Ejecute: npm install" -ForegroundColor Yellow
}

Write-Host ""

if ($testsPassed) {
    exit 0
} else {
    exit 1
}
