const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function toCsv(rows, headers) {
  const lines = [headers.join(',')];
  for (const r of rows) {
    const values = headers.map(h => {
      let v = r[h];
      if (v === null || v === undefined) return '';
      if (v instanceof Date) return v.toISOString();
      if (typeof v === 'object') return JSON.stringify(v).replace(/"/g, '""');
      return String(v).replace(/"/g, '""');
    });
    // wrap values that contain commas or quotes
    const csvLine = values.map(v => (v.includes(',') || v.includes('"') ? `"${v}"` : v)).join(',');
    lines.push(csvLine);
  }
  return lines.join('\n');
}

async function exportAll() {
  try {
    const outDir = path.join(__dirname, '..', 'export');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    console.log('Reading Cliente...');
    const clientes = await prisma.cliente.findMany();
    if (clientes.length) {
      const headers = Object.keys(clientes[0]);
      const csv = await toCsv(clientes, headers);
      fs.writeFileSync(path.join(outDir, 'clientes.csv'), csv, 'utf8');
      console.log(`Wrote ${clientes.length} clientes`);
    } else {
      fs.writeFileSync(path.join(outDir, 'clientes.csv'), '');
      console.log('No clientes found');
    }

    console.log('Reading Servicio...');
    const servicios = await prisma.servicio.findMany();
    if (servicios.length) {
      const headers = Object.keys(servicios[0]);
      const csv = await toCsv(servicios, headers);
      fs.writeFileSync(path.join(outDir, 'servicios.csv'), csv, 'utf8');
      console.log(`Wrote ${servicios.length} servicios`);
    } else {
      fs.writeFileSync(path.join(outDir, 'servicios.csv'), '');
      console.log('No servicios found');
    }

    console.log('Reading Cita...');
    const citas = await prisma.cita.findMany();
    if (citas.length) {
      const headers = Object.keys(citas[0]);
      const csv = await toCsv(citas, headers);
      fs.writeFileSync(path.join(outDir, 'citas.csv'), csv, 'utf8');
      console.log(`Wrote ${citas.length} citas`);
    } else {
      fs.writeFileSync(path.join(outDir, 'citas.csv'), '');
      console.log('No citas found');
    }

    console.log('Export finished. Files in ./export');
  } catch (e) {
    console.error('Error exporting:', e);
  } finally {
    await prisma.$disconnect();
  }
}

exportAll();
