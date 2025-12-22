#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * This script creates a new admin user in the database.
 * Run this script on the server to create the default admin user.
 * 
 * Usage:
 *   node create-admin.js
 * 
 * Or with custom credentials:
 *   node create-admin.js <username> <password> <name> <email>
 */

import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.production' });

// Default admin credentials
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_NAME = 'Administrator';
const DEFAULT_EMAIL = 'admin@example.com';

// Get credentials from command line or use defaults
const username = process.argv[2] || DEFAULT_USERNAME;
const password = process.argv[3] || DEFAULT_PASSWORD;
const name = process.argv[4] || DEFAULT_NAME;
const email = process.argv[5] || DEFAULT_EMAIL;

async function createAdminUser() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    
    // Parse DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }
    
    // Extract connection details from URL
    // Format: mysql://user:password@host:port/database
    const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!urlMatch) {
      throw new Error('Invalid DATABASE_URL format');
    }
    
    const [, user, pass, host, port, database] = urlMatch;
    
    // Create connection
    connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password: pass,
      database
    });
    
    console.log('✅ Connected to database');
    
    // Check if user already exists
    console.log(`🔍 Checking if user '${username}' exists...`);
    const [existingUsers] = await connection.execute(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      console.log(`⚠️  User '${username}' already exists!`);
      console.log('❌ Aborting. Please use a different username or delete the existing user first.');
      process.exit(1);
    }
    
    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert admin user
    console.log('👤 Creating admin user...');
    const [result] = await connection.execute(
      `INSERT INTO admin_users (username, password, name, email, adminRole, isActive) 
       VALUES (?, ?, ?, ?, 'super_admin', true)`,
      [username, hashedPassword, name, email]
    );
    
    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 User Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Name:     ${name}`);
    console.log(`Email:    ${email}`);
    console.log(`Role:     Super Admin`);
    console.log(`Status:   Active`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 Login URL: https://www.shheercase.com/admin/login');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
console.log('🚀 SHHEER Case - Create Admin User');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

createAdminUser();
