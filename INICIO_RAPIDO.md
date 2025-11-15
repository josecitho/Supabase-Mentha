# 🚀 Mentha Salon - Guía Rápida de Inicio

## ¿Qué es esto?
App web de reserva de citas para salón de belleza. Backend en Node.js + Express, Frontend en React + Vite, datos en SQLite.

## Requisitos Previos
- **Node.js v18+** (descargar de https://nodejs.org/)
- **npm** (viene con Node.js)

## Instalación (1 minuto)

```powershell
cd "C:\Users\josev\Escritorio\VIERNES-14-Noviembre\Mentha-supabase"
npm install
```

## Arrancar la App (opción recomendada: 1 comando)

### Opción A: Script automático (RECOMENDADO)
```powershell
cd "C:\Users\josev\Escritorio\VIERNES-14-Noviembre\Mentha-supabase"
.\start.ps1
```
Esto arranca backend y frontend automáticamente. Espera 10 segundos y abre la app en tu navegador.

### Opción B: Manual (2 terminales)

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\josev\Escritorio\VIERNES-14-Noviembre\Mentha-supabase"
npm run server
```
Verás: `🚀 API servidor ejecutándose en http://localhost:3000`

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\josev\Escritorio\VIERNES-14-Noviembre\Mentha-supabase"
npm run dev
```
Verás: `➜  Local:   http://localhost:5174/` (o 5173)

## Acceso a la App

1. **Frontend:** http://localhost:5174 (o el puerto que indique la terminal)
2. **API Backend:** http://localhost:3000/api

## Credenciales de Prueba

- **Email:** `admin@mentha.com`
- **Contraseña:** `admin123456`
- **Rol:** Admin (acceso total)

## Funcionalidades Disponibles

✅ **Crear cita** - Formulario de reserva sin login requerido
✅ **Ver servicios** - 5 servicios disponibles (Corte, Coloración, Tratamiento, Manicura, Pedicura)
✅ **Listar citas** - Ver todas las citas creadas
✅ **Admin panel** - Login para ver/editar/eliminar citas (admin only)
✅ **Gestión de usuarios** - Crear/editar/eliminar usuarios del staff

## Estructura de Carpetas

```
Mentha-supabase/
├── server.ts              ← Backend (Node.js/Express)
├── src/                   ← Frontend (React/TypeScript)
├── prisma/
│   ├── dev.db            ← Base de datos SQLite (datos se guardan aquí)
│   └── schema.prisma     ← Esquema de BD
├── package.json          ← Dependencias
└── README_COMPLETO.md    ← Documentación detallada
```

## Datos se Guardan en:
- **Archivo:** `prisma/dev.db` (SQLite local)
- **Automático:** Los datos persisten entre sesiones
- **Respaldo:** `prisma/dev.db.bak` (copia de seguridad)

## Troubleshooting

### "Puerto 5173 en uso"
- Normal. Vite usa 5174 automáticamente. La app abrirá en ese puerto.

### "npm: no encontrado"
- Instala Node.js desde https://nodejs.org/

### "Error en base de datos"
- Borra `prisma/dev.db` y reinicia. Se recreará automáticamente.

### "Error: no está en PowerShell"
- Usa PowerShell (no CMD). Búscalo en Windows.

## API Endpoints (para desarrolladores)

```
POST   /api/citas                - Crear cita
GET    /api/citas                - Listar citas
GET    /api/citas/:id            - Obtener cita
PUT    /api/citas/:id            - Actualizar cita
DELETE /api/citas/:id            - Eliminar cita

GET    /api/servicios            - Listar servicios

POST   /api/login                - Login (retorna JWT token)
GET    /api/usuarios             - Listar usuarios (admin only)
POST   /api/usuarios             - Crear usuario (admin only)
PUT    /api/usuarios/:id         - Editar usuario (admin only)
DELETE /api/usuarios/:id         - Eliminar usuario (admin only)
```

## Soporte
Para problemas o preguntas, revisa `README_COMPLETO.md` o contacta al desarrollador.

---
**¡Listo! La app está operativa y lista para usar.** 🎉
