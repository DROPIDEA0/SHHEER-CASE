-- SHHEER Case Database Seed Data
-- Generated: 2024-12-20
-- This file contains the initial data for the SHHEER Case website

-- =============================================
-- Header Content
-- =============================================
INSERT INTO header_content (logoUrl, siteName, siteSubtitle, navItems) VALUES 
('/images/logo.png', 'SHHEER Case', 'Bank Guarantee Dispute', '[{"label":"Overview","href":"#overview"},{"label":"Timeline","href":"#timeline"},{"label":"Evidence","href":"#evidence"},{"label":"Videos","href":"#videos"},{"label":"Contact","href":"#contact"}]');

-- =============================================
-- Hero Section
-- =============================================
INSERT INTO hero_section (title, titleHighlight, subtitle, description, guaranteeRef, dealValue, criticalPeriod, ctaText, ctaLink) VALUES 
('Bank Guarantee', 'Dispute Case', 'SHHEER (شهير) Project', 'A comprehensive documentation of how Al Rajhi Bank''s operational failures and communication breakdowns led to the collapse of a €120 million investment deal for the SHHEER mobile advertising platform.', 'JVA-PTVL-FIACL-TBTSCGL-25072013', '€120M', 'Oct - Nov 2013', 'View Timeline', '#timeline');

-- =============================================
-- Overview Parties
-- =============================================
INSERT INTO overview_parties (partyType, name, label, representative, role, displayOrder) VALUES 
('plaintiff', 'Nesma Barzan Foundation', 'THE PLAINTIFF', 'Abdulaziz Al-Amoudi', 'Project Owner & Rights Holder', 1),
('defendant', 'Al Rajhi Bank', 'THE DEFENDANT', NULL, 'Receiving Bank (MT 760)', 2),
('third_party', 'DAMA Investment Group', 'INTERNATIONAL PARTIES', NULL, 'Investment Facilitator', 3),
('third_party', 'UNICOMBANK (Moldova)', 'INTERNATIONAL PARTIES', NULL, 'Bank Guarantee Issuer', 4),
('third_party', 'SCC Simpatrans', 'INTERNATIONAL PARTIES', NULL, 'Investment Company', 5);

-- =============================================
-- Timeline Categories
-- =============================================
INSERT INTO timeline_categories (`key`, label, color, bgColor, textColor, lightColor, displayOrder) VALUES 
('foundation', 'Foundation', '#5D6B3D', 'bg-[#5D6B3D]', 'text-[#5D6B3D]', 'bg-[#5D6B3D]/10', 1),
('investment-deal', 'Investment Deal', '#D4A574', 'bg-[#D4A574]', 'text-[#D4A574]', 'bg-[#D4A574]/10', 2),
('swift-operations', 'SWIFT Operations', '#4A90A4', 'bg-[#4A90A4]', 'text-[#4A90A4]', 'bg-[#4A90A4]/10', 3),
('critical-failure', 'Critical Failure', '#C75050', 'bg-[#C75050]', 'text-[#C75050]', 'bg-[#C75050]/10', 4),
('legal-proceedings', 'Legal Proceedings', '#6B5B95', 'bg-[#6B5B95]', 'text-[#6B5B95]', 'bg-[#6B5B95]/10', 5);

-- =============================================
-- Evidence Categories
-- =============================================
INSERT INTO evidence_categories (`key`, label, color, icon, displayOrder) VALUES 
('licenses', 'Licenses', '#5D6B3D', 'FileCheck', 1),
('emails', 'Emails', '#4A90A4', 'Mail', 2),
('swift', 'SWIFT', '#D4A574', 'FileCode', 3),
('whatsapp', 'WhatsApp', '#25D366', 'MessageCircle', 4),
('letters', 'Letters', '#6B5B95', 'FileText', 5),
('documents', 'Documents', '#808080', 'File', 6);

-- =============================================
-- Timeline Events
-- =============================================
INSERT INTO timeline_events (eventDate, eventTime, title, description, category, tags, displayOrder) VALUES 
('2005-01-01', NULL, 'SHHEER Project Licensed', 'Official license granted for SHHEER (شهير) project - a major real estate development initiative in Saudi Arabia.', 'foundation', '["Project Start","Official License"]', 1),
('2013-07-25', NULL, 'Investment Deal Initiated', 'DAMA Investment Group begins negotiations for €120M investment in SHHEER project.', 'foundation', '["Investment","DAMA"]', 2),
('2013-10-07', NULL, 'Bank Guarantee Requirement Set', 'DAMA requires bank guarantee as condition for investment execution.', 'investment-deal', '["Bank Guarantee","Requirement"]', 3),
('2013-10-14', '10:30:00', 'RMA Activation Request Sent', 'Al Rajhi Bank initiates RMA (Relationship Management Application) activation with UNICOMBANK.', 'swift-operations', '["RMA","SWIFT"]', 4),
('2013-10-15', '09:15:00', 'RMA Confirmation Received', 'UNICOMBANK confirms RMA activation - SWIFT channel now open between banks.', 'swift-operations', '["RMA Active","Confirmation"]', 5),
('2013-10-17', NULL, 'MT 760 Guarantee Issued', 'UNICOMBANK issues MT 760 bank guarantee for €300M (Ref: JVA-PTVL-FIACL-TBTSCGL-25072013).', 'swift-operations', '["MT 760","€300M"]', 6),
('2013-10-21', NULL, 'Guarantee Copy Received at Branch', 'Faisal Al-Rawdan receives copy of guarantee at Al Rajhi Bank branch. Witnesses: Youssef Athnian, Hamoud Al-Issa.', 'swift-operations', '["Branch Receipt","Witnesses"]', 7),
('2013-10-22', '14:00:00', 'PKI Authentication Failure', 'Critical error: PKI AUTH FAILED message appears when attempting to process the guarantee through SWIFT.', 'critical-failure', '["PKI Error","Authentication Failed"]', 8),
('2013-10-23', NULL, 'Email Address Error Discovered', 'Bank uses wrong email address (kapran instead of katran) causing communication failures.', 'critical-failure', '["Email Error","Communication Failure"]', 9),
('2013-10-24', NULL, 'Multiple Contact Attempts Failed', 'Repeated attempts to reach bank officials fail. WhatsApp messages and calls go unanswered.', 'critical-failure', '["No Response","Contact Failed"]', 10),
('2013-10-28', NULL, 'Escalation to Bank Management', 'Formal complaint escalated to Al Rajhi Bank management regarding guarantee processing delays.', 'critical-failure', '["Escalation","Management"]', 11),
('2013-11-03', NULL, 'Investor Deadline Warning', 'SCC Simpatrans issues final warning: guarantee must be confirmed within 7 days or deal collapses.', 'critical-failure', '["Deadline","Final Warning"]', 12),
('2013-11-10', NULL, 'Investment Deal Collapsed', 'SCC Simpatrans officially withdraws from the €120M investment deal due to bank''s failure to process guarantee.', 'critical-failure', '["Deal Lost","Withdrawal"]', 13),
('2014-02-15', NULL, 'Attorney Inquiry Sent', 'First formal legal inquiry sent to Al Rajhi Bank demanding explanation for guarantee processing failure.', 'legal-proceedings', '["Legal Action","Inquiry"]', 14),
('2014-03-20', NULL, 'Bank Response Received', 'Al Rajhi Bank responds denying responsibility, claiming technical issues beyond their control.', 'legal-proceedings', '["Bank Response","Denial"]', 15),
('2014-05-10', NULL, 'Case Filed with Banking Disputes Committee', 'Formal lawsuit filed with the Banking Disputes Committee in Riyadh.', 'legal-proceedings', '["Lawsuit Filed","Committee"]', 16),
('2014-06-15', NULL, 'Initial Hearing Scheduled', 'Banking Disputes Committee schedules first hearing for the case.', 'legal-proceedings', '["Hearing","Court Date"]', 17);

-- =============================================
-- Evidence Items
-- =============================================
INSERT INTO evidence_items (title, description, category, fileUrl, thumbnailUrl, displayOrder) VALUES 
('SHHEER Project License', 'Official license document from 2005', 'licenses', '/evidence/case_doc_01.webp', '/evidence/case_doc_01.webp', 1),
('RMA Activation Email', 'Email confirming RMA activation between banks', 'emails', '/evidence/email_1.webp', '/evidence/email_1.webp', 2),
('RMA Active Confirmation', 'SWIFT confirmation of active RMA status', 'emails', '/evidence/email_2.webp', '/evidence/email_2.webp', 3),
('MT 760 Bank Guarantee', 'Original SWIFT MT 760 message', 'swift', '/evidence/case_doc_05.webp', '/evidence/case_doc_05.webp', 4),
('PKI AUTH FAILED Screenshot', 'Screenshot showing authentication failure', 'swift', '/evidence/case_doc_06.webp', '/evidence/case_doc_06.webp', 5),
('WhatsApp Communication 1', 'WhatsApp messages with bank officials', 'whatsapp', '/evidence/case_doc_07.webp', '/evidence/case_doc_07.webp', 6),
('WhatsApp Communication 2', 'Follow-up WhatsApp messages', 'whatsapp', '/evidence/case_doc_08.webp', '/evidence/case_doc_08.webp', 7),
('Email Chain - Oct 14', 'Email correspondence dated October 14, 2013', 'emails', '/evidence/email_3.webp', '/evidence/email_3.webp', 8),
('Investor Withdrawal Letter', 'Official withdrawal notice from SCC Simpatrans', 'letters', '/evidence/case_doc_10.webp', '/evidence/case_doc_10.webp', 9),
('Attorney Inquiry Letter', 'First formal legal inquiry to the bank', 'letters', '/evidence/case_doc_11.webp', '/evidence/case_doc_11.webp', 10);

-- =============================================
-- Videos
-- =============================================
INSERT INTO videos (title, description, videoUrl, duration, displayOrder) VALUES 
('Case Summary (Short Version)', 'A brief overview of the SHHEER bank guarantee dispute case highlighting key events and failures.', 'https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/الفيديوالمختصرللقضية.mp4', '5:30', 1),
('Full Case Documentation', 'Comprehensive video documentation of the entire case including all evidence and timeline of events.', 'https://manus-storage-china.oss-cn-beijing.aliyuncs.com/temp-files/iz7lye5p6cstyywech7ts/فيديوالقضيةالنسخةالاخيرة.mp4', '15:45', 2);

-- =============================================
-- Footer Content
-- =============================================
INSERT INTO footer_content (companyName, companySubtitle, aboutText, quickLinks, contactAddress, contactPhone, contactWebsite, legalDisclaimer, commercialReg) VALUES 
('Nesma Barzan', 'Foundation', 'Nesma Barzan Foundation is the rightful owner of the SHHEER project and all associated intellectual property rights. This website documents our legal case against Al Rajhi Bank.', '[{"label":"Case Overview","href":"#overview"},{"label":"Timeline","href":"#timeline"},{"label":"Evidence Archive","href":"#evidence"},{"label":"Video Documentation","href":"#videos"}]', 'Riyadh, Kingdom of Saudi Arabia', '+966 XX XXX XXXX', 'www.nesmabarzan.com', 'This website is created for legal documentation purposes. All information presented is based on official documents and evidence submitted to the Banking Disputes Committee.', 'CR: XXXXXXXXXX');

-- =============================================
-- Timeline Event Evidence Links
-- =============================================
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
