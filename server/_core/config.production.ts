/**
 * Production Configuration File
 * 
 * This file contains hardcoded configuration for production deployment on Hostinger.
 * It serves as a fallback when environment variables are not properly loaded.
 * 
 * IMPORTANT: Update these values with your actual credentials!
 */

// Hardcoded production database credentials for Hostinger
// These are used as fallback when environment variables don't work
const HOSTINGER_DB_CONFIG = {
  host: '127.0.0.1',
  port: '3306',
  user: 'u713123409_shheer_case',
  password: 'Downy1441680798402930',
  database: 'u713123409_shheer_case',
};

export const PRODUCTION_CONFIG = {
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 
    `mysql://${HOSTINGER_DB_CONFIG.user}:${HOSTINGER_DB_CONFIG.password}@${HOSTINGER_DB_CONFIG.host}:${HOSTINGER_DB_CONFIG.port}/${HOSTINGER_DB_CONFIG.database}`,
  
  // Individual database variables
  DB_HOST: process.env.DB_HOST || HOSTINGER_DB_CONFIG.host,
  DB_PORT: process.env.DB_PORT || HOSTINGER_DB_CONFIG.port,
  DB_USER: process.env.DB_USER || HOSTINGER_DB_CONFIG.user,
  DB_PASSWORD: process.env.DB_PASSWORD || HOSTINGER_DB_CONFIG.password,
  DB_NAME: process.env.DB_NAME || HOSTINGER_DB_CONFIG.database,
  
  // JWT Secret for authentication
  JWT_SECRET: process.env.JWT_SECRET || '3f9c8e7a1d4b6a0e9c2f5b8d7a6c4e1f0b9a8d5c7e2f4a6b1c9e8d0f5a2',
  
  // Application settings
  NODE_ENV: process.env.NODE_ENV || 'production',
};

/**
 * Get the database URL from config or build it from individual variables
 */
export function getDatabaseUrlFromConfig(): string | null {
  // First try environment variable
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Then try individual environment variables
  const envHost = process.env.DB_HOST;
  const envUser = process.env.DB_USER;
  const envPassword = process.env.DB_PASSWORD;
  const envName = process.env.DB_NAME;
  const envPort = process.env.DB_PORT || '3306';
  
  if (envUser && envPassword && envName) {
    return `mysql://${envUser}:${encodeURIComponent(envPassword)}@${envHost || '127.0.0.1'}:${envPort}/${envName}`;
  }
  
  // Finally, use hardcoded config as fallback
  console.log('[Config] Using hardcoded database configuration');
  return `mysql://${HOSTINGER_DB_CONFIG.user}:${encodeURIComponent(HOSTINGER_DB_CONFIG.password)}@${HOSTINGER_DB_CONFIG.host}:${HOSTINGER_DB_CONFIG.port}/${HOSTINGER_DB_CONFIG.database}`;
}
