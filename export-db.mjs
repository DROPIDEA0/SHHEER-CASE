import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

const tables = [
  'site_settings',
  'header_content', 
  'hero_section',
  'overview_parties',
  'case_elements',
  'timeline_events',
  'evidence_items',
  'videos',
  'footer_content',
  'timeline_categories',
  'evidence_categories',
  'timeline_event_evidence'
];

let output = '-- SHHEER Case Database Export\n';
output += '-- Generated: ' + new Date().toISOString() + '\n\n';

for (const table of tables) {
  try {
    const [rows] = await connection.query(`SELECT * FROM ${table}`);
    if (rows.length > 0) {
      output += `-- Table: ${table}\n`;
      output += `DELETE FROM ${table};\n`;
      for (const row of rows) {
        const columns = Object.keys(row).join(', ');
        const values = Object.values(row).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'object') return "'" + JSON.stringify(v).replace(/'/g, "''") + "'";
          return "'" + String(v).replace(/'/g, "''") + "'";
        }).join(', ');
        output += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
      }
      output += '\n';
    }
  } catch (e) {
    console.log(`Skipping ${table}: ${e.message}`);
  }
}

await connection.end();
console.log(output);
