-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 23, 2025 at 02:06 PM
-- Server version: 8.4.6-6
-- PHP Version: 8.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shheer-case-name`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_settings`
--

CREATE TABLE `admin_settings` (
  `id` int NOT NULL,
  `settingKey` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `settingValue` text COLLATE utf8mb4_general_ci,
  `settingType` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'text',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_settings`
--

INSERT INTO `admin_settings` (`id`, `settingKey`, `settingValue`, `settingType`, `createdAt`, `updatedAt`) VALUES
(1, 'admin_name', 'Dev Admin', 'text', '2025-12-22 17:03:21', '2025-12-22 17:26:04'),
(2, 'admin_email', 'dev@shheercase.com', 'text', '2025-12-22 17:15:09', '2025-12-22 17:15:09');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(320) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminRole` enum('super_admin','admin','editor','viewer') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'editor',
  `permissions` json DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `lastLogin` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`, `name`, `email`, `adminRole`, `permissions`, `isActive`, `lastLogin`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '$2b$10$Cf9EBOZPG2LZ5RYd4wNJFeRtwXLiPStW0Ot2EFukxWG1sOC/cgnMa', 'Administrator', 'admin@example.com', 'admin', NULL, 1, '2025-12-23 12:52:19', '2025-12-21 17:42:29', '2025-12-23 12:52:38');

-- --------------------------------------------------------

--
-- Table structure for table `case_elements`
--

CREATE TABLE `case_elements` (
  `id` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `items` json DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_structure`
--

CREATE TABLE `case_structure` (
  `id` int NOT NULL,
  `sectionNumber` int NOT NULL,
  `title` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evidence_categories`
--

CREATE TABLE `evidence_categories` (
  `id` int NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `label` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '#5d6d4e',
  `icon` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'FileText',
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evidence_categories`
--

INSERT INTO `evidence_categories` (`id`, `key`, `label`, `color`, `icon`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Licenses', 'Licenses', '#5D6B3D', 'FileCheck', 1, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(2, 'Emails', 'Emails', '#4A90A4', 'Mail', 2, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(3, 'SWIFT', 'SWIFT', '#D4A574', 'FileCode', 3, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(4, 'WhatsApp', 'WhatsApp', '#25D366', 'MessageCircle', 4, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(5, 'Letters', 'Letters', '#6B5B95', 'FileText', 5, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(6, 'Documents', 'Documents', '#808080', 'File', 6, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `evidence_items`
--

CREATE TABLE `evidence_items` (
  `id` int NOT NULL,
  `title` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `evidenceCategory` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `fileUrl` text COLLATE utf8mb4_general_ci,
  `fileName` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileType` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thumbnailUrl` text COLLATE utf8mb4_general_ci,
  `eventId` int DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evidence_items`
--

INSERT INTO `evidence_items` (`id`, `title`, `description`, `evidenceCategory`, `fileUrl`, `fileName`, `fileType`, `thumbnailUrl`, `eventId`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'SHHEER Project License', 'Official license document from 2005', 'Licenses', '/evidence/case_doc_01.webp', NULL, NULL, '/evidence/case_doc_01.webp', NULL, 1, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(2, 'RMA Activation Email', 'Email confirming RMA activation between banks', 'Emails', '/evidence/email_1.webp', NULL, NULL, '/evidence/email_1.webp', NULL, 2, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(3, 'RMA Active Confirmation', 'SWIFT confirmation of active RMA status', 'Emails', '/evidence/email_2.webp', NULL, NULL, '/evidence/email_2.webp', NULL, 3, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(4, 'MT 760 Bank Guarantee', 'Original SWIFT MT 760 message', 'SWIFT', '/evidence/case_doc_05.webp', NULL, NULL, '/evidence/case_doc_05.webp', NULL, 4, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(5, 'PKI AUTH FAILED Screenshot', 'Screenshot showing authentication failure', 'SWIFT', '/evidence/case_doc_06.webp', NULL, NULL, '/evidence/case_doc_06.webp', NULL, 5, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(6, 'WhatsApp Communication 1', 'WhatsApp messages with bank officials', 'WhatsApp', '/evidence/case_doc_07.webp', NULL, NULL, '/evidence/case_doc_07.webp', NULL, 6, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(7, 'WhatsApp Communication 2', 'Follow-up WhatsApp messages', 'WhatsApp', '/evidence/case_doc_08.webp', NULL, NULL, '/evidence/case_doc_08.webp', NULL, 7, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(8, 'Email Chain - Oct 14', 'Email correspondence dated October 14, 2013', 'Emails', '/evidence/email_3.webp', NULL, NULL, '/evidence/email_3.webp', NULL, 8, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(9, 'Investor Withdrawal Letter', 'Official withdrawal notice from SCC Simpatrans', 'Letters', '/evidence/case_doc_10.webp', NULL, NULL, '/evidence/case_doc_10.webp', NULL, 9, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(10, 'Attorney Inquiry Letter', 'First formal legal inquiry to the bank', 'Letters', '/evidence/case_doc_11.webp', NULL, NULL, '/evidence/case_doc_11.webp', NULL, 10, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `footer_content`
--

CREATE TABLE `footer_content` (
  `id` int NOT NULL,
  `companyName` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `companySubtitle` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `aboutText` text COLLATE utf8mb4_general_ci,
  `quickLinks` json DEFAULT NULL,
  `contactAddress` text COLLATE utf8mb4_general_ci,
  `contactPhone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contactWebsite` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legalDisclaimer` text COLLATE utf8mb4_general_ci,
  `commercialReg` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_content`
--

INSERT INTO `footer_content` (`id`, `companyName`, `companySubtitle`, `aboutText`, `quickLinks`, `contactAddress`, `contactPhone`, `contactWebsite`, `legalDisclaimer`, `commercialReg`, `createdAt`, `updatedAt`) VALUES
(1, 'Nesma Barzan', 'Foundation', 'Nesma Barzan Foundation is the rightful owner of the SHHEER project and all associated intellectual property rights. This website documents our legal case against Al Rajhi Bank.', '[{\"href\": \"#overview\", \"label\": \"Case Overview\"}, {\"href\": \"#timeline\", \"label\": \"Timeline\"}, {\"href\": \"#evidence\", \"label\": \"Evidence Archive\"}, {\"href\": \"#videos\", \"label\": \"Video Documentation\"}]', 'Riyadh, Kingdom of Saudi Arabia', '+966 XX XXX XXXX', 'www.nesmabarzan.com', 'This website is created for legal documentation purposes. All information presented is based on official documents and evidence submitted to the Banking Disputes Committee.', 'CR: XXXXXXXXXX', '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `header_content`
--

CREATE TABLE `header_content` (
  `id` int NOT NULL,
  `logoUrl` text COLLATE utf8mb4_general_ci,
  `siteName` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `siteSubtitle` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `navItems` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `header_content`
--

INSERT INTO `header_content` (`id`, `logoUrl`, `siteName`, `siteSubtitle`, `navItems`, `createdAt`, `updatedAt`) VALUES
(1, '/images/logo.png', 'SHHEER Case', 'Bank Guarantee Dispute', '[{\"href\": \"#overview\", \"label\": \"Overview\"}, {\"href\": \"#timeline\", \"label\": \"Timeline\"}, {\"href\": \"#evidence\", \"label\": \"Evidence\"}, {\"href\": \"#videos\", \"label\": \"Videos\"}, {\"href\": \"#contact\", \"label\": \"Contact\"}]', '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `hero_section`
--

CREATE TABLE `hero_section` (
  `id` int NOT NULL,
  `title` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `titleHighlight` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subtitle` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `guaranteeRef` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dealValue` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `criticalPeriod` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ctaText` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ctaLink` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_section`
--

INSERT INTO `hero_section` (`id`, `title`, `titleHighlight`, `subtitle`, `description`, `guaranteeRef`, `dealValue`, `criticalPeriod`, `ctaText`, `ctaLink`, `createdAt`, `updatedAt`) VALUES
(1, 'Bank Guarantee', 'Dispute Case', 'SHHEER (شهير) Project', 'A comprehensive documentation of how Al Rajhi Bank\'s operational failures and communication breakdowns led to the collapse of a €120 million investment deal for the SHHEER mobile advertising platform.', 'JVA-PTVL-FIACL-TBTSCGL-25072013', '€120M', 'Oct - Nov 2013', 'View Timeline', '#timeline', '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `overview_parties`
--

CREATE TABLE `overview_parties` (
  `id` int NOT NULL,
  `partyType` enum('plaintiff','defendant','third_party') COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `representative` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `additionalInfo` text COLLATE utf8mb4_general_ci,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `overview_parties`
--

INSERT INTO `overview_parties` (`id`, `partyType`, `name`, `label`, `representative`, `role`, `additionalInfo`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
(1, 'plaintiff', 'Nesma Barzan Foundation', 'THE PLAINTIFF', 'Abdulaziz Al-Amoudi', 'Project Owner & Rights Holder', NULL, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(2, 'defendant', 'Al Rajhi Bank', 'THE DEFENDANT', NULL, 'Receiving Bank (MT 760)', NULL, 2, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(3, 'third_party', 'DAMA Investment Group', 'INTERNATIONAL PARTIES', NULL, 'Investment Facilitator', NULL, 3, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(4, 'third_party', 'UNICOMBANK (Moldova)', 'INTERNATIONAL PARTIES', NULL, 'Bank Guarantee Issuer', NULL, 4, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(5, 'third_party', 'SCC Simpatrans', 'INTERNATIONAL PARTIES', NULL, 'Investment Company', NULL, 5, '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `site_access_users`
--

CREATE TABLE `site_access_users` (
  `id` int NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_access_users`
--

INSERT INTO `site_access_users` (`id`, `username`, `password`, `name`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Diaa', '$2b$10$O/ocuRAAELdXZMIcaB1jM.M/gm.1TS39Y6ksNraG5t9D2zxMkBRbi', 'DIAA ABDALLA', 1, '2025-12-22 11:21:01', '2025-12-22 11:22:21');

-- --------------------------------------------------------

--
-- Table structure for table `site_protection`
--

CREATE TABLE `site_protection` (
  `id` int NOT NULL,
  `isEnabled` tinyint(1) DEFAULT '0',
  `message` text COLLATE utf8mb4_general_ci,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_protection`
--

INSERT INTO `site_protection` (`id`, `isEnabled`, `message`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'This site is protected. Please login to continue.', '2025-12-21 17:42:29', '2025-12-22 10:21:56');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `value` text COLLATE utf8mb4_general_ci,
  `type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'text',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timeline_categories`
--

CREATE TABLE `timeline_categories` (
  `id` int NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `label` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '#5d6d4e',
  `bgColor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '#f5f2eb',
  `textColor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '#3d3d3d',
  `lightColor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '#5d6d4e1a',
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timeline_categories`
--

INSERT INTO `timeline_categories` (`id`, `key`, `label`, `color`, `bgColor`, `textColor`, `lightColor`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Foundation', 'Foundation', '#5D6B3D', '#f5f2eb', '#3d3d3d', '#5d6b3d1a', 1, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(2, 'Investment Deal', 'Investment Deal', '#D4A574', '#faf8f3', '#3d3d3d', '#D4A5741a', 2, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(3, 'SWIFT Operations', 'SWIFT Operations', '#4A90A4', '#eff6ff', '#1e3a5f', '#4A90A41a', 3, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(4, 'Critical Failure', 'Critical Failure', '#C75050', '#fef2f2', '#450a0a', '#C750501a', 4, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(5, 'Legal Proceedings', 'Legal Proceedings', '#6B5B95', '#faf5ff', '#3b0764', '#6B5B951a', 5, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `timeline_events`
--

CREATE TABLE `timeline_events` (
  `id` int NOT NULL,
  `date` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `time` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `category` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `customColor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customBgColor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customTextColor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timeline_events`
--

INSERT INTO `timeline_events` (`id`, `date`, `time`, `title`, `description`, `category`, `customColor`, `customBgColor`, `customTextColor`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, '2005-03-15', NULL, 'SHHEER Project Founded', 'Nesma Barzan Foundation establishes SHHEER mobile advertising platform project.', 'Foundation', NULL, NULL, NULL, 1, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(2, '2013-07-25', NULL, 'Investment Deal Initiated', 'DAMA Investment Group begins negotiations for €120M investment in SHHEER project.', 'Foundation', NULL, NULL, NULL, 2, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(3, '2013-10-07', NULL, 'Bank Guarantee Requirement Set', 'DAMA requires bank guarantee as condition for investment execution.', 'Investment Deal', NULL, NULL, NULL, 3, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(4, '2013-10-14', '10:30:00', 'RMA Activation Request Sent', 'Al Rajhi Bank initiates RMA (Relationship Management Application) activation with UNICOMBANK.', 'SWIFT Operations', NULL, NULL, NULL, 4, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(5, '2013-10-15', '09:15:00', 'RMA Confirmation Received', 'UNICOMBANK confirms RMA activation - SWIFT channel now open between banks.', 'SWIFT Operations', NULL, NULL, NULL, 5, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(6, '2013-10-17', NULL, 'MT 760 Guarantee Issued', 'UNICOMBANK issues MT 760 bank guarantee for €300M (Ref: JVA-PTVL-FIACL-TBTSCGL-25072013).', 'SWIFT Operations', NULL, NULL, NULL, 6, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(7, '2013-10-21', NULL, 'Guarantee Copy Received at Branch', 'Faisal Al-Rawdan receives copy of guarantee at Al Rajhi Bank branch. Witnesses: Youssef Athnian, Hamoud Al-Issa.', 'SWIFT Operations', NULL, NULL, NULL, 7, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(8, '2013-10-28', '14:22:00', 'PKI AUTH FAILED Error', 'Critical SWIFT authentication failure - MT 760 cannot be verified. Bank fails to resolve issue.', 'Critical Failure', NULL, NULL, NULL, 8, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(9, '2013-10-29', NULL, 'Address Error Discovered', 'Repeated error in postal address: \"kapran\" instead of \"katran\" - indicating systemic issues.', 'Critical Failure', NULL, NULL, NULL, 9, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(10, '2013-11-04', NULL, 'Communication Breakdown', 'Multiple failed attempts to reach bank officials. No response to urgent inquiries.', 'Critical Failure', NULL, NULL, NULL, 10, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(11, '2013-11-12', '16:45:00', 'Investor Withdrawal Notice', 'SCC Simpatrans officially withdraws from investment deal due to bank guarantee failure.', 'Critical Failure', NULL, NULL, NULL, 11, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(12, '2014-02-15', NULL, 'Legal Counsel Engaged', 'Attorney sends first formal inquiry letter to Al Rajhi Bank regarding the failed guarantee.', 'Legal Proceedings', NULL, NULL, NULL, 12, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(13, '2014-03-20', NULL, 'Bank Official Response', 'Al Rajhi Bank responds with denial and contradictions to documented evidence.', 'Legal Proceedings', NULL, NULL, NULL, 13, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(14, '2014-06-01', NULL, 'Case Filed with Banking Disputes Committee', 'Formal lawsuit filed with Banking Disputes Committee in Riyadh.', 'Legal Proceedings', NULL, NULL, NULL, 14, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(15, '2014-07-15', NULL, 'Committee Notification Issued', 'Banking Disputes Committee issues notification to Al Rajhi Bank.', 'Legal Proceedings', NULL, NULL, NULL, 15, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(16, '2014-09-10', NULL, 'Bank Defense Submitted', 'Al Rajhi Bank lawyer submits defense memorandum with continued denials.', 'Legal Proceedings', NULL, NULL, NULL, 16, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(17, '2014-11-20', NULL, 'Plaintiff Rebuttal Filed', 'Comprehensive rebuttal filed with additional evidence and international banking standards citations.', 'Legal Proceedings', NULL, NULL, NULL, 17, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `timeline_event_evidence`
--

CREATE TABLE `timeline_event_evidence` (
  `id` int NOT NULL,
  `eventId` int NOT NULL,
  `evidenceId` int NOT NULL,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timeline_event_evidence`
--

INSERT INTO `timeline_event_evidence` (`id`, `eventId`, `evidenceId`, `displayOrder`, `createdAt`) VALUES
(1, 1, 1, 1, '2025-12-21 17:42:29'),
(2, 2, 1, 1, '2025-12-21 17:42:29'),
(3, 2, 2, 2, '2025-12-21 17:42:29'),
(4, 4, 2, 1, '2025-12-21 17:42:29'),
(5, 5, 3, 1, '2025-12-21 17:42:29'),
(6, 6, 4, 1, '2025-12-21 17:42:29'),
(7, 7, 4, 1, '2025-12-21 17:42:29'),
(8, 7, 6, 2, '2025-12-21 17:42:29'),
(9, 8, 5, 1, '2025-12-21 17:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `openId` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `name` text COLLATE utf8mb4_general_ci,
  `email` varchar(320) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `loginMethod` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int NOT NULL,
  `title` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `videoUrl` text COLLATE utf8mb4_general_ci NOT NULL,
  `thumbnailUrl` text COLLATE utf8mb4_general_ci,
  `duration` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `videoUrl`, `thumbnailUrl`, `duration`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Case Summary (Short Version)', 'A brief overview of the SHHEER bank guarantee dispute case highlighting key events and failures.', 'https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/الفيديوالمختصرللقضية.mp4', NULL, '5:30', 1, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29'),
(2, 'Full Case Documentation', 'Comprehensive video documentation of the entire case including all evidence and timeline of events.', 'https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/فيديوالقضيةالنسخةالاخيرة.mp4', NULL, '15:45', 2, 1, '2025-12-21 17:42:29', '2025-12-21 17:42:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_settings`
--
ALTER TABLE `admin_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settingKey` (`settingKey`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_users_username_unique` (`username`);

--
-- Indexes for table `case_elements`
--
ALTER TABLE `case_elements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_structure`
--
ALTER TABLE `case_structure`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `evidence_categories`
--
ALTER TABLE `evidence_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `evidence_categories_key_unique` (`key`);

--
-- Indexes for table `evidence_items`
--
ALTER TABLE `evidence_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_content`
--
ALTER TABLE `footer_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `header_content`
--
ALTER TABLE `header_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero_section`
--
ALTER TABLE `hero_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `overview_parties`
--
ALTER TABLE `overview_parties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_access_users`
--
ALTER TABLE `site_access_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_access_users_username_unique` (`username`);

--
-- Indexes for table `site_protection`
--
ALTER TABLE `site_protection`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_key_unique` (`key`);

--
-- Indexes for table `timeline_categories`
--
ALTER TABLE `timeline_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `timeline_categories_key_unique` (`key`);

--
-- Indexes for table `timeline_events`
--
ALTER TABLE `timeline_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timeline_event_evidence`
--
ALTER TABLE `timeline_event_evidence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_openId_unique` (`openId`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_settings`
--
ALTER TABLE `admin_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `case_elements`
--
ALTER TABLE `case_elements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_structure`
--
ALTER TABLE `case_structure`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evidence_categories`
--
ALTER TABLE `evidence_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `evidence_items`
--
ALTER TABLE `evidence_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `footer_content`
--
ALTER TABLE `footer_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `header_content`
--
ALTER TABLE `header_content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hero_section`
--
ALTER TABLE `hero_section`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `overview_parties`
--
ALTER TABLE `overview_parties`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `site_access_users`
--
ALTER TABLE `site_access_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `site_protection`
--
ALTER TABLE `site_protection`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `timeline_categories`
--
ALTER TABLE `timeline_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `timeline_events`
--
ALTER TABLE `timeline_events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `timeline_event_evidence`
--
ALTER TABLE `timeline_event_evidence`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
