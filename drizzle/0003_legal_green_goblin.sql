ALTER TABLE `evidence_items` MODIFY COLUMN `evidenceCategory` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `timeline_events` MODIFY COLUMN `category` varchar(100) NOT NULL;