# 🎉 Sistema de Administración Mentha - NUEVO

## ✅ Lo que se implementó

### 1. **Autenticación Real con JWT**
- Sistema de login seguro con email y contraseña
- Tokens JWT que expiran en 24 horas
- Contraseñas hasheadas con bcryptjs

### 2. **Dos Niveles de Acceso**

#### 👨‍💼 **ADMINISTRADOR**
- URL: `http://localhost:5173/admin`
- **Panel de Control Completo:**
  - ✅ Crear, editar, eliminar **USUARIOS** (Staff)
  - ✅ Ver, editar, cambiar estado de **CITAS**
  - ✅ Eliminar citas
  - ✅ Ver todos los servicios
  - 🔐 Control total del sistema

#### 👤 **STAFF**
- URL: `http://localhost:5173/staff`
- **Vista de Solo Lectura:**
  - 👁️ Ver todas las citas (filtrable)
  - 👁️ Ver detalles de citas y clientes
  - 📊 Ver estadísticas de citas por estado
  - 🔒 **NO puede modificar nada**

### 3. **Booking Público (Sin Cambios)**
- Los clientes pueden reservar en `/booking` sin login
- Funcionamiento exactamente igual que antes
- No interfiere con el sistema de admin

---

## 🚀 Cómo Usar

### **Paso 1: Iniciar el Servidor Backend**
```bash
npm run server
```
Deberías ver:
```
🚀 API servidor ejecutándose en http://localhost:3000
✓ Servicios inicializados correctamente
✓ Usuario admin creado: admin@mentha.com / admin123456
```

### **Paso 2: Iniciar la Aplicación React** (en otra terminal)
```bash
npm run dev
```

### **Paso 3: Acceder al Login**
- Abre: `http://localhost:5173/login`

### **Paso 4: Credenciales de Prueba**

#### Admin (Acceso Completo):
```
Email: admin@mentha.com
Contraseña: admin123456
```

#### Crear Más Staff:
1. Login con admin
2. Ve a Panel → Staff y Usuarios
3. Haz clic en "+ Agregar Usuario"
4. Completa el formulario (rol: Staff)
5. ¡Nuevo staff creado! Ellos pueden usar esas credenciales

---

## 📋 Rutas Disponibles

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Página de inicio |
| `/booking` | Público | Formulario de reservas (sin login) |
| `/services` | Público | Lista de servicios |
| `/gallery` | Público | Galería |
| `/about` | Público | Acerca de |
| `/contact` | Público | Contacto |
| `/login` | Público | Login |
| `/admin` | Admin Only | Panel de administración completo |
| `/staff` | Staff + Admin | Dashboard de staff (solo lectura) |

---

## 🎯 Funcionalidades del Admin

### **Tab 1: Staff y Usuarios**
- ✅ Ver todos los usuarios
- ✅ Crear nuevo usuario (admin o staff)
- ✅ Editar usuario (nombre, rol, estado)
- ✅ Eliminar usuario
- 🔍 Buscar por nombre o email

### **Tab 2: Citas y Reservas**
- ✅ Ver todas las citas
- ✅ Cambiar estado (pendiente → confirmada → completada/cancelada)
- ✅ Ver detalles del cliente
- ✅ Eliminar citas
- 🔍 Buscar citas por cliente

### **Tab 3: Servicios**
- 👁️ Ver todos los servicios disponibles
- 📊 Mostrar precio y duración
- 💡 Vista de referencia (no editable desde aquí)

---

## 🎯 Funcionalidades del Staff

### **Dashboard Staff**
- 📊 Estadísticas de citas (total, pendientes, confirmadas, etc.)
- 🔍 Buscar citas por cliente
- 🏷️ Filtrar por estado
- 👁️ Ver detalles completos de cada cita
- 🔒 **Sin capacidad de modificación**

---

## 🛠️ Estructura Técnica

### **Base de Datos**
```
SQLite → prisma/dev.db
- usuarios (id, email, password, nombre, rol, activo)
- clientes (id, nombre, apellido, email, telefono)
- citas (id, cliente_id, servicio_id, fecha_hora, estado, notas)
- servicios (id, nombre, descripcion, duracion_minutos, precio, activo)
```

### **API Endpoints**
```
POST   /api/login                 - Login
GET    /api/usuarios              - Listar usuarios (admin)
POST   /api/usuarios              - Crear usuario (admin)
PUT    /api/usuarios/:id          - Editar usuario (admin)
DELETE /api/usuarios/:id          - Eliminar usuario (admin)

GET    /api/citas                 - Listar citas
PUT    /api/citas/:id             - Actualizar cita
DELETE /api/citas/:id             - Eliminar cita

GET    /api/servicios             - Listar servicios
```

---

## 🔐 Seguridad

✅ **Implementado:**
- Autenticación con JWT (tokens de 24 horas)
- Contraseñas hasheadas con bcryptjs
- Middleware de autenticación en backend
- Middleware de autorización (admin vs staff)
- Protección de rutas en frontend
- Headers Authorization en todas las requests

---

## 📱 Responsive Design

✅ Todo es **100% responsivo** (móvil, tablet, desktop)
- Tablas adaptables
- Modales responsive
- Formularios mobile-friendly

---

## 💡 Próximas Mejoras Opcionales

- [ ] Editar servicios desde admin
- [ ] Agregar roles más granulares
- [ ] Exportar citas a PDF/Excel
- [ ] Notificaciones por email
- [ ] Dashboard con gráficos
- [ ] Sistema de disponibilidad de horarios
- [ ] Cambio de contraseña

---

## ⚠️ Notas Importantes

1. **La BD es local** (SQLite en `prisma/dev.db`)
   - Se resetea si borras el archivo
   - Los cambios se guardan automáticamente

2. **Admin por defecto**
   - Email: `admin@mentha.com`
   - Contraseña: `admin123456`
   - Creado automáticamente en primera ejecución

3. **JWT Secret**
   - En `.env` (cambiar en producción)
   - Tokens duran 24 horas

4. **El booking público sigue funcionando**
   - Sin cambios
   - Los clientes pueden seguir reservando sin login

---

## 🎬 Demo Rápida

```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev

# Navegador
1. http://localhost:5173/login
2. Admin@mentha.com / admin123456
3. Verás el panel admin con 3 tabs
4. ¡A gestionar!
```

---

**¡Listo para usar! 🚀**
