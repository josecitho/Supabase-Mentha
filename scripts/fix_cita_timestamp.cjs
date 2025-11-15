const fs = require('fs');
const path = require('path');

const IN = path.join(process.cwd(), 'prisma', 'exports', 'Cita_clean.csv');
const OUT = path.join(process.cwd(), 'prisma', 'exports', 'Cita_fixed.csv');

if (!fs.existsSync(IN)) {
  console.error('Input file not found:', IN);
  process.exit(1);
}

const content = fs.readFileSync(IN, 'utf8').trim();
const lines = content.split('\n');
if (lines.length <= 1) {
  console.error('No data found in', IN);
  process.exit(1);
}

const headers = lines[0];
const rows = lines.slice(1);

const outLines = [headers];
for (const line of rows) {
  if (!line.trim()) continue;
  // Simple CSV split (no complex quoting expected here)
  const parts = line.split(',');
  // expected: id,cliente_id,servicio_id,fecha_hora,estado,notas
  if (parts.length < 6) {
    console.warn('Skipping malformed line:', line);
    continue;
  }
  const ts = parts[3];
  // If numeric, convert from ms to ISO; otherwise leave
  if (/^\d+$/.test(ts)) {
    const ms = Number(ts);
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp for line, leaving as-is:', line);
      outLines.push(line);
      continue;
    }
    parts[3] = date.toISOString();
  }
  outLines.push(parts.join(','));
}

fs.writeFileSync(OUT, outLines.join('\n'), 'utf8');
console.log('Wrote', OUT);
