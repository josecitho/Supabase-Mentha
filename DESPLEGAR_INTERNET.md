# 🌍 Despliegue a Internet - Guía Rápida

## Opción Recomendada: Vercel (Frontend) + Render (Backend)

Ambos tienen **tier free** y son fáciles de usar.

---

## PARTE 1: Subir código a GitHub

### 1.1 Crear cuenta en GitHub (si no tienes)
- Ve a https://github.com/signup
- Crea una cuenta gratis

### 1.2 Crear un repositorio
- Ve a https://github.com/new
- Nombre: `mentha-salon`
- Descripción: "App de reserva de citas para salón"
- Privado o público (tu elección)
- **Crea el repositorio**

### 1.3 Subir tu código
Abre PowerShell en la carpeta del proyecto:

```powershell
cd "C:\Users\josev\Escritorio\VIERNES-14-Noviembre\Mentha-supabase"

# Inicializar git
git init
git add .
git commit -m "Versión inicial - app operativa"

# Conectar con GitHub (reemplaza TU_USUARIO y TU_REPO)
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mentha-salon.git
git push -u origin main
```

---

## PARTE 2: Desplegar Backend a Render

### 2.1 Ve a Render
- https://render.com
- Haz clic en "Sign up" (gratis)
- Conéctate con GitHub

### 2.2 Crear nuevo servicio
1. Dashboard → "New +"  → "Web Service"
2. Conecta tu repositorio `mentha-salon`
3. **Configuración:**
   - Name: `mentha-salon-api`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm run server`
   - Plan: **Free** (ojo: se duerme después de 15 min inactividad)

4. **Variables de entorno (Add Environment Variable):**
   ```
   NODE_ENV = production
   PORT = 10000
   DATABASE_URL = file:./prisma/dev.db
   JWT_SECRET = (pon una clave fuerte, ej: tu-clave-super-secreta-12345)
   ```

5. Haz clic en "Create Web Service"

### 2.3 Esperar a que se despliegue
- Verás los logs en vivo
- Cuando termine, tendrás una URL como: `https://mentha-salon-api.onrender.com`
- **Guarda esta URL**, la necesitarás para el frontend

---

## PARTE 3: Desplegar Frontend a Vercel

### 3.1 Ve a Vercel
- https://vercel.com/new
- Conéctate con GitHub

### 3.2 Importar proyecto
1. Selecciona `mentha-salon`
2. **Configuración:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Variables de entorno (Environment Variables):**
   ```
   VITE_SUPABASE_URL = https://utsuwwayeabagkdrfavz.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_API_URL = https://mentha-salon-api.onrender.com
   ```
   (Reemplaza la URL del API con la que obtuviste de Render en paso 2.3)

4. Haz clic en "Deploy"

### 3.3 Esperar a que se despliegue
- Verás los logs
- Cuando termine, tendrás una URL como: `https://mentha-salon.vercel.app`
- **¡Esa es tu app en internet!**

---

## PARTE 4: Actualizar Frontend para usar Backend en la nube

Esto **YA ESTÁ HECHO** ✅

Todos tus archivos de frontend ya usan variables de entorno:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Esto significa que:
- **En desarrollo local:** Usa `http://localhost:3000`
- **En producción (Vercel):** Lee la variable `VITE_API_URL` que configures en Vercel

**Lo único que queda es añadir la variable en el panel de Vercel:**
1. Va a tu Vercel Dashboard
2. Proyecto → Settings → Environment Variables
3. Añade: `VITE_API_URL = https://mentha-salon-api.onrender.com`
4. Haz un re-deploy (o nuevo push a main)

---

## PARTE 5: Verificación Final

1. Ve a tu URL de Vercel (ej: https://mentha-salon.vercel.app)
2. Intenta crear una cita
3. Intenta hacer login con:
   - Email: `admin@mentha.com`
   - Password: `admin123456`
4. ¡Listo! 🎉

---

## Notas Importantes

⚠️ **Render Free Tier:**
- La app se "duerme" después de 15 minutos sin uso
- Primer request después de dormir tardará 30 segundos
- Para mantenerla activa 24/7, necesitarías plan pagado (~$7/mes)

⚠️ **Base de datos:**
- Por ahora usamos SQLite (archivo). En Render, cada reinicio pierde datos.
- Para producción real, deberías usar PostgreSQL en Supabase (gratis también)
- Por ahora funciona para demo/presentación

✅ **Lo bueno:**
- Frontend: Vercel es gratis y rápido
- Backend: Render gratis (con limitaciones)
- Total: **0 costo para demostración**

---

## Si quieres PostgreSQL en Supabase (OPCIONAL)

1. Ve a tu URL de Vercel (ej: https://mentha-salon.vercel.app)
2. Intenta crear una cita
3. Intenta hacer login con:
   - Email: `admin@mentha.com`
   - Password: `admin123456`
4. ¡Listo! 🎉

---

## Notas Importantes

⚠️ **Render Free Tier:**
- La app se "duerme" después de 15 minutos sin uso
- Primer request después de dormir tardará 30 segundos
- Para mantenerla activa 24/7, necesitarías plan pagado (~$7/mes)

⚠️ **Base de datos:**
- Por ahora usamos SQLite (archivo). En Render, cada reinicio pierde datos.
- Para producción real, deberías usar PostgreSQL en Supabase (gratis también)
- Por ahora funciona para demo/presentación

✅ **Lo bueno:**
- Frontend: Vercel es gratis y rápido
- Backend: Render gratis (con limitaciones)
- Total: **0 costo para demostración**

---

## Si quieres PostgreSQL en Supabase (OPCIONAL)

1. Ya tienes cuenta en Supabase (`utsuwwayeabagkdrfavz`)
2. Crear BD PostgreSQL gratis:
   - https://app.supabase.com/project/utsuwwayeabagkdrfavz/settings/database
   - Copiar `DATABASE_URL` PostgreSQL
   - Ponerlo en Render como variable de entorno
   - Ejecutar migraciones: `npx prisma migrate deploy`

Pero por ahora, SQLite funciona perfecto para entrega.

---

## Resumen Pasos Rápidos

```
1. GitHub: Subir código
2. Render: Desplegar backend (backend URL)
3. Vercel: Desplegar frontend (conectar con backend URL)
4. Probar: Ir a URL de Vercel y crear cita
5. ¡Entregado! 🚀
```

Tiempo total: ~10-15 minutos

---

¿Necesitas ayuda con algún paso específico?
