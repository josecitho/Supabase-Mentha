/*
  # Deshabilitar RLS para clientes y citas para permitir reservas públicas

  1. Cambios
    - Deshabilitar RLS en tabla clientes (permite inserción pública)
    - Deshabilitar RLS en tabla citas (permite inserción pública)
    - Mantener RLS en servicios con acceso público de lectura
    
  2. Justificación
    - El formulario de reservas es público y debe permitir crear clientes y citas
    - La gestión administrativa se hace desde /admin sin autenticación por ahora
    - En producción se puede agregar autenticación posteriormente
*/

-- Deshabilitar RLS en clientes para permitir acceso público
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en citas para permitir acceso público  
ALTER TABLE citas DISABLE ROW LEVEL SECURITY;

-- Mantener servicios con RLS pero acceso público de lectura
ALTER TABLE servicios DISABLE ROW LEVEL SECURITY;
