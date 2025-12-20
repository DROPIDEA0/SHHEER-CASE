// Entry point for Hostinger deployment
// This file handles the startup and provides fallback for database issues

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from multiple possible locations
const envPaths = [
  path.join(__dirname, '.env'),
  path.join(__dirname, '../.env'),
  '/home/.env',
  '/var/www/.env',
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`[Hostinger] Loading .env from: ${envPath}`);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('[Hostinger] No .env file found, using system environment variables');
  dotenv.config();
}

// Log environment status
console.log('[Hostinger] Environment Status:');
console.log('  - DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('  - DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('  - DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('  - DB_NAME:', process.env.DB_NAME || 'NOT SET');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

// Now import and start the main server
async function startServer() {
  try {
    console.log('[Hostinger] Starting main server...');
    await import('./dist/index.js');
    console.log('[Hostinger] Main server started successfully');
  } catch (error) {
    console.error('[Hostinger] Failed to start main server:', error.message);
    console.error('[Hostinger] Stack:', error.stack);
    
    // Fallback: serve static files only
    console.log('[Hostinger] Starting fallback static server...');
    
    const express = (await import('express')).default;
    const app = express();
    const PORT = process.env.PORT || 3000;
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'fallback_mode',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    });
    
    // Debug endpoint
    app.get('/api/debug', (req, res) => {
      res.json({
        mode: 'fallback',
        env: {
          DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
          DB_HOST: process.env.DB_HOST || 'NOT SET',
          DB_USER: process.env.DB_USER || 'NOT SET',
          DB_NAME: process.env.DB_NAME || 'NOT SET',
          NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        },
        error: error.message,
        timestamp: new Date().toISOString()
      });
    });
    
    // Serve static files
    const publicPath = path.join(__dirname, 'dist/public');
    if (fs.existsSync(publicPath)) {
      app.use(express.static(publicPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
      });
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Hostinger] Fallback server running on port ${PORT}`);
    });
  }
}

startServer();
