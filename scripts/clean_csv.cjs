const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'prisma', 'exports');

function cleanCsv(inputFile, outputFile, columnsToRemove = []) {
  const content = fs.readFileSync(inputFile, 'utf8');
  const lines = content.split('\n');
  
  if (lines.length === 0) return;
  
  const headers = lines[0].split(',').map(h => h.trim());
  const indicesToRemove = new Set();
  
  columnsToRemove.forEach(col => {
    const idx = headers.indexOf(`"${col}"`) !== -1 ? headers.indexOf(`"${col}"`) : headers.indexOf(col);
    if (idx !== -1) indicesToRemove.add(idx);
  });
  
  if (indicesToRemove.size === 0) {
    console.log(`No columns to remove in ${path.basename(inputFile)}, copying as-is`);
    fs.copyFileSync(inputFile, outputFile);
    return;
  }
  
  const newHeaders = headers.filter((_, i) => !indicesToRemove.has(i));
  const cleanedLines = [newHeaders.join(',')];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    // Simple CSV parsing (handles quoted fields)
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    const filteredParts = parts.filter((_, i) => !indicesToRemove.has(i));
    cleanedLines.push(filteredParts.join(','));
  }
  
  fs.writeFileSync(outputFile, cleanedLines.join('\n'), 'utf8');
  console.log(`✓ Cleaned: ${path.basename(inputFile)}`);
}

// Remove problematic date columns
cleanCsv(
  path.join(OUT_DIR, 'Usuario.csv'),
  path.join(OUT_DIR, 'Usuario_clean.csv'),
  ['createdAt', 'updatedAt']
);

cleanCsv(
  path.join(OUT_DIR, 'Cliente.csv'),
  path.join(OUT_DIR, 'Cliente_clean.csv'),
  ['createdAt', 'updatedAt']
);

cleanCsv(
  path.join(OUT_DIR, 'Servicio.csv'),
  path.join(OUT_DIR, 'Servicio_clean.csv'),
  ['createdAt', 'updatedAt']
);

cleanCsv(
  path.join(OUT_DIR, 'Cita.csv'),
  path.join(OUT_DIR, 'Cita_clean.csv'),
  ['createdAt', 'updatedAt']
);

console.log('\n✓ All CSVs cleaned! Use the *_clean.csv files for import.');
