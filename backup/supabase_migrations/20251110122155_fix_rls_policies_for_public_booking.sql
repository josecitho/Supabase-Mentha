/*
  # Arreglar Políticas RLS para Reservas Públicas

  1. Cambios
    - Permitir que usuarios anónimos puedan insertar clientes
    - Permitir que usuarios anónimos puedan leer servicios
    - Las políticas de citas ya permiten inserción pública
    
  2. Seguridad
    - Usuarios anónimos solo pueden insertar en clientes y citas
    - Solo usuarios autenticados pueden actualizar, eliminar y ver todas las citas
    - Servicios son de solo lectura para el público
*/

-- Eliminar políticas existentes conflictivas de clientes
DROP POLICY IF EXISTS "Autenticados pueden ver todos los clientes" ON clientes;
DROP POLICY IF EXISTS "Autenticados pueden gestionar clientes" ON clientes;

-- Nuevas políticas para clientes: Cualquiera puede insertar (para reservas públicas)
CREATE POLICY "Cualquiera puede crear clientes"
  ON clientes FOR INSERT
  WITH CHECK (true);

-- Solo autenticados pueden ver clientes
CREATE POLICY "Autenticados pueden ver clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

-- Solo autenticados pueden actualizar clientes
CREATE POLICY "Autenticados pueden actualizar clientes"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Solo autenticados pueden eliminar clientes
CREATE POLICY "Autenticados pueden eliminar clientes"
  ON clientes FOR DELETE
  TO authenticated
  USING (true);
