CREATE TABLE `case_elements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`icon` varchar(50),
	`items` json,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_elements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `case_structure` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionNumber` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_structure_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidence_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`evidenceCategory` enum('licenses','letters','swift','documents','emails','whatsapp') NOT NULL,
	`fileUrl` text,
	`fileName` varchar(300),
	`fileType` varchar(50),
	`thumbnailUrl` text,
	`eventId` int,
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `footer_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(200),
	`companySubtitle` varchar(300),
	`aboutText` text,
	`quickLinks` json,
	`contactAddress` text,
	`contactPhone` varchar(50),
	`contactWebsite` varchar(200),
	`legalDisclaimer` text,
	`commercialReg` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `footer_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `header_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logoUrl` text,
	`siteName` varchar(200),
	`siteSubtitle` varchar(300),
	`navItems` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `header_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_section` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300),
	`titleHighlight` varchar(200),
	`subtitle` varchar(300),
	`description` text,
	`guaranteeRef` varchar(100),
	`dealValue` varchar(50),
	`criticalPeriod` varchar(100),
	`ctaText` varchar(100),
	`ctaLink` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_section_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `overview_parties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partyType` enum('plaintiff','defendant','third_party') NOT NULL,
	`name` varchar(300) NOT NULL,
	`label` varchar(100),
	`representative` varchar(200),
	`role` varchar(300),
	`additionalInfo` text,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `overview_parties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`type` varchar(50) NOT NULL DEFAULT 'text',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `timeline_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(50) NOT NULL,
	`time` varchar(20),
	`title` varchar(300) NOT NULL,
	`description` text,
	`category` enum('foundation','investment_deal','swift_operations','critical_failure','legal_proceedings') NOT NULL,
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`videoUrl` text NOT NULL,
	`thumbnailUrl` text,
	`duration` varchar(50),
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
