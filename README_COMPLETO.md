# 📅 Sistema de Reservas - Mentha Salón

Sistema completo de gestión de citas para salón de belleza con **Prisma + SQLite** (desarrollo local) y capacidad de despliegue a producción.

## 🎯 Características

- ✅ **Reservas Públicas**: Cualquiera puede reservar sin login
- ✅ **Base de Datos SQLite**: Almacenamiento local simple
- ✅ **API REST**: Con Prisma ORM
- ✅ **React + TypeScript**: Frontend moderno
- ✅ **Multiidioma**: Español e Inglés
- ✅ **Responsive Design**: Funciona en móvil y desktop

## 🏗️ Arquitectura

```
proyecto/
├── Frontend (React + Vite)
│   ├── http://localhost:5173
│   └── Páginas: Home, Servicios, Booking, Galería, Acerca de, Contacto
│
├── Backend (Express + Prisma)
│   ├── http://localhost:3000
│   └── API REST con endpoints de citas
│
└── Base de Datos (SQLite)
    └── prisma/dev.db (archivo local)
```

## 🚀 Inicio Rápido (Desarrollo)

### 1. Requisitos
- **Node.js** 18+ instalado
- **npm** o **yarn**

### 2. Instalación

```bash
# Clonar o descargar el proyecto
cd "ruta/del/proyecto"

# Instalar dependencias
npm install
```

### 3. Configuración
El archivo `.env` ya está configurado:
```
DATABASE_URL="file:./dev.db"
```

### 4. Ejecutar en Desarrollo

Abre **DOS terminales** en el mismo directorio:

**Terminal 1 - Servidor API:**
```bash
npm run server
```
Salida esperada:
```
🚀 API servidor ejecutándose en http://localhost:3000
✓ Servicios inicializados correctamente
```

**Terminal 2 - Aplicación React:**
```bash
npm run dev
```
Salida esperada:
```
Local:   http://localhost:5173/
```

### 5. Probar la Aplicación

1. Abre `http://localhost:5173` en tu navegador
2. Ve a la página **"Booking"** o `/booking`
3. Completa el formulario:
   - Nombre completo
   - Teléfono
   - Correo electrónico
   - Selecciona un servicio
   - Elige fecha y hora
   - Notas opcionales
4. ¡Haz clic en "Reservar"!
5. Verás un mensaje de éxito

## 📊 Ver la Base de Datos

Para visualizar y editar datos en interfaz gráfica:

```bash
npx prisma studio
```

Se abrirá en `http://localhost:5555`

Aquí puedes:
- Ver todas las citas guardadas
- Ver clientes registrados
- Ver servicios disponibles
- Editar datos manualmente
- Agregar nuevos registros

## 📝 Cambiar el Esquema de la BD

Si necesitas agregar campos o tablas:

1. Edita `prisma/schema.prisma`
2. Ejecuta:
```bash
npx prisma migrate dev --name descripcion_del_cambio
```
Esto creará una migración automática.

## 🗄️ Estructura de Datos

### Tabla: Cliente
```
id (autoincrement)
nombre (texto)
apellido (texto)
email (único)
telefono (texto)
createdAt, updatedAt (fechas)
```

### Tabla: Servicio
```
id (autoincrement)
nombre (texto)
descripcion (texto, opcional)
duracion_minutos (número)
precio (decimal)
activo (booleano)
createdAt, updatedAt (fechas)
```

### Tabla: Cita
```
id (autoincrement)
cliente_id (FK → Cliente)
servicio_id (FK → Servicio)
fecha_hora (fecha)
estado (pendiente, confirmada, completada, cancelada)
notas (texto, opcional)
createdAt, updatedAt (fechas)
```

## 📡 Endpoints API

Todos los endpoints están en: `http://localhost:3000`

### Citas
- **POST** `/api/citas` - Crear nueva cita
- **GET** `/api/citas` - Obtener todas las citas
- **GET** `/api/citas/:id` - Obtener cita específica
- **PUT** `/api/citas/:id` - Actualizar cita (estado, notas)
- **DELETE** `/api/citas/:id` - Eliminar cita

### Servicios
- **GET** `/api/servicios` - Obtener servicios activos

### Health Check
- **GET** `/api/health` - Verificar estado del servidor

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar app React
npm run server       # Iniciar servidor API
npm run server:dev   # Servidor con auto-reload (requiere nodemon)

# Producción
npm run build        # Compilar para producción
npm run preview      # Previsualizar build

# Herramientas
npx prisma studio   # Abrir interfaz gráfica de BD
npx prisma migrate status  # Ver estado de migraciones
```

## 🌐 Despliegue a Producción

### Opción 1: Vercel + Railway (Recomendado)

#### Frontend en Vercel
```bash
# 1. Crea cuenta en vercel.com
# 2. Conecta tu repositorio GitHub
# 3. Vercel detectará automáticamente que es un proyecto Vite
# 4. Configura la variable de entorno:
#    VITE_API_URL = https://tu-api.railway.app
# 5. Deploy automático en cada push
```

#### Backend en Railway
```bash
# 1. Crea cuenta en railway.app
# 2. Crea nuevo proyecto
# 3. Conecta tu repositorio GitHub
# 4. Configura variables de entorno:
#    - DATABASE_URL: Tu BD PostgreSQL
#    - PORT: 3000 (automático)
# 5. Deploy automático
```

**Cambios necesarios en código:**
- En `server.ts`: Cambiar a PostgreSQL para producción
- En `prisma/schema.prisma`: 
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```

### Opción 2: Render + Render

#### 1. Preparar Base de Datos

```bash
# Crear DB PostgreSQL en render.com
# Copiar CONNECTION STRING
# Actualizar .env.production:
DATABASE_URL="postgresql://user:password@host/dbname"
```

#### 2. Backend (Render)
```bash
# 1. Nueva Web Service en render.com
# 2. Conectar repositorio
# 3. Build command: npm install
# 4. Start command: npm run server
# 5. Agregar env var: DATABASE_URL
# 6. Deploy
```

#### 3. Frontend (Render o Netlify)
```bash
# Opción A: Render
# Build command: npm run build
# Publish directory: dist
# Env: VITE_API_URL

# Opción B: Netlify
# npm run build → dist/
# Env: VITE_API_URL
```

### Opción 3: Docker (Para Cualquier Servidor)

Crea `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código
COPY . .

# Build frontend
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Iniciar servidor
CMD ["npm", "run", "server"]
```

Crea `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./prod.db
      - NODE_ENV=production
```

Ejecutar:
```bash
docker-compose up
```

## 🔐 Seguridad en Producción

Antes de desplegar:

1. **Variables de Entorno**
   ```
   DATABASE_URL - Base de datos (NO en código)
   NODE_ENV=production
   PORT=3000
   ```

2. **CORS Seguro** (actualizar `server.ts`):
   ```typescript
   app.use(cors({
     origin: 'https://tu-dominio.com',
     credentials: true
   }));
   ```

3. **Validación de Entrada**
   - Ya implementada en `server.ts`

4. **Rate Limiting** (opcional)
   ```bash
   npm install express-rate-limit
   ```

5. **HTTPS Obligatorio**
   - Habilitado automáticamente en Vercel, Railway, Render

## 📋 Checklist de Despliegue

- [ ] BD configurada (PostgreSQL en producción)
- [ ] Variables de entorno configuradas
- [ ] CORS actualizado con dominio correcto
- [ ] Build probado: `npm run build`
- [ ] API probada localmente con BD de producción
- [ ] Frontend conecta a API correcta
- [ ] HTTPS habilitado
- [ ] Monitoreo configurado (opcional)
- [ ] Backups de BD configurados
- [ ] Email de contacto funcionando (si aplica)

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Error: "PORT 3000 already in use"
```bash
# Cambiar puerto en server.ts
const PORT = process.env.PORT || 3001;
```

### Error: "Foreign key constraint violated"
```bash
# La BD está vacía. Reinicia el servidor:
npm run server
# Los servicios se inicializarán automáticamente
```

### API no responde
1. Verifica que `npm run server` está ejecutándose
2. Verifica que el puerto 3000 no está bloqueado
3. Abre `http://localhost:3000/api/health` en navegador

## 📞 Contacto y Soporte

Para cambios o problemas:
- Revisa la documentación en `PRISMA_SETUP.md`
- Consulta los logs del servidor
- Verifica la conexión a la BD

## 📄 Licencia

Proyecto privado - Mentha Salón 2025

---

**¡Tu salón de belleza está listo para recibir reservas! 🎉**
