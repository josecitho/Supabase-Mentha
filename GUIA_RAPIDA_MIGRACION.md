# Guía Rápida: Migración SQLite → Supabase

## 5 Pasos Principales

### 1️⃣ Crear Proyecto Supabase
- Ve a https://app.supabase.com
- Crea nuevo proyecto (elige región, contraseña)
- Copia la **connection string** (Settings > Database > Connection Strings > PostgreSQL)

### 2️⃣ Hacer Backup (IMPORTANTE)
```powershell
Copy-Item .\prisma\dev.db .\prisma\dev.db.bak -Force
```

### 3️⃣ Guardar DATABASE_URL en .env
Crea/edita `.env` en la raíz:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
NODE_ENV="development"
```
Reemplaza `YOUR_PASSWORD` y `YOUR_HOST` con tus datos de Supabase.

### 4️⃣ Aplicar Migraciones
```powershell
npm install
npx prisma migrate deploy
```

### 5️⃣ Migrar Datos

#### Opción A: Con Docker (recomendado, rápido)
```powershell
docker run --rm `
  -v C:/Users/josev/Escritorio/VIERNES-14-Noviembre/Mentha-supabase/prisma:/data `
  dimitri/pgloader:latest `
  pgloader `
    sqlite:////data/dev.db `
    "postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
```

#### Opción B: Usar script automatizado (si prefieres que haga todo)
```powershell
.\scripts\migrate_to_supabase.ps1 -DatabaseUrl "postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
```

#### Opción C: Manual CSV (sin Docker)
```powershell
# Exportar tablas
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Usuario;" | Out-File Usuario.csv
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Cliente;" | Out-File Cliente.csv
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Servicio;" | Out-File Servicio.csv
sqlite3 .\prisma\dev.db -header -csv "SELECT * FROM Cita;" | Out-File Cita.csv
```
Luego importa en Supabase SQL Editor (ver README_MIGRATE.md para detalles).

### 6️⃣ Probar la App
```powershell
# Terminal 1
npm run server:dev

# Terminal 2 (nueva)
npm run dev
```

---

## Archivos Creados

- **.env.example** — Referencia de variables (no ejecutable, solo ejemplo)
- **README_MIGRATE.md** — Guía completa con troubleshooting
- **scripts/migrate_to_supabase.ps1** — Script automatizado

---

## ⚠️ Puntos Críticos

1. **Backup primero** — `dev.db.bak` es tu salvaguarda
2. **No compartir .env** — Contiene contraseñas
3. **Probar en staging** — No hagas cambios en producción hasta validar
4. **Orden de tablas** — Importar: Usuario → Cliente → Servicio → Cita (hay relaciones)

---

## 🆘 Si Algo Falla

1. **"connect ECONNREFUSED"** — Verifica la connection string (contraseña, host)
2. **"relation not exist"** — Las migraciones no se aplicaron → `npx prisma migrate deploy`
3. **"violates unique constraint"** — Hay datos duplicados → Limpia tablas y reinicia

Ver **README_MIGRATE.md** sección "Solución de Problemas" para más casos.

---

## Seguridad & Buenas Prácticas

- ✅ `.env` está en `.gitignore` (no se sube a GitHub)
- ✅ Usa `.env.example` para compartir estructura sin secrets
- ✅ En producción, usa Supabase Auth en lugar de tabla `Usuario` manual (opcional)
- ✅ Activa RLS (Row-Level Security) después de validar (opcional pero recomendado)

---

## Siguiente: ¿Qué Hacer Después?

1. **Ahora:** Crea proyecto Supabase y obtén connection string
2. **Paso 1-3:** Configura `.env` y haz backup
3. **Paso 4-5:** Aplica migraciones y migra datos
4. **Paso 6:** Prueba la app localmente
5. **Después:** Deploy a producción (el proceso es igual, solo cambia `.env`)

---

**Documentación Completa:** Lee `README_MIGRATE.md` para instrucciones detalladas.
