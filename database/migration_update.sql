-- Migration Update for SHHEER CASE Project
-- Date: December 23, 2025
-- Description: Add official_documents and whatsapp_settings tables

-- ============================================
-- 1. Official Documents Table
-- ============================================
CREATE TABLE IF NOT EXISTS `official_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `fileUrl` text COLLATE utf8mb4_general_ci NOT NULL,
  `fileName` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileType` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileSize` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- 2. WhatsApp Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS `whatsapp_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `phoneNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_general_ci,
  `position` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'bottom-right',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- 3. Insert Default WhatsApp Settings
-- ============================================
INSERT INTO `whatsapp_settings` (`isEnabled`, `phoneNumber`, `message`, `position`)
VALUES (0, '+966500000000', 'مرحباً، أرغب في الاستفسار عن القضية', 'bottom-right')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- ============================================
-- Migration Complete
-- ============================================
