/*
  # Sistema de Gestión de Salón de Belleza

  1. Nuevas Tablas
    - `clientes`
      - `id` (uuid, primary key)
      - `nombre` (text) - Nombre completo del cliente
      - `telefono` (text) - Número de teléfono
      - `correo` (text) - Correo electrónico
      - `nota` (text, opcional) - Notas adicionales sobre el cliente
      - `created_at` (timestamptz) - Fecha de registro
    
    - `servicios`
      - `id` (uuid, primary key)
      - `nombre_servicio` (text) - Nombre del servicio
      - `precio` (decimal) - Precio del servicio
      - `duracion_minutos` (integer) - Duración en minutos
      - `activo` (boolean) - Si el servicio está disponible
      - `created_at` (timestamptz) - Fecha de creación
    
    - `citas`
      - `id` (uuid, primary key)
      - `cliente_id` (uuid, foreign key -> clientes)
      - `servicio_id` (uuid, foreign key -> servicios)
      - `fecha_hora` (timestamptz) - Fecha y hora de la cita
      - `estado` (text) - Estado: 'pendiente', 'confirmada', 'cancelada', 'completada'
      - `notas` (text, opcional) - Notas adicionales
      - `created_at` (timestamptz) - Fecha de creación

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para permitir lectura pública de servicios
    - Políticas para insertar citas (usuarios anónimos pueden reservar)
    - Políticas administrativas para gestión completa
*/

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono text NOT NULL,
  correo text NOT NULL,
  nota text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_servicio text NOT NULL,
  precio decimal(10,2) NOT NULL,
  duracion_minutos integer NOT NULL,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  servicio_id uuid NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
  fecha_hora timestamptz NOT NULL,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  notas text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

-- Políticas para servicios (lectura pública)
CREATE POLICY "Cualquiera puede ver servicios activos"
  ON servicios FOR SELECT
  USING (activo = true);

CREATE POLICY "Solo autenticados pueden gestionar servicios"
  ON servicios FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para clientes (solo lectura para propietarios)
CREATE POLICY "Autenticados pueden ver todos los clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Autenticados pueden gestionar clientes"
  ON clientes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para citas
CREATE POLICY "Cualquiera puede crear citas"
  ON citas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Autenticados pueden ver todas las citas"
  ON citas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Autenticados pueden actualizar citas"
  ON citas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Autenticados pueden eliminar citas"
  ON citas FOR DELETE
  TO authenticated
  USING (true);

-- Insertar servicios de ejemplo
INSERT INTO servicios (nombre_servicio, precio, duracion_minutos) VALUES
  ('Corte de Cabello', 35.00, 45),
  ('Tinte Completo', 85.00, 120),
  ('Balayage', 150.00, 180),
  ('Tratamiento Capilar', 65.00, 60),
  ('Facial Básico', 75.00, 60),
  ('Facial Premium', 120.00, 90),
  ('Manicure', 30.00, 45),
  ('Pedicure', 45.00, 60),
  ('Maquillaje', 55.00, 60),
  ('Extensiones de Pestañas', 95.00, 120)
ON CONFLICT DO NOTHING;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_citas_fecha_hora ON citas(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_citas_cliente ON citas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_citas_servicio ON citas(servicio_id);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas(estado);
