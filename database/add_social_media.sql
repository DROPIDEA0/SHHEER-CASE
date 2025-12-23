-- Add social_media table for footer social media links
CREATE TABLE IF NOT EXISTS `social_media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `displayOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `platform` (`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default social media platforms
INSERT INTO `social_media` (`platform`, `url`, `isActive`, `displayOrder`)
VALUES 
  ('facebook', 'https://facebook.com/', 0, 1),
  ('twitter', 'https://twitter.com/', 0, 2),
  ('instagram', 'https://instagram.com/', 0, 3),
  ('tiktok', 'https://tiktok.com/', 0, 4),
  ('snapchat', 'https://snapchat.com/', 0, 5)
ON DUPLICATE KEY UPDATE `id`=`id`;
