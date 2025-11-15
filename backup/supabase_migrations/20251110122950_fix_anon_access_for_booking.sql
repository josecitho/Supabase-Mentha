/*
  # Permitir Acceso Anónimo para Reservas

  1. Cambios
    - Eliminar política restrictiva de clientes
    - Crear nueva política que permita a usuarios anónimos insertar clientes
    - Asegurar que anon puede leer servicios
    - Verificar que anon puede insertar citas
    
  2. Seguridad
    - Usuarios anónimos solo pueden INSERT en clientes y citas
    - Usuarios anónimos solo pueden SELECT en servicios
    - Solo usuarios autenticados pueden UPDATE, DELETE y ver todos los datos
*/

-- Eliminar todas las políticas existentes de clientes
DROP POLICY IF EXISTS "Cualquiera puede crear clientes" ON clientes;
DROP POLICY IF EXISTS "Autenticados pueden ver clientes" ON clientes;
DROP POLICY IF EXISTS "Autenticados pueden actualizar clientes" ON clientes;
DROP POLICY IF EXISTS "Autenticados pueden eliminar clientes" ON clientes;

-- Crear política para que usuarios anónimos puedan insertar clientes
CREATE POLICY "Usuarios anónimos pueden crear clientes"
  ON clientes FOR INSERT
  TO anon
  WITH CHECK (true);

-- Crear política para que usuarios autenticados puedan ver todos los clientes
CREATE POLICY "Usuarios autenticados pueden ver clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

-- Crear política para que usuarios autenticados puedan actualizar clientes
CREATE POLICY "Usuarios autenticados pueden actualizar clientes"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Crear política para que usuarios autenticados puedan eliminar clientes
CREATE POLICY "Usuarios autenticados pueden eliminar clientes"
  ON clientes FOR DELETE
  TO authenticated
  USING (true);

-- Verificar políticas de citas para anon
DROP POLICY IF EXISTS "Cualquiera puede crear citas" ON citas;

CREATE POLICY "Usuarios anónimos pueden crear citas"
  ON citas FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verificar políticas de servicios para anon
DROP POLICY IF EXISTS "Cualquiera puede ver servicios activos" ON servicios;

CREATE POLICY "Usuarios anónimos pueden ver servicios"
  ON servicios FOR SELECT
  TO anon
  USING (activo = true);
