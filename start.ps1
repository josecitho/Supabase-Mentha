# Script para arrancar Backend + Frontend automáticamente

Write-Host "🚀 Iniciando Mentha Salon..." -ForegroundColor Green
Write-Host ""

# Validar que estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
  Write-Host "❌ Error: No se encuentra package.json. Asegúrate de estar en la carpeta correcta." -ForegroundColor Red
  exit 1
}

# Validar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Error: Node.js no está instalado. Descárgalo desde https://nodejs.org/" -ForegroundColor Red
  exit 1
}

Write-Host "✓ Node.js detectado: $(node --version)" -ForegroundColor Green

# Verificar si dependencies están instaladas
if (-not (Test-Path "node_modules")) {
  Write-Host "📦 Instalando dependencias (primera vez)..." -ForegroundColor Yellow
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en npm install" -ForegroundColor Red
    exit 1
  }
}

Write-Host ""
Write-Host "🔧 Arrancando Backend (puerto 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run server"

Write-Host "⏳ Esperando 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎨 Arrancando Frontend (puerto 5173/5174)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host ""
Write-Host "✅ App iniciada!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:5174" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "👤 Credenciales de admin:" -ForegroundColor Yellow
Write-Host "   Email: admin@mentha.com" -ForegroundColor White
Write-Host "   Contraseña: admin123456" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Las ventanas de backend y frontend se abren automáticamente." -ForegroundColor Gray
Write-Host "⏳ Espera 5 segundos a que cargue completamente y luego abre el navegador." -ForegroundColor Gray
