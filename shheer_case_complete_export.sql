-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: shheer_case
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `case_elements`
--

DROP TABLE IF EXISTS `case_elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case_elements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `items` json DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_elements`
--

LOCK TABLES `case_elements` WRITE;
/*!40000 ALTER TABLE `case_elements` DISABLE KEYS */;
/*!40000 ALTER TABLE `case_elements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_structure`
--

DROP TABLE IF EXISTS `case_structure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `case_structure` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sectionNumber` int NOT NULL,
  `title` varchar(300) NOT NULL,
  `description` text,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_structure`
--

LOCK TABLES `case_structure` WRITE;
/*!40000 ALTER TABLE `case_structure` DISABLE KEYS */;
/*!40000 ALTER TABLE `case_structure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidence_categories`
--

DROP TABLE IF EXISTS `evidence_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidence_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `label` varchar(200) NOT NULL,
  `color` varchar(50) DEFAULT '#5d6d4e',
  `icon` varchar(50) DEFAULT 'FileText',
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `evidence_categories_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidence_categories`
--

LOCK TABLES `evidence_categories` WRITE;
/*!40000 ALTER TABLE `evidence_categories` DISABLE KEYS */;
INSERT INTO `evidence_categories` VALUES (1,'Licenses','Licenses','#5D6B3D','FileCheck',1,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(2,'Emails','Emails','#4A90A4','Mail',2,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(3,'SWIFT','SWIFT','#D4A574','FileCode',3,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(4,'WhatsApp','WhatsApp','#25D366','MessageCircle',4,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(5,'Letters','Letters','#6B5B95','FileText',5,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(6,'Documents','Documents','#808080','File',6,1,'2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `evidence_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidence_items`
--

DROP TABLE IF EXISTS `evidence_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidence_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL,
  `description` text,
  `evidenceCategory` varchar(100) NOT NULL,
  `fileUrl` text,
  `fileName` varchar(300) DEFAULT NULL,
  `fileType` varchar(50) DEFAULT NULL,
  `thumbnailUrl` text,
  `eventId` int DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidence_items`
--

LOCK TABLES `evidence_items` WRITE;
/*!40000 ALTER TABLE `evidence_items` DISABLE KEYS */;
INSERT INTO `evidence_items` VALUES (1,'SHHEER Project License','Official license document from 2005','Licenses','/evidence/case_doc_01.webp',NULL,NULL,'/evidence/case_doc_01.webp',NULL,1,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(2,'RMA Activation Email','Email confirming RMA activation between banks','Emails','/evidence/email_1.webp',NULL,NULL,'/evidence/email_1.webp',NULL,2,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(3,'RMA Active Confirmation','SWIFT confirmation of active RMA status','Emails','/evidence/email_2.webp',NULL,NULL,'/evidence/email_2.webp',NULL,3,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(4,'MT 760 Bank Guarantee','Original SWIFT MT 760 message','SWIFT','/evidence/case_doc_05.webp',NULL,NULL,'/evidence/case_doc_05.webp',NULL,4,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(5,'PKI AUTH FAILED Screenshot','Screenshot showing authentication failure','SWIFT','/evidence/case_doc_06.webp',NULL,NULL,'/evidence/case_doc_06.webp',NULL,5,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(6,'WhatsApp Communication 1','WhatsApp messages with bank officials','WhatsApp','/evidence/case_doc_07.webp',NULL,NULL,'/evidence/case_doc_07.webp',NULL,6,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(7,'WhatsApp Communication 2','Follow-up WhatsApp messages','WhatsApp','/evidence/case_doc_08.webp',NULL,NULL,'/evidence/case_doc_08.webp',NULL,7,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(8,'Email Chain - Oct 14','Email correspondence dated October 14, 2013','Emails','/evidence/email_3.webp',NULL,NULL,'/evidence/email_3.webp',NULL,8,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(9,'Investor Withdrawal Letter','Official withdrawal notice from SCC Simpatrans','Letters','/evidence/case_doc_10.webp',NULL,NULL,'/evidence/case_doc_10.webp',NULL,9,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(10,'Attorney Inquiry Letter','First formal legal inquiry to the bank','Letters','/evidence/case_doc_11.webp',NULL,NULL,'/evidence/case_doc_11.webp',NULL,10,1,'2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `evidence_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_content`
--

DROP TABLE IF EXISTS `footer_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(200) DEFAULT NULL,
  `companySubtitle` varchar(300) DEFAULT NULL,
  `aboutText` text,
  `quickLinks` json DEFAULT NULL,
  `contactAddress` text,
  `contactPhone` varchar(50) DEFAULT NULL,
  `contactWebsite` varchar(200) DEFAULT NULL,
  `legalDisclaimer` text,
  `commercialReg` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_content`
--

LOCK TABLES `footer_content` WRITE;
/*!40000 ALTER TABLE `footer_content` DISABLE KEYS */;
INSERT INTO `footer_content` VALUES (1,'Nesma Barzan','Foundation','Nesma Barzan Foundation is the rightful owner of the SHHEER project and all associated intellectual property rights. This website documents our legal case against Al Rajhi Bank.','[{\"href\": \"#overview\", \"label\": \"Case Overview\"}, {\"href\": \"#timeline\", \"label\": \"Timeline\"}, {\"href\": \"#evidence\", \"label\": \"Evidence Archive\"}, {\"href\": \"#videos\", \"label\": \"Video Documentation\"}]','Riyadh, Kingdom of Saudi Arabia','+966 XX XXX XXXX','www.nesmabarzan.com','This website is created for legal documentation purposes. All information presented is based on official documents and evidence submitted to the Banking Disputes Committee.','CR: XXXXXXXXXX','2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `footer_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `header_content`
--

DROP TABLE IF EXISTS `header_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `header_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logoUrl` text,
  `siteName` varchar(200) DEFAULT NULL,
  `siteSubtitle` varchar(300) DEFAULT NULL,
  `navItems` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `header_content`
--

LOCK TABLES `header_content` WRITE;
/*!40000 ALTER TABLE `header_content` DISABLE KEYS */;
INSERT INTO `header_content` VALUES (1,'/images/logo.png','SHHEER Case','Bank Guarantee Dispute','[{\"href\": \"#overview\", \"label\": \"Overview\"}, {\"href\": \"#timeline\", \"label\": \"Timeline\"}, {\"href\": \"#evidence\", \"label\": \"Evidence\"}, {\"href\": \"#videos\", \"label\": \"Videos\"}, {\"href\": \"#contact\", \"label\": \"Contact\"}]','2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `header_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero_section`
--

DROP TABLE IF EXISTS `hero_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `titleHighlight` varchar(200) DEFAULT NULL,
  `subtitle` varchar(300) DEFAULT NULL,
  `description` text,
  `guaranteeRef` varchar(100) DEFAULT NULL,
  `dealValue` varchar(50) DEFAULT NULL,
  `criticalPeriod` varchar(100) DEFAULT NULL,
  `ctaText` varchar(100) DEFAULT NULL,
  `ctaLink` varchar(200) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero_section`
--

LOCK TABLES `hero_section` WRITE;
/*!40000 ALTER TABLE `hero_section` DISABLE KEYS */;
INSERT INTO `hero_section` VALUES (1,'Bank Guarantee','Dispute Case','SHHEER (شهير) Project','A comprehensive documentation of how Al Rajhi Bank\'s operational failures and communication breakdowns led to the collapse of a €120 million investment deal for the SHHEER mobile advertising platform.','JVA-PTVL-FIACL-TBTSCGL-25072013','€120M','Oct - Nov 2013','View Timeline','#timeline','2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `hero_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `overview_parties`
--

DROP TABLE IF EXISTS `overview_parties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `overview_parties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partyType` enum('plaintiff','defendant','third_party') NOT NULL,
  `name` varchar(300) NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `representative` varchar(200) DEFAULT NULL,
  `role` varchar(300) DEFAULT NULL,
  `additionalInfo` text,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `overview_parties`
--

LOCK TABLES `overview_parties` WRITE;
/*!40000 ALTER TABLE `overview_parties` DISABLE KEYS */;
INSERT INTO `overview_parties` VALUES (1,'plaintiff','Nesma Barzan Foundation','THE PLAINTIFF','Abdulaziz Al-Amoudi','Project Owner & Rights Holder',NULL,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(2,'defendant','Al Rajhi Bank','THE DEFENDANT',NULL,'Receiving Bank (MT 760)',NULL,2,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(3,'third_party','DAMA Investment Group','INTERNATIONAL PARTIES',NULL,'Investment Facilitator',NULL,3,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(4,'third_party','UNICOMBANK (Moldova)','INTERNATIONAL PARTIES',NULL,'Bank Guarantee Issuer',NULL,4,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(5,'third_party','SCC Simpatrans','INTERNATIONAL PARTIES',NULL,'Investment Company',NULL,5,'2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `overview_parties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text,
  `type` varchar(50) NOT NULL DEFAULT 'text',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline_categories`
--

DROP TABLE IF EXISTS `timeline_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `label` varchar(200) NOT NULL,
  `color` varchar(50) DEFAULT '#5d6d4e',
  `bgColor` varchar(50) DEFAULT 'bg-[#5d6d4e]',
  `textColor` varchar(50) DEFAULT 'text-[#5d6d4e]',
  `lightColor` varchar(50) DEFAULT 'bg-[#5d6d4e]/10',
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `timeline_categories_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_categories`
--

LOCK TABLES `timeline_categories` WRITE;
/*!40000 ALTER TABLE `timeline_categories` DISABLE KEYS */;
INSERT INTO `timeline_categories` VALUES (1,'Foundation','Foundation','#5D6B3D','#f5f2eb','#3d3d3d','#5d6b3d1a',1,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(2,'Investment Deal','Investment Deal','#D4A574','bg-[#D4A574]','text-[#D4A574]','bg-[#D4A574]/10',2,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(3,'SWIFT Operations','SWIFT Operations','#4A90A4','bg-[#4A90A4]','text-[#4A90A4]','bg-[#4A90A4]/10',3,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(4,'Critical Failure','Critical Failure','#C75050','bg-[#C75050]','text-[#C75050]','bg-[#C75050]/10',4,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(5,'Legal Proceedings','Legal Proceedings','#6B5B95','bg-[#6B5B95]','text-[#6B5B95]','bg-[#6B5B95]/10',5,1,'2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `timeline_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline_event_evidence`
--

DROP TABLE IF EXISTS `timeline_event_evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_event_evidence` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventId` int NOT NULL,
  `evidenceId` int NOT NULL,
  `displayOrder` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_event_evidence`
--

LOCK TABLES `timeline_event_evidence` WRITE;
/*!40000 ALTER TABLE `timeline_event_evidence` DISABLE KEYS */;
INSERT INTO `timeline_event_evidence` VALUES (1,1,1,1,'2025-12-21 11:06:15'),(2,2,1,1,'2025-12-21 11:06:15'),(3,2,2,2,'2025-12-21 11:06:15'),(4,4,2,1,'2025-12-21 11:06:15'),(5,5,3,1,'2025-12-21 11:06:15'),(6,6,4,1,'2025-12-21 11:06:15'),(7,7,4,1,'2025-12-21 11:06:15'),(8,7,6,2,'2025-12-21 11:06:15'),(9,8,5,1,'2025-12-21 11:06:15');
/*!40000 ALTER TABLE `timeline_event_evidence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline_events`
--

DROP TABLE IF EXISTS `timeline_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` varchar(50) NOT NULL,
  `time` varchar(20) DEFAULT NULL,
  `title` varchar(300) NOT NULL,
  `description` text,
  `category` varchar(100) NOT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `customColor` varchar(50) DEFAULT NULL,
  `customBgColor` varchar(50) DEFAULT NULL,
  `customTextColor` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_events`
--

LOCK TABLES `timeline_events` WRITE;
/*!40000 ALTER TABLE `timeline_events` DISABLE KEYS */;
INSERT INTO `timeline_events` VALUES (1,'2005-01-01',NULL,'SHHEER Project Licensed','Official license granted for SHHEER (شهير) project - a major real estate development initiative in Saudi Arabia.','Foundation',1,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(2,'2013-07-25',NULL,'Investment Deal Initiated','DAMA Investment Group begins negotiations for €120M investment in SHHEER project.','Foundation',2,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(3,'2013-10-07',NULL,'Bank Guarantee Requirement Set','DAMA requires bank guarantee as condition for investment execution.','Investment Deal',3,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(4,'2013-10-14','10:30:00','RMA Activation Request Sent','Al Rajhi Bank initiates RMA (Relationship Management Application) activation with UNICOMBANK.','SWIFT Operations',4,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(5,'2013-10-15','09:15:00','RMA Confirmation Received','UNICOMBANK confirms RMA activation - SWIFT channel now open between banks.','SWIFT Operations',5,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(6,'2013-10-17',NULL,'MT 760 Guarantee Issued','UNICOMBANK issues MT 760 bank guarantee for €300M (Ref: JVA-PTVL-FIACL-TBTSCGL-25072013).','SWIFT Operations',6,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(7,'2013-10-21',NULL,'Guarantee Copy Received at Branch','Faisal Al-Rawdan receives copy of guarantee at Al Rajhi Bank branch. Witnesses: Youssef Athnian, Hamoud Al-Issa.','SWIFT Operations',7,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(8,'2013-10-28','14:22:00','PKI AUTH FAILED Error','Critical SWIFT authentication failure - MT 760 cannot be verified. Bank fails to resolve issue.','Critical Failure',8,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(9,'2013-10-29',NULL,'Address Error Discovered','Repeated error in postal address: \"kapran\" instead of \"katran\" - indicating systemic issues.','Critical Failure',9,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(10,'2013-11-04',NULL,'Communication Breakdown','Multiple failed attempts to reach bank officials. No response to urgent inquiries.','Critical Failure',10,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(11,'2013-11-12','16:45:00','Investor Withdrawal Notice','SCC Simpatrans officially withdraws from investment deal due to bank guarantee failure.','Critical Failure',11,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(12,'2014-02-15',NULL,'Legal Counsel Engaged','Attorney sends first formal inquiry letter to Al Rajhi Bank regarding the failed guarantee.','Legal Proceedings',12,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(13,'2014-03-20',NULL,'Bank Official Response','Al Rajhi Bank responds with denial and contradictions to documented evidence.','Legal Proceedings',13,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(14,'2014-06-01',NULL,'Case Filed with Banking Disputes Committee','Formal lawsuit filed with Banking Disputes Committee in Riyadh.','Legal Proceedings',14,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(15,'2014-07-15',NULL,'Committee Notification Issued','Banking Disputes Committee issues notification to Al Rajhi Bank.','Legal Proceedings',15,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(16,'2014-09-10',NULL,'Bank Defense Submitted','Al Rajhi Bank lawyer submits defense memorandum with continued denials.','Legal Proceedings',16,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL),(17,'2014-11-20',NULL,'Plaintiff Rebuttal Filed','Comprehensive rebuttal filed with additional evidence and international banking standards citations.','Legal Proceedings',17,1,'2025-12-21 11:06:15','2025-12-21 11:06:15',NULL,NULL,NULL);
/*!40000 ALTER TABLE `timeline_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320) DEFAULT NULL,
  `loginMethod` varchar(64) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL,
  `description` text,
  `videoUrl` text NOT NULL,
  `thumbnailUrl` text,
  `duration` varchar(50) DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'Case Summary (Short Version)','A brief overview of the SHHEER bank guarantee dispute case highlighting key events and failures.','https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/الفيديوالمختصرللقضية.mp4',NULL,'5:30',1,1,'2025-12-21 11:06:15','2025-12-21 11:06:15'),(2,'Full Case Documentation','Comprehensive video documentation of the entire case including all evidence and timeline of events.','https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/فيديوالقضيةالنسخةالاخيرة.mp4',NULL,'15:45',2,1,'2025-12-21 11:06:15','2025-12-21 11:06:15');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-21  7:17:01
