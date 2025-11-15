# Migración de SQLite a Supabase (PostgreSQL)

Esta guía te lleva paso a paso desde SQLite local a una base de datos PostgreSQL gestionada en Supabase.

## Tabla de Contenidos
1. [Preparación (Supabase)](#preparación-supabase)
2. [Backup Local](#backup-local)
3. [Configuración .env](#configuración-env)
4. [Aplicar Migraciones](#aplicar-migraciones)
5. [Migración de Datos](#migración-de-datos)
6. [Pruebas y Validación](#pruebas-y-validación)
7. [Solución de Problemas](#solución-de-problemas)

---

## Preparación (Supabase)

### Paso 1: Crear Proyecto en Supabase
1. Abre https://app.supabase.com
2. Haz clic en "New Project"
3. Elige:
   - Organization: cualquiera (o crea una nueva)
   - Project Name: ej. `mentha-prod` o `mentha-salon`
   - Database Password: elige una contraseña fuerte (guárdala)
   - Region: elige la más cercana (ej. `us-east-1` para USA, `eu-west-1` para Europa)
4. Espera a que el proyecto se cree (2-3 minutos)
5. Copia la **connection string**:
   - Ve a Settings > Database > Connection Strings
   - Selecciona "PostgreSQL" (no "psql")
   - Copia la URL completa (algo como `postgresql://postgres:PASSWORD@HOST:5432/postgres`)

### Paso 2: Guardar la Connection String
Copia tu connection string completa. La necesitarás en el siguiente paso.

---

## Backup Local

**⚠️ IMPORTANTE:** Antes de cualquier cambio, haz backup de tu SQLite local.

### En PowerShell (Windows):

```powershell
# Sitúate en la carpeta del proyecto
cd C:\Users\josev\Escritorio\VIERNES-14-Noviembre\Mentha-supabase

# Opción A: Copiar el archivo dev.db
Copy-Item .\prisma\dev.db .\prisma\dev.db.bak -Force
Write-Host "Backup creado: dev.db.bak"

# Opción B: Exportar dump SQL (opcional, para resguardo adicional)
# Necesita sqlite3 instalado en PATH
sqlite3 .\prisma\dev.db .dump | Out-File .\backup_sqlite_dump.sql -Encoding UTF8
Write-Host "Dump SQL creado: backup_sqlite_dump.sql"
```

Verifica que los archivos existan:
```powershell
Get-ChildItem .\prisma\dev.db*
```

---

## Configuración .env

### Paso 1: Editar .env con la Connection String de Supabase

Abre o crea el archivo `.env` en la raíz del proyecto:

```
# .env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
NODE_ENV="development"
```

**Reemplaza:**
- `YOUR_PASSWORD`: la contraseña de DB que estableciste en Supabase
- `YOUR_HOST`: el host de tu proyecto (ej. `abc123.supabase.co`)

**Ejemplo real:**
```
DATABASE_URL="postgresql://postgres:MiPassword123@mentha-proj-abc.supabase.co:5432/postgres"
NODE_ENV="development"
```

### Paso 2: NO hagas commit de .env
`.env` ya debe estar en `.gitignore` para no subir secrets:
```bash
git status  # Comprueba que .env NO aparece
```

Si .env aparece, añádelo a .gitignore y quítalo del git:
```bash
echo ".env" >> .gitignore
git rm --cached .env
git add .gitignore
git commit -m "Remove .env from tracking"
```

---

## Aplicar Migraciones

### Paso 1: Instalar Dependencias
En PowerShell:
```powershell
npm install
```

### Paso 2: Aplicar Migraciones Prisma a Supabase

Tienes dos opciones:

#### Opción A: Usar historial de migraciones (recomendado)
Esto aplica las migraciones existentes en `prisma/migrations`:
```powershell
npx prisma migrate deploy
```

Si la salida dice "No pending migrations", todo está aplicado. ✓

#### Opción B: Forzar el esquema actual (si las migraciones fallan)
```powershell
npx prisma db push
```

**Nota:** `db push` sobrescribe migraciones; úsalo solo si necesitas empezar limpio.

### Paso 3: Verificar Esquema en Supabase
Ve al SQL Editor de Supabase y ejecuta:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Deberías ver las tablas: `Usuario`, `Cliente`, `Servicio`, `Cita`.

---

## Migración de Datos

### Opción 1: Usar Docker + pgloader (Recomendado)

**Requisitos:** Docker instalado en tu máquina.

En PowerShell:
```powershell
# Reemplaza:
# - C:/ruta/absoluta/dev.db con la ruta de tu dev.db
# - YOUR_PASSWORD, YOUR_HOST, etc. con tus credenciales de Supabase

docker run --rm `
  -v C:/Users/josev/Escritorio/VIERNES-14-Noviembre/Mentha-supabase/prisma:/data `
  dimitri/pgloader:latest `
  pgloader `
    sqlite:////data/dev.db `
    "postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
```

**Ejemplo completo:**
```powershell
docker run --rm `
  -v C:/Users/josev/Escritorio/VIERNES-14-Noviembre/Mentha-supabase/prisma:/data `
  dimitri/pgloader:latest `
  pgloader `
    sqlite:////data/dev.db `
    "postgresql://postgres:MiPassword123@mentha-proj.supabase.co:5432/postgres"
```

Si todo va bien, verás un reporte al final indicando filas copiadas. ✓

### Opción 2: Exportar CSV e Importar Manualmente (sin Docker)

#### Paso A: Exportar tablas desde SQLite

En PowerShell:
```powershell
# Exportar Cliente
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Cliente;" | Out-File .\Cliente.csv -Encoding UTF8

# Exportar Servicio
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Servicio;" | Out-File .\Servicio.csv -Encoding UTF8

# Exportar Usuario
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Usuario;" | Out-File .\Usuario.csv -Encoding UTF8

# Exportar Cita
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Cita;" | Out-File .\Cita.csv -Encoding UTF8

Write-Host "CSV exportados exitosamente"
```

#### Paso B: Importar en Supabase

1. Ve al **SQL Editor** en Supabase (dashboard).
2. Para cada tabla, ejecuta:

```sql
-- Importar Usuario (ejecutar ANTES que Cliente/Cita porque hay relaciones)
COPY "Usuario" (id, email, password, nombre, rol, activo, "createdAt", "updatedAt")
FROM STDIN WITH (FORMAT csv, HEADER true);
```

Luego pega el contenido de `Usuario.csv` y presiona Ctrl+Enter.

3. Repite para `Cliente`, `Servicio`, `Cita` (en ese orden, respetando relaciones).

#### Paso C: Ajustar Secuencias de IDs

Después de importar, sincroniza los autoincrements:

```sql
-- Ejecuta en SQL Editor de Supabase
SELECT setval(pg_get_serial_sequence('"Usuario"','id'), COALESCE(MAX(id),1)) FROM "Usuario";
SELECT setval(pg_get_serial_sequence('"Cliente"','id'), COALESCE(MAX(id),1)) FROM "Cliente";
SELECT setval(pg_get_serial_sequence('"Servicio"','id'), COALESCE(MAX(id),1)) FROM "Servicio";
SELECT setval(pg_get_serial_sequence('"Cita"','id'), COALESCE(MAX(id),1)) FROM "Cita";
```

---

## Pruebas y Validación

### Paso 1: Verificar Datos en Supabase

En el **SQL Editor** o **Table Editor** de Supabase, comprueba:
```sql
SELECT COUNT(*) as total_usuarios FROM "Usuario";
SELECT COUNT(*) as total_clientes FROM "Cliente";
SELECT COUNT(*) as total_servicios FROM "Servicio";
SELECT COUNT(*) as total_citas FROM "Cita";
```

Deberías ver el mismo número de registros que en SQLite.

### Paso 2: Probar la Aplicación Localmente

En PowerShell (asegúrate de que `.env` apunta a Supabase):

```powershell
# Terminal 1: Arrancar el servidor backend
npm run server:dev

# Terminal 2 (nueva): Arrancar Vite frontend
npm run dev
```

Prueba:
- Crear un nuevo usuario/cliente/cita
- Listar citas
- Actualizar datos
- Eliminar registro

Si todo funciona sin errores, ¡la migración fue exitosa! ✓

### Paso 3: Revisar Logs

Si hay errores, revisa:
- Consola del servidor (`npm run server:dev`): errores de Prisma
- Console del navegador (F12): errores de frontend
- Logs de Supabase: en dashboard, Section > Logs

---

## Solución de Problemas

### Error: "connect ECONNREFUSED"
**Causa:** La `DATABASE_URL` en `.env` es inválida o el host no es accesible.

**Solución:**
1. Verifica que copiaste correctamente la connection string de Supabase.
2. Comprueba que no hay typos (contraseña, host).
3. Si usas VPN, desactívala temporalmente para probar.

```powershell
# Prueba conexión (necesita psql instalado)
psql "postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres" -c "SELECT 1;"
```

### Error: "relation \"Usuario\" does not exist"
**Causa:** Las migraciones no se aplicaron.

**Solución:**
```powershell
# Verifica que las migraciones están aplicadas
npx prisma migrate status

# Si dice "pending migrations", aplícalas
npx prisma migrate deploy
```

### Error: "violates unique constraint"
**Causa:** Al importar datos, hubo un duplicado (p.ej. email repetido).

**Solución:**
1. Limpia la tabla en Supabase (SQL Editor):
```sql
TRUNCATE TABLE "Cita" CASCADE;
TRUNCATE TABLE "Cliente" CASCADE;
TRUNCATE TABLE "Usuario" CASCADE;
TRUNCATE TABLE "Servicio" CASCADE;
```
2. Limpia los datos duplicados en SQLite.
3. Reinicia el proceso de migración.

### Error: "ForeignKeyConstraintFailed"
**Causa:** Estás importando tablas en orden incorrecto (las que dependen de otras).

**Solución:**
Importa en este orden:
1. `Usuario`
2. `Cliente`
3. `Servicio`
4. `Cita` (depende de Cliente y Servicio)

---

## Resumen de Comandos (Quick Reference)

```powershell
# 1. Backup
Copy-Item .\prisma\dev.db .\prisma\dev.db.bak -Force

# 2. Instalar dependencias
npm install

# 3. Aplicar migraciones
npx prisma migrate deploy

# 4. Migrar datos (Docker)
docker run --rm -v C:/ruta/prisma:/data dimitri/pgloader:latest pgloader sqlite:////data/dev.db "postgresql://..."

# 5. O migrar datos (CSV manual)
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Cliente;" | Out-File .\Cliente.csv

# 6. Probar la app
npm run server:dev
npm run dev  # (en otra terminal)
```

---

## Notas Finales

- **Seguridad:** No compartas `.env` ni la `DATABASE_URL` públicamente.
- **Testing:** Prueba primero en una DB de staging, no en producción.
- **Rollback:** Si algo falla, tienes backups (`dev.db.bak`, `backup_sqlite_dump.sql`).
- **Supabase Auth (opcional):** Si integras Supabase Auth después, podrás sincronizar la tabla `Usuario` o reemplazarla.

¡Éxito en la migración! 🚀
