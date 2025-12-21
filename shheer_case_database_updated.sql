-- =============================================
-- SHHEER Case - Complete Database Export
-- With Latest Updates (Custom Colors for Timeline)
-- For Hostinger MySQL Database
-- Generated: 2024-12-21
-- =============================================

-- =============================================
-- STEP 1: DROP EXISTING TABLES (Clean Install)
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `timeline_event_evidence`;
DROP TABLE IF EXISTS `timeline_events`;
DROP TABLE IF EXISTS `timeline_categories`;
DROP TABLE IF EXISTS `evidence_items`;
DROP TABLE IF EXISTS `evidence_categories`;
DROP TABLE IF EXISTS `videos`;
DROP TABLE IF EXISTS `overview_parties`;
DROP TABLE IF EXISTS `hero_section`;
DROP TABLE IF EXISTS `header_content`;
DROP TABLE IF EXISTS `footer_content`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `case_elements`;
DROP TABLE IF EXISTS `case_structure`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- STEP 2: CREATE TABLES (Schema)
-- =============================================

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);

-- Case Elements Table
CREATE TABLE IF NOT EXISTS `case_elements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`icon` varchar(50),
	`items` json,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_elements_id` PRIMARY KEY(`id`)
);

-- Case Structure Table
CREATE TABLE IF NOT EXISTS `case_structure` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionNumber` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_structure_id` PRIMARY KEY(`id`)
);

-- Evidence Items Table
CREATE TABLE IF NOT EXISTS `evidence_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`evidenceCategory` varchar(100) NOT NULL,
	`fileUrl` text,
	`fileName` varchar(300),
	`fileType` varchar(50),
	`thumbnailUrl` text,
	`eventId` int,
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_items_id` PRIMARY KEY(`id`)
);

-- Footer Content Table
CREATE TABLE IF NOT EXISTS `footer_content` (
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
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `footer_content_id` PRIMARY KEY(`id`)
);

-- Header Content Table
CREATE TABLE IF NOT EXISTS `header_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logoUrl` text,
	`siteName` varchar(200),
	`siteSubtitle` varchar(300),
	`navItems` json,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `header_content_id` PRIMARY KEY(`id`)
);

-- Hero Section Table
CREATE TABLE IF NOT EXISTS `hero_section` (
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
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_section_id` PRIMARY KEY(`id`)
);

-- Overview Parties Table
CREATE TABLE IF NOT EXISTS `overview_parties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partyType` enum('plaintiff','defendant','third_party') NOT NULL,
	`name` varchar(300) NOT NULL,
	`label` varchar(100),
	`representative` varchar(200),
	`role` varchar(300),
	`additionalInfo` text,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `overview_parties_id` PRIMARY KEY(`id`)
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`type` varchar(50) NOT NULL DEFAULT 'text',
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);

-- Timeline Events Table (WITH CUSTOM COLOR COLUMNS - NEW!)
CREATE TABLE IF NOT EXISTS `timeline_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(50) NOT NULL,
	`time` varchar(20),
	`title` varchar(300) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`customColor` varchar(50) DEFAULT NULL,
	`customBgColor` varchar(50) DEFAULT NULL,
	`customTextColor` varchar(50) DEFAULT NULL,
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_events_id` PRIMARY KEY(`id`)
);

-- Videos Table
CREATE TABLE IF NOT EXISTS `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`videoUrl` text NOT NULL,
	`thumbnailUrl` text,
	`duration` varchar(50),
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);

-- Evidence Categories Table
CREATE TABLE IF NOT EXISTS `evidence_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`label` varchar(200) NOT NULL,
	`color` varchar(50) DEFAULT '#5d6d4e',
	`icon` varchar(50) DEFAULT 'FileText',
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `evidence_categories_key_unique` UNIQUE(`key`)
);

-- Timeline Categories Table
CREATE TABLE IF NOT EXISTS `timeline_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`label` varchar(200) NOT NULL,
	`color` varchar(50) DEFAULT '#5d6d4e',
	`bgColor` varchar(50) DEFAULT '#f5f2eb',
	`textColor` varchar(50) DEFAULT '#3d3d3d',
	`lightColor` varchar(50) DEFAULT '#5d6d4e1a',
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `timeline_categories_key_unique` UNIQUE(`key`)
);

-- Timeline Event Evidence Junction Table
CREATE TABLE IF NOT EXISTS `timeline_event_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`evidenceId` int NOT NULL,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_event_evidence_id` PRIMARY KEY(`id`)
);

-- =============================================
-- STEP 3: INSERT DATA
-- =============================================

-- Header Content
INSERT INTO header_content (logoUrl, siteName, siteSubtitle, navItems) VALUES 
('/images/logo.png', 'SHHEER Case', 'Bank Guarantee Dispute', '[{"label":"Overview","href":"#overview"},{"label":"Timeline","href":"#timeline"},{"label":"Evidence","href":"#evidence"},{"label":"Videos","href":"#videos"},{"label":"Contact","href":"#contact"}]');

-- Hero Section
INSERT INTO hero_section (title, titleHighlight, subtitle, description, guaranteeRef, dealValue, criticalPeriod, ctaText, ctaLink) VALUES 
('Bank Guarantee', 'Dispute Case', 'SHHEER (شهير) Project', 'A comprehensive documentation of how Al Rajhi Bank''s operational failures and communication breakdowns led to the collapse of a €120 million investment deal for the SHHEER mobile advertising platform.', 'JVA-PTVL-FIACL-TBTSCGL-25072013', '€120M', 'Oct - Nov 2013', 'View Timeline', '#timeline');

-- Overview Parties
INSERT INTO overview_parties (partyType, name, label, representative, role, displayOrder) VALUES 
('plaintiff', 'Nesma Barzan Foundation', 'THE PLAINTIFF', 'Abdulaziz Al-Amoudi', 'Project Owner & Rights Holder', 1),
('defendant', 'Al Rajhi Bank', 'THE DEFENDANT', NULL, 'Receiving Bank (MT 760)', 2),
('third_party', 'DAMA Investment Group', 'INTERNATIONAL PARTIES', NULL, 'Investment Facilitator', 3),
('third_party', 'UNICOMBANK (Moldova)', 'INTERNATIONAL PARTIES', NULL, 'Bank Guarantee Issuer', 4),
('third_party', 'SCC Simpatrans', 'INTERNATIONAL PARTIES', NULL, 'Investment Company', 5);

-- Timeline Categories
INSERT INTO timeline_categories (`key`, label, color, bgColor, textColor, lightColor, displayOrder) VALUES 
('Foundation', 'Foundation', '#5D6B3D', '#f5f2eb', '#3d3d3d', '#5d6b3d1a', 1),
('Investment Deal', 'Investment Deal', '#D4A574', '#faf8f3', '#3d3d3d', '#D4A5741a', 2),
('SWIFT Operations', 'SWIFT Operations', '#4A90A4', '#eff6ff', '#1e3a5f', '#4A90A41a', 3),
('Critical Failure', 'Critical Failure', '#C75050', '#fef2f2', '#450a0a', '#C750501a', 4),
('Legal Proceedings', 'Legal Proceedings', '#6B5B95', '#faf5ff', '#3b0764', '#6B5B951a', 5);

-- Evidence Categories
INSERT INTO evidence_categories (`key`, label, color, icon, displayOrder) VALUES 
('Licenses', 'Licenses', '#5D6B3D', 'FileCheck', 1),
('Emails', 'Emails', '#4A90A4', 'Mail', 2),
('SWIFT', 'SWIFT', '#D4A574', 'FileCode', 3),
('WhatsApp', 'WhatsApp', '#25D366', 'MessageCircle', 4),
('Letters', 'Letters', '#6B5B95', 'FileText', 5),
('Documents', 'Documents', '#808080', 'File', 6);

-- Timeline Events (WITH CUSTOM COLOR COLUMNS)
INSERT INTO timeline_events (date, time, title, description, category, customColor, customBgColor, customTextColor, displayOrder) VALUES 
('2005-01-01', NULL, 'SHHEER Project Licensed', 'Official license granted for SHHEER (شهير) project - a major real estate development initiative in Saudi Arabia.', 'Foundation', NULL, NULL, NULL, 1),
('2013-07-25', NULL, 'Investment Deal Initiated', 'DAMA Investment Group begins negotiations for €120M investment in SHHEER project.', 'Foundation', NULL, NULL, NULL, 2),
('2013-10-07', NULL, 'Bank Guarantee Requirement Set', 'DAMA requires bank guarantee as condition for investment execution.', 'Investment Deal', NULL, NULL, NULL, 3),
('2013-10-14', '10:30:00', 'RMA Activation Request Sent', 'Al Rajhi Bank initiates RMA (Relationship Management Application) activation with UNICOMBANK.', 'SWIFT Operations', NULL, NULL, NULL, 4),
('2013-10-15', '09:15:00', 'RMA Confirmation Received', 'UNICOMBANK confirms RMA activation - SWIFT channel now open between banks.', 'SWIFT Operations', NULL, NULL, NULL, 5),
('2013-10-17', NULL, 'MT 760 Guarantee Issued', 'UNICOMBANK issues MT 760 bank guarantee for €300M (Ref: JVA-PTVL-FIACL-TBTSCGL-25072013).', 'SWIFT Operations', NULL, NULL, NULL, 6),
('2013-10-21', NULL, 'Guarantee Copy Received at Branch', 'Faisal Al-Rawdan receives copy of guarantee at Al Rajhi Bank branch. Witnesses: Youssef Athnian, Hamoud Al-Issa.', 'SWIFT Operations', NULL, NULL, NULL, 7),
('2013-10-28', '14:22:00', 'PKI AUTH FAILED Error', 'Critical SWIFT authentication failure - MT 760 cannot be verified. Bank fails to resolve issue.', 'Critical Failure', NULL, NULL, NULL, 8),
('2013-10-29', NULL, 'Address Error Discovered', 'Repeated error in postal address: "kapran" instead of "katran" - indicating systemic issues.', 'Critical Failure', NULL, NULL, NULL, 9),
('2013-11-04', NULL, 'Communication Breakdown', 'Multiple failed attempts to reach bank officials. No response to urgent inquiries.', 'Critical Failure', NULL, NULL, NULL, 10),
('2013-11-12', '16:45:00', 'Investor Withdrawal Notice', 'SCC Simpatrans officially withdraws from investment deal due to bank guarantee failure.', 'Critical Failure', NULL, NULL, NULL, 11),
('2014-02-15', NULL, 'Legal Counsel Engaged', 'Attorney sends first formal inquiry letter to Al Rajhi Bank regarding the failed guarantee.', 'Legal Proceedings', NULL, NULL, NULL, 12),
('2014-03-20', NULL, 'Bank Official Response', 'Al Rajhi Bank responds with denial and contradictions to documented evidence.', 'Legal Proceedings', NULL, NULL, NULL, 13),
('2014-06-01', NULL, 'Case Filed with Banking Disputes Committee', 'Formal lawsuit filed with Banking Disputes Committee in Riyadh.', 'Legal Proceedings', NULL, NULL, NULL, 14),
('2014-07-15', NULL, 'Committee Notification Issued', 'Banking Disputes Committee issues notification to Al Rajhi Bank.', 'Legal Proceedings', NULL, NULL, NULL, 15),
('2014-09-10', NULL, 'Bank Defense Submitted', 'Al Rajhi Bank lawyer submits defense memorandum with continued denials.', 'Legal Proceedings', NULL, NULL, NULL, 16),
('2014-11-20', NULL, 'Plaintiff Rebuttal Filed', 'Comprehensive rebuttal filed with additional evidence and international banking standards citations.', 'Legal Proceedings', NULL, NULL, NULL, 17);

-- Evidence Items
INSERT INTO evidence_items (title, description, evidenceCategory, fileUrl, thumbnailUrl, displayOrder) VALUES 
('SHHEER Project License', 'Official license document from 2005', 'Licenses', '/evidence/case_doc_01.webp', '/evidence/case_doc_01.webp', 1),
('RMA Activation Email', 'Email confirming RMA activation between banks', 'Emails', '/evidence/email_1.webp', '/evidence/email_1.webp', 2),
('RMA Active Confirmation', 'SWIFT confirmation of active RMA status', 'Emails', '/evidence/email_2.webp', '/evidence/email_2.webp', 3),
('MT 760 Bank Guarantee', 'Original SWIFT MT 760 message', 'SWIFT', '/evidence/case_doc_05.webp', '/evidence/case_doc_05.webp', 4),
('PKI AUTH FAILED Screenshot', 'Screenshot showing authentication failure', 'SWIFT', '/evidence/case_doc_06.webp', '/evidence/case_doc_06.webp', 5),
('WhatsApp Communication 1', 'WhatsApp messages with bank officials', 'WhatsApp', '/evidence/case_doc_07.webp', '/evidence/case_doc_07.webp', 6),
('WhatsApp Communication 2', 'Follow-up WhatsApp messages', 'WhatsApp', '/evidence/case_doc_08.webp', '/evidence/case_doc_08.webp', 7),
('Email Chain - Oct 14', 'Email correspondence dated October 14, 2013', 'Emails', '/evidence/email_3.webp', '/evidence/email_3.webp', 8),
('Investor Withdrawal Letter', 'Official withdrawal notice from SCC Simpatrans', 'Letters', '/evidence/case_doc_10.webp', '/evidence/case_doc_10.webp', 9),
('Attorney Inquiry Letter', 'First formal legal inquiry to the bank', 'Letters', '/evidence/case_doc_11.webp', '/evidence/case_doc_11.webp', 10);

-- Videos
INSERT INTO videos (title, description, videoUrl, duration, displayOrder) VALUES 
('Case Summary (Short Version)', 'A brief overview of the SHHEER bank guarantee dispute case highlighting key events and failures.', 'https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/الفيديوالمختصرللقضية.mp4', '5:30', 1),
('Full Case Documentation', 'Comprehensive video documentation of the entire case including all evidence and timeline of events.', 'https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/فيديوالقضيةالنسخةالاخيرة.mp4', '15:45', 2);

-- Footer Content
INSERT INTO footer_content (companyName, companySubtitle, aboutText, quickLinks, contactAddress, contactPhone, contactWebsite, legalDisclaimer, commercialReg) VALUES 
('Nesma Barzan', 'Foundation', 'Nesma Barzan Foundation is the rightful owner of the SHHEER project and all associated intellectual property rights. This website documents our legal case against Al Rajhi Bank.', '[{"label":"Case Overview","href":"#overview"},{"label":"Timeline","href":"#timeline"},{"label":"Evidence Archive","href":"#evidence"},{"label":"Video Documentation","href":"#videos"}]', 'Riyadh, Kingdom of Saudi Arabia', '+966 XX XXX XXXX', 'www.nesmabarzan.com', 'This website is created for legal documentation purposes. All information presented is based on official documents and evidence submitted to the Banking Disputes Committee.', 'CR: XXXXXXXXXX');

-- Timeline Event Evidence Links
INSERT INTO timeline_event_evidence (eventId, evidenceId, displayOrder) VALUES 
(1, 1, 1),
(2, 1, 1),
(2, 2, 2),
(4, 2, 1),
(5, 3, 1),
(6, 4, 1),
(7, 4, 1),
(7, 6, 2),
(8, 5, 1);

-- =============================================
-- DONE! Database is ready with all updates.
-- =============================================
