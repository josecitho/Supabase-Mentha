-- 4. Crear tabla Servicio
CREATE TABLE IF NOT EXISTS "Servicio" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(255) NOT NULL,
  "descripcion" TEXT,
  "duracion_minutos" INTEGER NOT NULL,
  "precio" NUMERIC(10,2) NOT NULL,
  "activo" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
