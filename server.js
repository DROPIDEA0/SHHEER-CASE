// Entry point for Hostinger deployment
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Debug endpoint to check database connection
app.get('/api/debug/db', async (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  const hasDbUrl = !!dbUrl;
  const maskedUrl = dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'NOT SET';
  
  if (!dbUrl) {
    return res.json({
      status: 'no_database_url',
      hasDbUrl: false,
      maskedUrl: 'NOT SET',
      message: 'DATABASE_URL environment variable is not set'
    });
  }
  
  try {
    // Try to connect using mysql2
    const mysql = await import('mysql2/promise');
    const connection = await mysql.createConnection(dbUrl);
    
    // Test query
    const [rows] = await connection.execute('SELECT * FROM header_content LIMIT 1');
    await connection.end();
    
    return res.json({
      status: 'connected',
      hasDbUrl: true,
      maskedUrl,
      hasData: rows.length > 0,
      dataPreview: rows[0] || null
    });
  } catch (error) {
    return res.json({
      status: 'error',
      hasDbUrl: true,
      maskedUrl,
      error: error.message,
      errorCode: error.code
    });
  }
});

// Debug endpoint to check environment
app.get('/api/debug/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV || 'not set',
    hasDbUrl: !!process.env.DATABASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    port: PORT
  });
});

// Import the main server after debug endpoints
import('./dist/index.js').catch(err => {
  console.error('Failed to load main server:', err.message);
  
  // Serve static files as fallback
  app.use(express.static(path.join(__dirname, 'dist/public')));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(__dirname, 'dist/public/index.html'));
    } else {
      res.status(500).json({ error: 'Server not fully initialized', details: err.message });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Fallback server running on port ${PORT}`);
  });
});
