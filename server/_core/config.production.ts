/**
 * Production Configuration File for Hostinger
 * 
 * HARDCODED DATABASE CREDENTIALS - Used when environment variables don't work
 */

// Hardcoded Hostinger database credentials
export const HOSTINGER_DB = {
  host: '127.0.0.1',
  port: '3306',
  user: 'u713123409_shheer_case',
  password: 'Downy1441680798402930',
  database: 'u713123409_shheer_case',
};

// Build DATABASE_URL from hardcoded values
export const HARDCODED_DATABASE_URL = `mysql://${HOSTINGER_DB.user}:${HOSTINGER_DB.password}@${HOSTINGER_DB.host}:${HOSTINGER_DB.port}/${HOSTINGER_DB.database}`;

export const PRODUCTION_CONFIG = {
  DATABASE_URL: HARDCODED_DATABASE_URL,
  DB_HOST: HOSTINGER_DB.host,
  DB_PORT: HOSTINGER_DB.port,
  DB_USER: HOSTINGER_DB.user,
  DB_PASSWORD: HOSTINGER_DB.password,
  DB_NAME: HOSTINGER_DB.database,
  JWT_SECRET: '3f9c8e7a1d4b6a0e9c2f5b8d7a6c4e1f0b9a8d5c7e2f4a6b1c9e8d0f5a2',
  NODE_ENV: 'production',
};

/**
 * Get the database URL - always returns hardcoded URL as fallback
 */
export function getDatabaseUrlFromConfig(): string {
  // Try environment variable first
  if (process.env.DATABASE_URL) {
    console.log('[Config] Using DATABASE_URL from environment');
    return process.env.DATABASE_URL;
  }
  
  // Try building from individual env vars
  if (process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
    const url = `mysql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME}`;
    console.log('[Config] Built DATABASE_URL from environment variables');
    return url;
  }
  
  // Use hardcoded credentials
  console.log('[Config] Using HARDCODED database credentials');
  return HARDCODED_DATABASE_URL;
}
