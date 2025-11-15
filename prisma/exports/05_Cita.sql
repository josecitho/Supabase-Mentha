-- 5. Crear tabla Cita
CREATE TABLE IF NOT EXISTS "Cita" (
  "id" SERIAL PRIMARY KEY,
  "cliente_id" INTEGER NOT NULL,
  "servicio_id" INTEGER NOT NULL,
  "fecha_hora" TIMESTAMPTZ NOT NULL,
  "estado" VARCHAR(50) DEFAULT 'pendiente',
  "notas" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE CASCADE,
  FOREIGN KEY ("servicio_id") REFERENCES "Servicio"("id") ON DELETE CASCADE
);
