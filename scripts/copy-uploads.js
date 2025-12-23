#!/usr/bin/env node

/**
 * Copy uploads directory from public/ to dist/public/ after build
 * This ensures uploaded files persist and are accessible via the web server
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceDir = path.join(projectRoot, 'public', 'uploads');
const targetDir = path.join(projectRoot, 'dist', 'public', 'uploads');

/**
 * Recursively copy directory
 */
function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('📁 Copying uploads directory...');
  console.log(`   Source: ${sourceDir}`);
  console.log(`   Target: ${targetDir}`);

  // Create source directory if it doesn't exist
  if (!fs.existsSync(sourceDir)) {
    console.log('⚠️  Source directory does not exist, creating it...');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    // Create subdirectories
    const subdirs = ['logos', 'favicons', 'videos', 'evidence', 'documents'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(sourceDir, subdir);
      fs.mkdirSync(subdirPath, { recursive: true });
      console.log(`   Created: ${subdir}/`);
    });
  }

  // Copy directory
  copyDirectory(sourceDir, targetDir);

  console.log('✅ Uploads directory copied successfully!');
} catch (error) {
  console.error('❌ Error copying uploads directory:', error);
  process.exit(1);
}
