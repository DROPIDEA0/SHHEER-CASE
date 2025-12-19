CREATE TABLE `evidence_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`label` varchar(200) NOT NULL,
	`color` varchar(50) DEFAULT '#5d6d4e',
	`icon` varchar(50) DEFAULT 'FileText',
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `evidence_categories_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `timeline_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`label` varchar(200) NOT NULL,
	`color` varchar(50) DEFAULT '#5d6d4e',
	`bgColor` varchar(50) DEFAULT 'bg-[#5d6d4e]',
	`textColor` varchar(50) DEFAULT 'text-[#5d6d4e]',
	`lightColor` varchar(50) DEFAULT 'bg-[#5d6d4e]/10',
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `timeline_categories_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `timeline_event_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`evidenceId` int NOT NULL,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `timeline_event_evidence_id` PRIMARY KEY(`id`)
);
