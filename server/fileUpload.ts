// Local file upload system for Hostinger deployment
// Saves files directly to the server filesystem

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root directory (one level up from server/)
const projectRoot = path.resolve(__dirname, '..');

// Define upload directories
const UPLOAD_DIRS = {
  logos: path.join(projectRoot, 'dist', 'public', 'uploads', 'logos'),
  favicons: path.join(projectRoot, 'dist', 'public', 'uploads', 'favicons'),
  videos: path.join(projectRoot, 'dist', 'public', 'uploads', 'videos'),
  evidence: path.join(projectRoot, 'dist', 'public', 'uploads', 'evidence'),
  documents: path.join(projectRoot, 'dist', 'public', 'uploads', 'documents'),
};

// Ensure upload directories exist
export function ensureUploadDirectories() {
  Object.values(UPLOAD_DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created upload directory: ${dir}`);
    }
  });
}

/**
 * Save a file to the server filesystem
 * @param fileData - Base64 encoded file data
 * @param fileName - Original file name
 * @param category - Upload category (logos, videos, etc.)
 * @returns Object with file path and public URL
 */
export async function saveFile(
  fileData: string,
  fileName: string,
  category: keyof typeof UPLOAD_DIRS
): Promise<{ key: string; url: string }> {
  // Ensure directories exist
  ensureUploadDirectories();

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `${timestamp}-${sanitizedFileName}`;

  // Get target directory
  const targetDir = UPLOAD_DIRS[category];
  const filePath = path.join(targetDir, uniqueFileName);

  // Convert base64 to buffer
  const buffer = Buffer.from(fileData, 'base64');

  // Write file to disk
  fs.writeFileSync(filePath, buffer);

  // Generate public URL
  const publicUrl = `/uploads/${category}/${uniqueFileName}`;

  console.log(`File saved: ${filePath} -> ${publicUrl}`);

  return {
    key: `${category}/${uniqueFileName}`,
    url: publicUrl,
  };
}

/**
 * Save a base64 image (with data URI prefix)
 * @param imageData - Base64 data URI (e.g., "data:image/png;base64,...")
 * @param category - Upload category
 * @returns Object with file path and public URL
 */
export async function saveBase64Image(
  imageData: string,
  category: keyof typeof UPLOAD_DIRS
): Promise<{ key: string; url: string }> {
  // Extract base64 data and file extension
  const matches = imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  
  if (!matches) {
    throw new Error('Invalid base64 image data');
  }

  const extension = matches[1];
  const base64Data = matches[2];
  const fileName = `image-${Date.now()}.${extension}`;

  return saveFile(base64Data, fileName, category);
}

/**
 * Delete a file from the server
 * @param fileKey - File key (e.g., "videos/123456-video.mp4")
 */
export async function deleteFile(fileKey: string): Promise<boolean> {
  try {
    const filePath = path.join(projectRoot, 'dist', 'public', 'uploads', fileKey);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
    return false;
  }
}

/**
 * Get file size in bytes
 * @param fileKey - File key
 */
export function getFileSize(fileKey: string): number {
  try {
    const filePath = path.join(projectRoot, 'dist', 'public', 'uploads', fileKey);
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Initialize directories on module load
ensureUploadDirectories();
