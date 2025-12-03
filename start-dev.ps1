# Script para iniciar el servidor de desarrollo del frontend
# Distribuidora Perros y Gatos

Write-Host "🚀 Iniciando servidor de desarrollo React..." -ForegroundColor Cyan

# Configurar variables de entorno
$env:BROWSER = "none"
$env:CI = "false"
$env:FORCE_COLOR = "true"

# Cambiar al directorio del proyecto
Set-Location $PSScriptRoot

# Matar procesos previos de node en el puerto 3000
Write-Host "Verificando puerto 3000..." -ForegroundColor Yellow
$processOnPort = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($processOnPort) {
    $processId = $processOnPort.OwningProcess
    Write-Host "Deteniendo proceso anterior (PID: $processId)..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Iniciar el servidor
Write-Host "Iniciando React en http://localhost:3000" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:8000/api" -ForegroundColor Cyan
Write-Host ""

# Usar Start-Process para mantener el proceso corriendo
Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -Wait
