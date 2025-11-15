# Script de Migración SQLite a Supabase (PowerShell)
# Uso: .\scripts\migrate_to_supabase.ps1
# Este script automatiza los pasos locales de migración.

param(
    [string]$DatabaseUrl = "",
    [switch]$NoBackup = $false,
    [switch]$Help = $false
)

# Colores para output
$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"

function Show-Help {
    Write-Host @"
Migración de SQLite a Supabase (PostgreSQL)

Uso:
  .\scripts\migrate_to_supabase.ps1 -DatabaseUrl "postgresql://..." [-NoBackup]

Parámetros:
  -DatabaseUrl <string>  : Connection string de Supabase (PostgreSQL)
  -NoBackup              : Saltar backup de dev.db (NO RECOMENDADO)
  -Help                  : Mostrar esta ayuda

Ejemplo:
  .\scripts\migrate_to_supabase.ps1 -DatabaseUrl "postgresql://postgres:pass@host:5432/postgres"

Notas:
  1. Copia la connection string desde Supabase > Settings > Database > Connection Strings
  2. Se crearán backups automáticos (dev.db.bak, dump.sql)
  3. Se aplicarán migraciones Prisma y se copiarán datos

"@
    exit 0
}

if ($Help) { Show-Help }

function Write-Info { Write-Host $args -ForegroundColor $InfoColor }
function Write-Success { Write-Host $args -ForegroundColor $SuccessColor }
function Write-Error { Write-Host $args -ForegroundColor $ErrorColor }
function Write-Warning { Write-Host $args -ForegroundColor $WarningColor }

# Validaciones iniciales
Write-Info "=== Validación Inicial ==="

if (-not (Test-Path ".\package.json")) {
    Write-Error "Error: package.json no encontrado. Asegúrate de ejecutar desde la raíz del proyecto."
    exit 1
}

if (-not (Test-Path ".\prisma\dev.db")) {
    Write-Error "Error: ./prisma/dev.db no encontrado."
    exit 1
}

if (-not (Test-Path ".\.env")) {
    Write-Warning "Advertencia: .env no existe. Se creará con los valores proporcionados."
}

# Si no se proporcionó DatabaseUrl, preguntar
if (-not $DatabaseUrl) {
    Write-Warning "No se proporcionó -DatabaseUrl en la línea de comandos."
    Write-Info "Copia tu connection string de Supabase (PostgreSQL) desde:"
    Write-Info "  Settings > Database > Connection Strings"
    Write-Info ""
    $DatabaseUrl = Read-Host "Introduce la DATABASE_URL (postgresql://...)"
    
    if (-not $DatabaseUrl) {
        Write-Error "Error: DATABASE_URL no puede estar vacío."
        exit 1
    }
}

# Validar que sea una URL PostgreSQL
if (-not ($DatabaseUrl -match "^postgresql://")) {
    Write-Error "Error: La URL debe comenzar con 'postgresql://'"
    exit 1
}

Write-Success "✓ Validación pasada."

# Paso 1: Backup
Write-Info ""
Write-Info "=== Paso 1: Backup Local ==="

if (-not $NoBackup) {
    try {
        Write-Info "Copiando dev.db a dev.db.bak..."
        Copy-Item .\prisma\dev.db .\prisma\dev.db.bak -Force
        Write-Success "✓ Backup creado: dev.db.bak"

        Write-Info "Exportando dump SQL..."
        & sqlite3 .\prisma\dev.db .dump | Out-File .\backup_sqlite_dump.sql -Encoding UTF8
        Write-Success "✓ Dump SQL creado: backup_sqlite_dump.sql"
    } catch {
        Write-Error "Error en backup: $_"
        exit 1
    }
} else {
    Write-Warning "⚠ Saltando backup (--NoBackup activado)"
}

# Paso 2: Guardar DATABASE_URL en .env
Write-Info ""
Write-Info "=== Paso 2: Configurar .env ==="

if (Test-Path ".\.env") {
    # Reemplazar DATABASE_URL si ya existe
    $envContent = Get-Content .\.env -Raw
    if ($envContent -match "DATABASE_URL=") {
        Write-Warning "DATABASE_URL ya existe en .env, actualizando..."
        $envContent = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=`"$DatabaseUrl`""
    } else {
        $envContent += "`nDATABASE_URL=`"$DatabaseUrl`""
    }
    Set-Content .\.env -Value $envContent
} else {
    Write-Info "Creando .env..."
    @"
DATABASE_URL="$DatabaseUrl"
NODE_ENV="development"
"@ | Set-Content .\.env
}

Write-Success "✓ .env actualizado con DATABASE_URL"

# Paso 3: Instalar dependencias
Write-Info ""
Write-Info "=== Paso 3: Instalar Dependencias ==="

if (Test-Path ".\node_modules\.bin\prisma") {
    Write-Info "npm dependencies ya instaladas."
} else {
    Write-Info "Ejecutando npm install..."
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error en npm install"
        exit 1
    }
}

Write-Success "✓ Dependencias listas"

# Paso 4: Aplicar migraciones
Write-Info ""
Write-Info "=== Paso 4: Aplicar Migraciones Prisma ==="

Write-Info "Aplicando migraciones a Supabase..."
& npx prisma migrate deploy

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Migraciones fallaron, intentando db push..."
    & npx prisma db push
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error aplicando migraciones"
        exit 1
    }
}

Write-Success "✓ Migraciones aplicadas"

# Paso 5: Migrar datos (usando pgloader si Docker disponible)
Write-Info ""
Write-Info "=== Paso 5: Migración de Datos ==="

# Detectar Docker
$dockerAvailable = $false
try {
    $dockerVersion = & docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $dockerAvailable = $true
        Write-Info "Docker detectado: $dockerVersion"
    }
} catch {
    Write-Info "Docker no detectado"
}

if ($dockerAvailable) {
    Write-Info "Usando pgloader en Docker para migrar datos..."
    $devDbPath = Get-Item ".\prisma\dev.db" | Select-Object -ExpandProperty FullName
    
    Write-Info "Comando a ejecutar:"
    Write-Info "docker run --rm -v $(Split-Path $devDbPath):/data dimitri/pgloader:latest pgloader sqlite:////data/dev.db '$DatabaseUrl'"
    Write-Info ""
    Write-Info "Presiona ENTER para continuar o Ctrl+C para cancelar..."
    Read-Host
    
    & docker run --rm -v "$(Split-Path $devDbPath):/data" dimitri/pgloader:latest pgloader "sqlite:////data/dev.db" "$DatabaseUrl"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Datos migrados correctamente con pgloader"
    } else {
        Write-Warning "⚠ pgloader tuvo problemas. Intenta el método CSV manual (ver README_MIGRATE.md)"
    }
} else {
    Write-Warning "⚠ Docker no disponible. Debes migrar datos manualmente:"
    Write-Info ""
    Write-Info "Opción 1: Instala Docker y ejecuta de nuevo este script."
    Write-Info ""
    Write-Info "Opción 2: Migración manual (CSV):"
    Write-Info "  1. Exporta tablas:"
    Write-Info "     sqlite3 .\prisma\dev.db -header -csv 'SELECT * FROM Cliente;' | Out-File Cliente.csv"
    Write-Info "     (repite para Usuario, Servicio, Cita)"
    Write-Info "  2. Importa en Supabase SQL Editor (ver README_MIGRATE.md para detalles)"
    Write-Info ""
}

# Paso 6: Verificación final
Write-Info ""
Write-Info "=== Paso 6: Verificación ==="

Write-Info "Ejecutando Prisma Studio para verificar conexión..."
Write-Info "Presiona Ctrl+C cuando termines (abrirá navegador)..."

try {
    & npx prisma studio
} catch {
    Write-Warning "⚠ Prisma Studio no disponible, pero la migración completó."
}

Write-Info ""
Write-Success "=== ✓ Migración Completada ==="
Write-Info ""
Write-Info "Siguientes pasos:"
Write-Info "  1. Verifica los datos en Supabase (Settings > SQL Editor)"
Write-Info "  2. Prueba la app: npm run server:dev (en una terminal)"
Write-Info "  3. En otra terminal: npm run dev"
Write-Info "  4. Valida que las operaciones CRUD funcionen"
Write-Info ""
Write-Info "Consulta README_MIGRATE.md para más detalles."
