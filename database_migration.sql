-- =====================================================
-- SHHEER CASE - Database Migration Script
-- =====================================================
-- Run this script on your production database to add
-- the new tables and columns required for admin features.
-- 
-- This script is SAFE to run multiple times - it uses
-- IF NOT EXISTS and checks for existing data.
-- =====================================================

-- 1. Create admin_users table (for admin panel authentication)
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
  UNIQUE KEY `admin_users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create site_access_users table (for site protection)
CREATE TABLE IF NOT EXISTS `site_access_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_access_users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create site_protection table (for site protection settings)
CREATE TABLE IF NOT EXISTS `site_protection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isEnabled` tinyint(1) DEFAULT '0',
  `message` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create admin_settings table (for admin panel settings like logo, favicon)
CREATE TABLE IF NOT EXISTS `admin_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `settingKey` varchar(100) NOT NULL,
  `settingValue` longtext,
  `settingType` varchar(50) DEFAULT 'text',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_settings_key_unique` (`settingKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Add custom color columns to timeline_events (if not exists)
-- Using ALTER IGNORE to skip if column already exists

-- Check and add customColor
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'timeline_events' AND COLUMN_NAME = 'customColor') = 0,
  'ALTER TABLE `timeline_events` ADD COLUMN `customColor` varchar(50) DEFAULT NULL',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add customBgColor
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'timeline_events' AND COLUMN_NAME = 'customBgColor') = 0,
  'ALTER TABLE `timeline_events` ADD COLUMN `customBgColor` varchar(50) DEFAULT NULL',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add customTextColor
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'timeline_events' AND COLUMN_NAME = 'customTextColor') = 0,
  'ALTER TABLE `timeline_events` ADD COLUMN `customTextColor` varchar(50) DEFAULT NULL',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 6. Insert default admin user
-- Password: admin123 (bcrypt hashed)
-- IMPORTANT: Change this password immediately after first login!
INSERT INTO `admin_users` (`username`, `password`, `name`, `email`, `adminRole`, `isActive`)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'المدير', 'admin@shheercase.com', 'super_admin', 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `admin_users` WHERE `username` = 'admin');

-- 7. Insert default site protection settings
INSERT INTO `site_protection` (`id`, `isEnabled`, `message`)
SELECT 1, 0, 'هذا الموقع محمي. يرجى تسجيل الدخول للمتابعة.'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `site_protection` WHERE `id` = 1);

-- 8. Insert default admin settings
INSERT INTO `admin_settings` (`settingKey`, `settingValue`, `settingType`) 
SELECT 'admin_logo', NULL, 'image' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `admin_settings` WHERE `settingKey` = 'admin_logo');

INSERT INTO `admin_settings` (`settingKey`, `settingValue`, `settingType`) 
SELECT 'favicon', NULL, 'image' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `admin_settings` WHERE `settingKey` = 'favicon');

INSERT INTO `admin_settings` (`settingKey`, `settingValue`, `settingType`) 
SELECT 'site_title', 'SHHEER CASE', 'text' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `admin_settings` WHERE `settingKey` = 'site_title');

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- 
-- Default Admin Credentials:
--   Username: admin
--   Password: admin123
-- 
-- ⚠️ SECURITY WARNING:
-- Please change the default password immediately after
-- your first login to the admin panel!
-- 
-- Go to: /admin/settings -> Security tab
-- =====================================================
