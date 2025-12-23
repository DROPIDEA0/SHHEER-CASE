-- Add whatsapp_settings table for floating WhatsApp button
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

-- Insert default settings
INSERT INTO `whatsapp_settings` (`isEnabled`, `phoneNumber`, `message`, `position`)
VALUES (0, '+966500000000', 'مرحباً، أرغب في الاستفسار عن القضية', 'bottom-right')
ON DUPLICATE KEY UPDATE `id`=`id`;
