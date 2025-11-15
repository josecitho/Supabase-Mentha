const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db');
const OUT_DIR = path.join(process.cwd(), 'prisma', 'exports');

function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
}

async function run() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Error: database not found at ${DB_PATH}`);
    process.exit(1);
  }

  ensureOutDir();

  const db = new sqlite3.Database(DB_PATH);

  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", async (err, tables) => {
    if (err) {
      console.error('Error reading tables:', err);
      db.close();
      process.exit(1);
    }

    if (!tables || tables.length === 0) {
      console.log('No tables found in SQLite DB.');
      db.close();
      return;
    }

    for (const row of tables) {
      const table = row.name;
      console.log(`Exporting table: ${table}`);

      db.all(`SELECT * FROM "${table}"`, (err, rows) => {
        if (err) {
          console.error(`Error reading ${table}:`, err);
          return;
        }

        const outFile = path.join(OUT_DIR, `${table}.csv`);
        let csvContent = '';

        if (rows.length === 0) {
          db.all(`PRAGMA table_info("${table}")`, (err, cols) => {
            if (err) {
              console.error(`Error reading pragma for ${table}:`, err);
              return;
            }
            const headers = cols.map(c => c.name);
            csvContent = headers.join(',') + '\n';
            fs.writeFileSync(outFile, csvContent, 'utf8');
            console.log(`  -> ${outFile} (0 rows)`);
          });
        } else {
          const headers = Object.keys(rows[0]);
          csvContent = headers.join(',') + '\n';

          for (const r of rows) {
            const vals = headers.map(h => escapeCsv(r[h]));
            csvContent += vals.join(',') + '\n';
          }

          fs.writeFileSync(outFile, csvContent, 'utf8');
          console.log(`  -> ${outFile} (${rows.length} rows)`);
        }
      });
    }

    setTimeout(() => {
      console.log('\nAll tables exported to prisma/exports/');
      db.close();
    }, 1000);
  });
}

run();
