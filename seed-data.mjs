// Seed script to populate initial data using mysql2
import mysql from 'mysql2/promise';

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('Starting data seed...');
    
    // 1. Header Content
    await connection.execute(`
      INSERT INTO header_content (id, logoUrl, siteName, siteSubtitle, navItems)
      VALUES (1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        logoUrl = VALUES(logoUrl),
        siteName = VALUES(siteName),
        siteSubtitle = VALUES(siteSubtitle),
        navItems = VALUES(navItems)
    `, [
      '/images/logo.png',
      'SHHEER Case',
      'Bank Guarantee Dispute',
      JSON.stringify([
        { label: 'Overview', href: '#overview' },
        { label: 'Timeline', href: '#timeline' },
        { label: 'Evidence', href: '#evidence' },
        { label: 'Videos', href: '#videos' },
        { label: 'Contact', href: '#contact' }
      ])
    ]);
    console.log('✓ Header content added');

    // 2. Hero Section
    await connection.execute(`
      INSERT INTO hero_section (id, title, titleHighlight, subtitle, description, guaranteeRef, dealValue, criticalPeriod, ctaText, ctaLink)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        titleHighlight = VALUES(titleHighlight),
        subtitle = VALUES(subtitle),
        description = VALUES(description),
        guaranteeRef = VALUES(guaranteeRef),
        dealValue = VALUES(dealValue),
        criticalPeriod = VALUES(criticalPeriod),
        ctaText = VALUES(ctaText),
        ctaLink = VALUES(ctaLink)
    `, [
      'Bank Guarantee',
      'Dispute Case',
      'SHHEER (شهير) Project',
      'Nesma Barzan vs. Al Rajhi Bank',
      'JVA-PTVL-FIACL-TBTSCGL-25072013',
      '€120M',
      'Oct - Nov 2013',
      'View Timeline',
      '#timeline'
    ]);
    console.log('✓ Hero section added');

    // 3. Overview Parties
    const parties = [
      { type: 'plaintiff', name: 'Nesma Barzan Foundation', label: 'The Plaintiff', representative: 'Abdulaziz Al-Amoudi', role: 'Project Owner & Rights Holder', order: 1 },
      { type: 'defendant', name: 'Al Rajhi Bank', label: 'The Defendant', representative: null, role: 'Receiving Bank (MT 760)', order: 1 },
      { type: 'third_party', name: 'DAMA Investment Group', label: 'Investment Partner', representative: null, role: 'Investment Facilitator', order: 1 },
      { type: 'third_party', name: 'UNICOMBANK (Moldova)', label: 'Issuing Bank', representative: null, role: 'Bank Guarantee Issuer', order: 2 },
      { type: 'third_party', name: 'SCC Simpatrans', label: 'Investor', representative: null, role: 'Investment Company', order: 3 },
    ];
    
    for (const party of parties) {
      await connection.execute(`
        INSERT INTO overview_parties (partyType, name, label, representative, role, displayOrder)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [party.type, party.name, party.label, party.representative, party.role, party.order]);
    }
    console.log('✓ Parties added');

    // 4. Timeline Events
    const events = [
      { date: '2005-01-01', time: null, title: 'SHHEER Project Licensed', description: 'Official license granted for SHHEER (شهير) project - a major real estate development initiative in Saudi Arabia.', category: 'foundation', order: 1 },
      { date: '2013-07-25', time: null, title: 'Investment Deal Initiated', description: 'DAMA Investment Group begins negotiations for €120M investment in SHHEER project.', category: 'investment_deal', order: 2 },
      { date: '2013-10-07', time: null, title: 'Bank Guarantee Requirement Set', description: 'DAMA requires bank guarantee as condition for investment execution.', category: 'investment_deal', order: 3 },
      { date: '2013-10-14', time: '10:30:00', title: 'RMA Activation Request Sent', description: 'Al Rajhi Bank initiates RMA (Relationship Management Application) activation with UNICOMBANK.', category: 'swift_operations', order: 4 },
      { date: '2013-10-15', time: '09:15:00', title: 'RMA Confirmation Received', description: 'UNICOMBANK confirms RMA activation - SWIFT channel now open between banks.', category: 'swift_operations', order: 5 },
      { date: '2013-10-17', time: null, title: 'MT 760 Guarantee Issued', description: 'UNICOMBANK issues MT 760 bank guarantee for €300M (Ref: JVA-PTVL-FIACL-TBTSCGL-25072013).', category: 'swift_operations', order: 6 },
      { date: '2013-10-21', time: null, title: 'Guarantee Copy Received at Branch', description: 'Faisal Al-Rawdan receives copy of guarantee at Al Rajhi Bank branch. Witnesses: Youssef Athnian, Hamoud Al-Issa.', category: 'swift_operations', order: 7 },
      { date: '2013-10-28', time: '14:22:00', title: 'PKI AUTH FAILED Error', description: 'Critical SWIFT authentication failure - MT 760 cannot be verified. Bank fails to resolve issue.', category: 'critical_failure', order: 8 },
      { date: '2013-10-29', time: null, title: 'Address Error Discovered', description: 'Repeated error in postal address: "kapran" instead of "katran" - indicating systemic issues.', category: 'critical_failure', order: 9 },
      { date: '2013-11-04', time: null, title: 'Communication Breakdown', description: 'Multiple failed attempts to reach bank officials. No response to urgent inquiries.', category: 'critical_failure', order: 10 },
      { date: '2013-11-12', time: '16:45:00', title: 'Investor Withdrawal Notice', description: 'SCC Simpatrans officially withdraws from investment deal due to bank guarantee failure.', category: 'critical_failure', order: 11 },
      { date: '2014-02-15', time: null, title: 'Legal Counsel Engaged', description: 'Attorney sends first formal inquiry letter to Al Rajhi Bank regarding the failed guarantee.', category: 'legal_proceedings', order: 12 },
      { date: '2014-03-20', time: null, title: 'Bank Official Response', description: 'Al Rajhi Bank responds with denial and contradictions to documented evidence.', category: 'legal_proceedings', order: 13 },
      { date: '2014-06-01', time: null, title: 'Case Filed with Banking Disputes Committee', description: 'Formal lawsuit filed with Banking Disputes Committee in Riyadh.', category: 'legal_proceedings', order: 14 },
      { date: '2014-07-15', time: null, title: 'Committee Notification Issued', description: 'Banking Disputes Committee issues notification to Al Rajhi Bank.', category: 'legal_proceedings', order: 15 },
      { date: '2014-09-10', time: null, title: 'Bank Defense Submitted', description: 'Al Rajhi Bank lawyer submits defense memorandum with continued denials.', category: 'legal_proceedings', order: 16 },
      { date: '2014-11-20', time: null, title: 'Plaintiff Rebuttal Filed', description: 'Comprehensive rebuttal filed with additional evidence and international banking standards citations.', category: 'legal_proceedings', order: 17 },
    ];
    
    for (const event of events) {
      await connection.execute(`
        INSERT INTO timeline_events (date, time, title, description, category, displayOrder, isActive)
        VALUES (?, ?, ?, ?, ?, ?, true)
      `, [event.date, event.time, event.title, event.description, event.category, event.order]);
    }
    console.log('✓ Timeline events added');

    // 5. Evidence Items
    const evidence = [
      { title: 'SHHEER Project License', description: 'Official license document from 2005', category: 'licenses', fileUrl: '/evidence/license_2005.webp', order: 1 },
      { title: 'RMA Activation Email', description: 'Email confirming RMA activation between banks', category: 'emails', fileUrl: '/evidence/email_2_rma_confirmation.webp', order: 2 },
      { title: 'RMA Active Confirmation', description: 'SWIFT confirmation of active RMA status', category: 'emails', fileUrl: '/evidence/email_3_rma_active.webp', order: 3 },
      { title: 'MT 760 Bank Guarantee', description: 'Original SWIFT MT 760 message', category: 'swift', fileUrl: '/evidence/swift_mt760.webp', order: 4 },
      { title: 'PKI AUTH FAILED Screenshot', description: 'Screenshot showing authentication failure', category: 'swift', fileUrl: '/evidence/pki_auth_failed.webp', order: 5 },
      { title: 'WhatsApp Communication 1', description: 'WhatsApp messages with bank officials', category: 'whatsapp', fileUrl: '/evidence/whatsapp_1.webp', order: 6 },
      { title: 'WhatsApp Communication 2', description: 'Follow-up WhatsApp messages', category: 'whatsapp', fileUrl: '/evidence/whatsapp_2.webp', order: 7 },
      { title: 'Email Chain - Oct 14', description: 'Email correspondence dated October 14, 2013', category: 'emails', fileUrl: '/evidence/email_7.webp', order: 8 },
      { title: 'Investor Withdrawal Letter', description: 'Official withdrawal notice from SCC Simpatrans', category: 'letters', fileUrl: '/evidence/withdrawal_letter.webp', order: 9 },
      { title: 'Attorney Inquiry Letter', description: 'First formal legal inquiry to the bank', category: 'letters', fileUrl: '/evidence/attorney_letter.webp', order: 10 },
    ];
    
    for (const item of evidence) {
      await connection.execute(`
        INSERT INTO evidence_items (title, description, evidenceCategory, fileUrl, thumbnailUrl, displayOrder, isActive)
        VALUES (?, ?, ?, ?, ?, ?, true)
      `, [item.title, item.description, item.category, item.fileUrl, item.fileUrl, item.order]);
    }
    console.log('✓ Evidence items added');

    // 6. Videos
    const videos = [
      { 
        title: 'Case Summary Video', 
        description: 'A brief overview of the SHHEER bank guarantee dispute case', 
        videoUrl: 'https://manus-storage-china.oss-cn-hangzhou.aliyuncs.com/manus-storage/upload/2025/12/19/upload_1734617252_4f5b4d.mp4',
        duration: '5:30',
        order: 1 
      },
      { 
        title: 'Full Case Presentation', 
        description: 'Comprehensive video presentation of the entire case with all evidence', 
        videoUrl: 'https://manus-storage-china.oss-cn-hangzhou.aliyuncs.com/manus-storage/upload/2025/12/19/upload_1734617263_6a6c6d.mp4',
        duration: '15:45',
        order: 2 
      },
    ];
    
    for (const video of videos) {
      await connection.execute(`
        INSERT INTO videos (title, description, videoUrl, duration, displayOrder, isActive)
        VALUES (?, ?, ?, ?, ?, true)
      `, [video.title, video.description, video.videoUrl, video.duration, video.order]);
    }
    console.log('✓ Videos added');

    // 7. Footer Content
    await connection.execute(`
      INSERT INTO footer_content (id, companyName, companySubtitle, aboutText, quickLinks, contactAddress, contactPhone, contactWebsite, legalDisclaimer, commercialReg)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        companyName = VALUES(companyName),
        companySubtitle = VALUES(companySubtitle),
        aboutText = VALUES(aboutText),
        quickLinks = VALUES(quickLinks),
        contactAddress = VALUES(contactAddress),
        contactPhone = VALUES(contactPhone),
        contactWebsite = VALUES(contactWebsite),
        legalDisclaimer = VALUES(legalDisclaimer),
        commercialReg = VALUES(commercialReg)
    `, [
      'Nesma Barzan',
      'نسمة برزان',
      'Nesma Barzan Foundation is the rightful owner of the SHHEER project, a major real estate development initiative licensed in 2005.',
      JSON.stringify([
        { label: 'Case Overview', href: '#overview' },
        { label: 'Timeline', href: '#timeline' },
        { label: 'Evidence Archive', href: '#evidence' },
        { label: 'Video Documentation', href: '#videos' }
      ]),
      'Kingdom of Saudi Arabia',
      null,
      null,
      'This documentation is provided for legal proceedings and informational purposes. All evidence presented is authentic and verified.',
      'C.R. 2051024329'
    ]);
    console.log('✓ Footer content added');

    console.log('\n✅ All data seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
