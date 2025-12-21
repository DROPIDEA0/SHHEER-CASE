-- =============================================
-- SHHEER Case - Complete Database Setup
-- Run this script on your production database
-- Generated: 2024-12-21
-- =============================================

-- =============================================
-- PART 1: CREATE NEW TABLES FOR AUTH SYSTEM
-- =============================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `adminRole` enum('super_admin','admin','editor','viewer') NOT NULL DEFAULT 'editor',
  `permissions` json DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `lastLogin` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Access Users Table (for site protection)
CREATE TABLE IF NOT EXISTS `site_access_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Protection Settings Table
CREATE TABLE IF NOT EXISTS `site_protection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isEnabled` tinyint(1) DEFAULT '0',
  `message` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- PART 2: ADD NEW COLUMNS TO TIMELINE_EVENTS
-- =============================================

-- Add custom color columns to timeline_events if they don't exist
SET @dbname = DATABASE();
SET @tablename = 'timeline_events';

-- Check and add customColor column
SET @columnname = 'customColor';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE `', @tablename, '` ADD COLUMN `', @columnname, '` varchar(50) DEFAULT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add customBgColor column
SET @columnname = 'customBgColor';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE `', @tablename, '` ADD COLUMN `', @columnname, '` varchar(50) DEFAULT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add customTextColor column
SET @columnname = 'customTextColor';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE `', @tablename, '` ADD COLUMN `', @columnname, '` varchar(50) DEFAULT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- =============================================
-- PART 3: INSERT DEFAULT ADMIN USER
-- =============================================

-- Insert default admin user (username: admin, password: admin123)
-- Password hash: $2b$10$y8XEPLBpxYMM90KIzt6KQ.Mw7n00NrAHoX5BX7LyhBZrtxC2wSmki
INSERT INTO `admin_users` (`username`, `password`, `name`, `email`, `adminRole`, `isActive`) 
VALUES ('admin', '$2b$10$y8XEPLBpxYMM90KIzt6KQ.Mw7n00NrAHoX5BX7LyhBZrtxC2wSmki', 'المدير العام', 'admin@shheercase.com', 'super_admin', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- =============================================
-- PART 4: INSERT DEFAULT SITE PROTECTION SETTINGS
-- =============================================

INSERT INTO `site_protection` (`id`, `isEnabled`, `message`) 
VALUES (1, 0, 'هذا الموقع محمي. يرجى تسجيل الدخول للمتابعة.')
ON DUPLICATE KEY UPDATE `id` = `id`;

-- =============================================
-- DONE!
-- =============================================
-- Default Admin Credentials:
-- Username: admin
-- Password: admin123
-- =============================================
