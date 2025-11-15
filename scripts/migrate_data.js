/**
 * Script para migrar datos de SQLite a Supabase (Postgres)
 * Uso: node scripts/migrate_data.js
 * 
 * Este script lee datos de SQLite (dev.db.bak) y los inserta en Supabase
 * usando Prisma Client.
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('📊 Iniciando migración de datos SQLite → Supabase...\n');

    // 1. Verificar que las tablas existen en Supabase
    console.log('✓ Verificando conexión a Supabase...');
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('  Tablas encontradas:', tables.map(t => t.table_name).join(', '));

    // 2. Contar datos en Supabase antes
    console.log('\n📈 Estado actual en Supabase:');
    const countUsuarios = await prisma.usuario.count();
    const countClientes = await prisma.cliente.count();
    const countServicios = await prisma.servicio.count();
    const countCitas = await prisma.cita.count();

    console.log(`  Usuarios: ${countUsuarios}`);
    console.log(`  Clientes: ${countClientes}`);
    console.log(`  Servicios: ${countServicios}`);
    console.log(`  Citas: ${countCitas}`);

    if (
      countUsuarios > 0 ||
      countClientes > 0 ||
      countServicios > 0 ||
      countCitas > 0
    ) {
      console.log(
        '\n⚠️  Ya hay datos en Supabase. ¿Deseas continuar? (esto duplicará registros)'
      );
      console.log('Limpia las tablas en Supabase si quieres empezar limpio.');
      return;
    }

    // 3. Leer datos de SQLite (dev.db.bak)
    console.log('\n📖 Leyendo datos de SQLite local (dev.db.bak)...');

    // Crear cliente Prisma temporal apuntando a SQLite
    const sqliteUrl = 'file:./prisma/dev.db.bak';
    const prismaSqlite = new PrismaClient({
      datasources: {
        db: {
          url: sqliteUrl,
        },
      },
    });

    const usuarios = await prismaSqlite.usuario.findMany();
    const clientes = await prismaSqlite.cliente.findMany();
    const servicios = await prismaSqlite.servicio.findMany();
    const citas = await prismaSqlite.cita.findMany();

    console.log(`  Usuarios a migrar: ${usuarios.length}`);
    console.log(`  Clientes a migrar: ${clientes.length}`);
    console.log(`  Servicios a migrar: ${servicios.length}`);
    console.log(`  Citas a migrar: ${citas.length}`);

    // 4. Insertar en Supabase (Postgres)
    console.log('\n✍️  Insertando datos en Supabase...');

    // Usuarios primero (sin dependencias)
    if (usuarios.length > 0) {
      console.log('  → Usuarios...');
      for (const usuario of usuarios) {
        await prisma.usuario.create({ data: usuario });
      }
      console.log(`    ✓ ${usuarios.length} usuarios insertados`);
    }

    // Clientes (sin dependencias)
    if (clientes.length > 0) {
      console.log('  → Clientes...');
      for (const cliente of clientes) {
        await prisma.cliente.create({ data: cliente });
      }
      console.log(`    ✓ ${clientes.length} clientes insertados`);
    }

    // Servicios (sin dependencias)
    if (servicios.length > 0) {
      console.log('  → Servicios...');
      for (const servicio of servicios) {
        await prisma.servicio.create({ data: servicio });
      }
      console.log(`    ✓ ${servicios.length} servicios insertados`);
    }

    // Citas (dependen de Cliente y Servicio)
    if (citas.length > 0) {
      console.log('  → Citas...');
      for (const cita of citas) {
        await prisma.cita.create({ data: cita });
      }
      console.log(`    ✓ ${citas.length} citas insertadas`);
    }

    console.log('\n✅ ¡Migración completada exitosamente!');
    console.log('\n📊 Resumen final:');
    console.log(`  Usuarios: ${usuarios.length} migrados`);
    console.log(`  Clientes: ${clientes.length} migrados`);
    console.log(`  Servicios: ${servicios.length} migrados`);
    console.log(`  Citas: ${citas.length} migrados`);

    await prismaSqlite.$disconnect();
  } catch (error) {
    console.error('\n❌ Error durante la migración:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
