import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false }
};

// Evidence items with their file URLs
const evidenceUpdates = [
  { id: 1, fileUrl: '/evidence/case_doc_01.webp', title: 'SHHEER Project License' },
  { id: 2, fileUrl: '/evidence/email_1.webp', title: 'RMA Activation Email' },
  { id: 3, fileUrl: '/evidence/email_2.webp', title: 'RMA Active Confirmation' },
  { id: 4, fileUrl: '/evidence/case_doc_05.webp', title: 'MT 760 Bank Guarantee' },
  { id: 5, fileUrl: '/evidence/case_doc_06.webp', title: 'PKI AUTH FAILED Screenshot' },
  { id: 6, fileUrl: '/evidence/case_doc_07.webp', title: 'WhatsApp Communication 1' },
  { id: 7, fileUrl: '/evidence/case_doc_08.webp', title: 'WhatsApp Communication 2' },
  { id: 8, fileUrl: '/evidence/email_3.webp', title: 'Email Chain - Oct 14' },
  { id: 9, fileUrl: '/evidence/case_doc_10.webp', title: 'Investor Withdrawal Letter' },
  { id: 10, fileUrl: '/evidence/case_doc_11.webp', title: 'Attorney Inquiry Letter' },
];

async function updateEvidenceUrls() {
  const connection = await mysql.createConnection(config);
  
  try {
    for (const item of evidenceUpdates) {
      await connection.execute(
        'UPDATE evidence_items SET fileUrl = ?, thumbnailUrl = ? WHERE id = ?',
        [item.fileUrl, item.fileUrl, item.id]
      );
      console.log(`Updated evidence ${item.id}: ${item.title}`);
    }
    
    console.log('All evidence URLs updated successfully!');
  } catch (error) {
    console.error('Error updating evidence URLs:', error);
  } finally {
    await connection.end();
  }
}

updateEvidenceUrls();
