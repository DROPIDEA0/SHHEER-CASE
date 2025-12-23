-- Add official_documents table for large files
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
