-- =============================================
-- SHHEER Case - Restore Timeline Events Data
-- Run this script on your production database
-- Generated: 2024-12-21
-- =============================================

-- First, add the new custom color columns if they don't exist
ALTER TABLE timeline_events 
ADD COLUMN IF NOT EXISTS custom_color VARCHAR(20),
ADD COLUMN IF NOT EXISTS custom_bg_color VARCHAR(20),
ADD COLUMN IF NOT EXISTS custom_text_color VARCHAR(20);

-- Clear existing timeline events (if any)
DELETE FROM timeline_events;

-- Reset auto-increment
ALTER TABLE timeline_events AUTO_INCREMENT = 1;

-- Insert Timeline Events
INSERT INTO timeline_events (date, time, title, description, category, displayOrder) VALUES 
('2005-01-01', NULL, 'SHHEER Project Licensed', 'Official license granted for SHHEER (شهير) project - a major real estate development initiative in Saudi Arabia.', 'Foundation', 1),
('2013-07-25', NULL, 'Investment Deal Initiated', 'DAMA Investment Group begins negotiations for €120M investment in SHHEER project.', 'Foundation', 2),
('2013-10-07', NULL, 'Bank Guarantee Requirement Set', 'DAMA requires bank guarantee as condition for investment execution.', 'Investment Deal', 3),
('2013-10-14', '10:30:00', 'RMA Activation Request Sent', 'Al Rajhi Bank initiates RMA (Relationship Management Application) activation with UNICOMBANK.', 'SWIFT Operations', 4),
('2013-10-15', '09:15:00', 'RMA Confirmation Received', 'UNICOMBANK confirms RMA activation - SWIFT channel now open between banks.', 'SWIFT Operations', 5),
('2013-10-17', NULL, 'MT 760 Guarantee Issued', 'UNICOMBANK issues MT 760 bank guarantee for €300M (Ref: JVA-PTVL-FIACL-TBTSCGL-25072013).', 'SWIFT Operations', 6),
('2013-10-21', NULL, 'Guarantee Copy Received at Branch', 'Faisal Al-Rawdan receives copy of guarantee at Al Rajhi Bank branch. Witnesses: Youssef Athnian, Hamoud Al-Issa.', 'SWIFT Operations', 7),
('2013-10-28', '14:22:00', 'PKI AUTH FAILED Error', 'Critical SWIFT authentication failure - MT 760 cannot be verified. Bank fails to resolve issue.', 'Critical Failure', 8),
('2013-10-29', NULL, 'Address Error Discovered', 'Repeated error in postal address: "kapran" instead of "katran" - indicating systemic issues.', 'Critical Failure', 9),
('2013-11-04', NULL, 'Communication Breakdown', 'Multiple failed attempts to reach bank officials. No response to urgent inquiries.', 'Critical Failure', 10),
('2013-11-12', '16:45:00', 'Investor Withdrawal Notice', 'SCC Simpatrans officially withdraws from investment deal due to bank guarantee failure.', 'Critical Failure', 11),
('2014-02-15', NULL, 'Legal Counsel Engaged', 'Attorney sends first formal inquiry letter to Al Rajhi Bank regarding the failed guarantee.', 'Legal Proceedings', 12),
('2014-03-20', NULL, 'Bank Official Response', 'Al Rajhi Bank responds with denial and contradictions to documented evidence.', 'Legal Proceedings', 13),
('2014-06-01', NULL, 'Case Filed with Banking Disputes Committee', 'Formal lawsuit filed with Banking Disputes Committee in Riyadh.', 'Legal Proceedings', 14),
('2014-07-15', NULL, 'Committee Notification Issued', 'Banking Disputes Committee issues notification to Al Rajhi Bank.', 'Legal Proceedings', 15),
('2014-09-10', NULL, 'Bank Defense Submitted', 'Al Rajhi Bank lawyer submits defense memorandum with continued denials.', 'Legal Proceedings', 16),
('2014-11-20', NULL, 'Plaintiff Rebuttal Filed', 'Comprehensive rebuttal filed with additional evidence and international banking standards citations.', 'Legal Proceedings', 17);

-- Verify the data
SELECT COUNT(*) as total_events FROM timeline_events;
SELECT id, date, title, category FROM timeline_events ORDER BY displayOrder;

-- =============================================
-- DONE! Timeline events have been restored.
-- =============================================
