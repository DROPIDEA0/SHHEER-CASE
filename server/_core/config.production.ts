/**
 * Production Configuration File
 * 
 * This file contains hardcoded configuration for production deployment on Hostinger.
 * It serves as a fallback when environment variables are not properly loaded.
 * 
 * IMPORTANT: This file should be edited directly on the server or via Hostinger File Manager.
 * DO NOT commit sensitive values to Git!
 * 
 * Instructions:
 * 1. After deployment, edit this file via Hostinger File Manager
 * 2. Replace the placeholder values with your actual credentials
 * 3. Restart the application
 */

export const PRODUCTION_CONFIG = {
  // Database Configuration
  // Format: mysql://username:password@host:port/database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Individual database variables (used if DATABASE_URL is not set)
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: process.env.DB_PORT || '3306',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
  
  // JWT Secret for authentication
  JWT_SECRET: process.env.JWT_SECRET || '',
  
  // Application settings
  NODE_ENV: process.env.NODE_ENV || 'production',
};

/**
 * Get the database URL from config or build it from individual variables
 */
export function getDatabaseUrlFromConfig(): string | null {
  // First try DATABASE_URL
  if (PRODUCTION_CONFIG.DATABASE_URL) {
    return PRODUCTION_CONFIG.DATABASE_URL;
  }
  
  // Then try to build from individual variables
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = PRODUCTION_CONFIG;
  
  if (DB_USER && DB_PASSWORD && DB_NAME) {
    return `mysql://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }
  
  return null;
}
