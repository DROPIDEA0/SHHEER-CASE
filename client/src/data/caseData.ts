// SHHEER Case Data - Complete Timeline and Evidence
// Design Theme: Olive Branch Justice - Mediterranean Legal Heritage

export interface Party {
  name: string;
  representative?: string;
  role: string;
  details?: string;
}

export interface Evidence {
  id: string;
  type: 'email' | 'document' | 'whatsapp' | 'swift' | 'letter' | 'license';
  title: string;
  description: string;
  imagePath?: string;
  downloadable: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  category: 'foundation' | 'deal' | 'swift' | 'failure' | 'legal';
  evidence: Evidence[];
  critical?: boolean;
}

export interface CaseSection {
  id: number;
  title: string;
  arabicTitle: string;
  content: string;
  events?: TimelineEvent[];
}

// Case Basic Information
export const caseInfo = {
  name: "SHHEER Bank Guarantee Dispute Case",
  guaranteeNumber: "JVA-PTVL-FIACL-TBTSCGL-25072013",
  guaranteeValue: "300,000,000 EUR",
  dealValue: "120,000,000 EUR",
  projectName: "SHHEER (شهير)",
  projectDescription: "Mobile Visual Advertising Platform",
  licenseNumber: "ج/3/3833",
  licenseDate: "6/5/1426 H (13/6/2005)",
  issuingAuthority: "Saudi Ministry of Culture and Information"
};

// Parties Involved
export const parties: { plaintiff: Party; defendant: Party; international: Party[] } = {
  plaintiff: {
    name: "Nesma Barzan Commercial Establishment",
    representative: "Dr. Bandar Al Ali",
    role: "Guarantee Beneficiary & IP Rights Owner",
    details: "Commercial Registration: 2350074840"
  },
  defendant: {
    name: "Al Rajhi Bank",
    representative: "Faisal Al Rowdan (Import Manager)",
    role: "Receiving Bank",
    details: "SWIFT Code: RJHISARI"
  },
  international: [
    {
      name: "DAMA Group (UAE)",
      representative: "Khadija Saif Al Shehhi",
      role: "Exclusive Marketing Agent"
    },
    {
      name: "UNICOMBANK (Ukraine)",
      representative: "Mr. Radkevych Andrii",
      role: "Issuing Bank",
      details: "SWIFT Code: PERAUA2X"
    },
    {
      name: "Amadeus Dreams / SCC Simpatrans",
      representative: "Merian H. Reyes",
      role: "Investor Company"
    }
  ]
};

// Complete Timeline Events
export const timelineEvents: TimelineEvent[] = [
  // 2005 - Foundation
  {
    id: "evt-001",
    date: "2005-06-13",
    title: "Project License Issued",
    description: "The Saudi Ministry of Culture and Information issued License No. ج/3/3833 for the SHHEER mobile visual advertising project, granting exclusive intellectual property rights to Nesma Barzan Commercial Establishment.",
    category: "foundation",
    evidence: [
      {
        id: "ev-001",
        type: "license",
        title: "Ministry License Document",
        description: "Official license from the General Administration of Copyright",
        imagePath: "/evidence/case_doc_01.webp",
        downloadable: true
      }
    ]
  },
  // September 2013 - Deal Initiation
  {
    id: "evt-002",
    date: "2013-09-26",
    title: "Investment Offer Received",
    description: "DAMA Group sent official letter No. 524/213 proposing the sale of 5% of SHHEER intellectual property rights for 120 million EUR to SCC Simpatrans Limited.",
    category: "deal",
    evidence: [
      {
        id: "ev-002",
        type: "letter",
        title: "DAMA Investment Proposal",
        description: "Official letter detailing the 120 million EUR investment offer",
        imagePath: "/evidence/case_doc_47.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-003",
    date: "2013-09-29",
    title: "Investment Approval",
    description: "Nesma Barzan issued approval letter No. ج/1/709 accepting the investment proposal and authorizing legal proceedings.",
    category: "deal",
    evidence: [
      {
        id: "ev-003",
        type: "letter",
        title: "Nesma Barzan Approval Letter",
        description: "Official approval for the 5% stake sale",
        imagePath: "/evidence/case_doc_48.webp",
        downloadable: true
      }
    ]
  },
  // October 2013 - SWIFT Operations Begin
  {
    id: "evt-004",
    date: "2013-10-23",
    time: "18:35",
    title: "SBLC MT 760 Sent via SWIFT",
    description: "UNICOMBANK transmitted the Standby Letter of Credit (SBLC MT 760) worth 300 million EUR to Al Rajhi Bank via SWIFT network.",
    category: "swift",
    critical: true,
    evidence: [
      {
        id: "ev-004",
        type: "swift",
        title: "SWIFT MT 760 Message",
        description: "Original SWIFT transmission record - Reference: ToPrintPERA-9321-012381",
        imagePath: "/evidence/case_doc_09.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-005",
    date: "2013-10-27",
    title: "PKI Authentication Failed",
    description: "The SWIFT message failed authentication with error 'PKI AUTH FAILED' due to inactive RMA (Relationship Management Application) between the two banks. Al Rajhi Bank had not established the necessary banking relationship.",
    category: "failure",
    critical: true,
    evidence: [
      {
        id: "ev-005",
        type: "swift",
        title: "PKI Authentication Failure Record",
        description: "SWIFT system log showing authentication failure - ICN: RI 131023-074441-000",
        imagePath: "/evidence/case_doc_16.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-006",
    date: "2013-10-27",
    title: "DAMA Inquiry Letter Sent",
    description: "DAMA Group sent official letter No. 549/213 to Al Rajhi Bank inquiring about the guarantee reception status.",
    category: "swift",
    evidence: [
      {
        id: "ev-006",
        type: "letter",
        title: "DAMA Inquiry Letter",
        description: "Official inquiry about SBLC reception",
        imagePath: "/evidence/case_doc_06.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-007",
    date: "2013-10-28",
    title: "Urgent Fax for Address Correction",
    description: "DAMA sent an urgent fax to Al Rajhi Bank providing the correct email address for UNICOMBANK contact person.",
    category: "swift",
    evidence: [
      {
        id: "ev-007",
        type: "document",
        title: "Correction Fax",
        description: "Urgent fax with correct UNICOMBANK contact details",
        imagePath: "/evidence/case_doc_07.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-008",
    date: "2013-10-30",
    time: "13:58",
    title: "Guarantee Copy Forwarded Internally",
    description: "Email forwarded from frowdan@hotmail.com to official Al Rajhi Bank email, containing the guarantee copy.",
    category: "swift",
    evidence: [
      {
        id: "ev-008",
        type: "email",
        title: "Internal Email Forward",
        description: "Email forwarding guarantee copy to official bank channels",
        imagePath: "/evidence/email_1.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-009",
    date: "2013-10-30",
    time: "14:25",
    title: "RMA Activation Request (High Importance)",
    description: "Faisal Al Rowdan sent an internal email to International Operations department inquiring about RMA activation request, noting that the client follows up daily.",
    category: "swift",
    critical: true,
    evidence: [
      {
        id: "ev-009",
        type: "email",
        title: "RMA Activation Request Email",
        description: "High importance internal email requesting RMA status",
        imagePath: "/evidence/email_6.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-010",
    date: "2013-10-30",
    time: "15:08",
    title: "RMA Activation Confirmed",
    description: "Ahmed H. Subeh from Operations confirmed that authentication is now active between RJHISARI and PERAUA2X. The bank can now send and receive authenticated messages.",
    category: "swift",
    critical: true,
    evidence: [
      {
        id: "ev-010",
        type: "email",
        title: "RMA Confirmation Email",
        description: "Official confirmation: 'Authentication is currently active'",
        imagePath: "/evidence/email_2.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-011",
    date: "2013-10-30",
    time: "15:56",
    title: "Notification Sent with Wrong Address",
    description: "Faisal Al Rowdan sent email to international parties confirming RMA activation, but made a critical error: typed 'kapran@unicombank.com.ua' instead of 'katran@unicombank.com.ua'.",
    category: "failure",
    critical: true,
    evidence: [
      {
        id: "ev-011",
        type: "email",
        title: "Email with Wrong Address",
        description: "Email showing typo: kapran instead of katran",
        imagePath: "/evidence/email_5.webp",
        downloadable: true
      },
      {
        id: "ev-011b",
        type: "email",
        title: "Second Email with Same Error",
        description: "Repeated address error in follow-up communication",
        imagePath: "/evidence/email_3.webp",
        downloadable: true
      }
    ]
  },
  // November 2013 - Communication Breakdown
  {
    id: "evt-012",
    date: "2013-11-03",
    time: "03:36",
    title: "Bank Communication Attempt",
    description: "Faisal Al Rowdan sent communication from official Al Rajhi Bank email.",
    category: "swift",
    evidence: [
      {
        id: "ev-012",
        type: "email",
        title: "Bank Communication",
        description: "Email from alrowdanf@alrajhibank.com.sa",
        imagePath: "/evidence/email_4.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-013",
    date: "2013-11-03",
    time: "04:27",
    title: "Investor Reports Communication Difficulty",
    description: "Merian Reyes requested SBLC MT 760 resend via SWIFT, explicitly mentioning difficulty in contacting Al Rajhi Bank representative.",
    category: "failure",
    evidence: [
      {
        id: "ev-013",
        type: "email",
        title: "Communication Difficulty Report",
        description: "Email documenting contact difficulties",
        imagePath: "/evidence/email_7.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-014",
    date: "2013-11-04",
    time: "17:45",
    title: "UNICOMBANK Unable to Reach Al Rajhi",
    description: "Merian reported that UNICOMBANK wanted to speak before sending but 'were having hard time getting hold of your line' - referring to Faisal Al Rowdan's phone.",
    category: "failure",
    critical: true,
    evidence: [
      {
        id: "ev-014",
        type: "email",
        title: "Contact Failure Report",
        description: "Email: 'They were having hard time getting hold of your line'",
        imagePath: "/evidence/email_8.webp",
        downloadable: true
      }
    ]
  },
  {
    id: "evt-015",
    date: "2013-11-04",
    time: "18:05",
    title: "SBLC Sent Despite No Contact - Deal Collapse",
    description: "Merian forwarded SBLC copy stating: 'They decided to send it even if Unicom haven't talk to you cause they were having hard time getting hold of your line.' This marks the effective collapse of the deal due to Al Rajhi Bank's communication failures.",
    category: "failure",
    critical: true,
    evidence: [
      {
        id: "ev-015",
        type: "email",
        title: "Final Email - Deal Collapse",
        description: "Critical evidence of communication breakdown causing deal failure",
        imagePath: "/evidence/email_8.webp",
        downloadable: true
      }
    ]
  }
];

// WhatsApp Evidence
export const whatsappEvidence: Evidence[] = [
  {
    id: "wa-001",
    type: "whatsapp",
    title: "WhatsApp: Bandar Al Ali to Faisal Al Rowdan",
    description: "Request for specific appointment to complete guarantee procedures due to commitments with foreign companies.",
    imagePath: "/evidence/case_doc_12.webp",
    downloadable: true
  },
  {
    id: "wa-002",
    type: "whatsapp",
    title: "WhatsApp: Faisal Al Rowdan Response",
    description: "Apology for absence due to illness, promise to follow up the next day: 'المعذرة أخوي بندر إنا مريض ماداومت اليوم لكن بكرة إن شاء الله شوف لك الموضوع'",
    imagePath: "/evidence/case_doc_13.webp",
    downloadable: true
  }
];

// Case Sections for the 20-point structure
export const caseSections: CaseSection[] = [
  {
    id: 1,
    title: "Case Opening",
    arabicTitle: "الافتتاحية القضائية",
    content: "This case concerns Al Rajhi Bank's failure to properly handle an international bank guarantee (Standby Letter of Credit - SBLC) issued in favor of Nesma Barzan Commercial Establishment, resulting in the loss of a major investment opportunity. The guarantee relates to financing the purchase of intellectual property rights for the SHHEER project, a pioneering mobile visual advertising platform."
  },
  {
    id: 2,
    title: "Parties Identification",
    arabicTitle: "تعريف الأطراف والصفات القانونية",
    content: "The case involves multiple parties across different jurisdictions: the Plaintiff (Nesma Barzan), the Defendant (Al Rajhi Bank), and international parties including DAMA Group (UAE), UNICOMBANK (Ukraine), and the investor company."
  },
  {
    id: 3,
    title: "Project Identity & IP Rights",
    arabicTitle: "هوية المشروع وحقوق الملكية الفكرية",
    content: "The SHHEER project is a commercial innovation for mobile visual advertising. Nesma Barzan obtained official license from the Saudi Ministry of Culture and Information (License No. ج/3/3833 dated 6/5/1426 H), granting exclusive intellectual property rights."
  },
  {
    id: 4,
    title: "Investment Deal & DAMA's Role",
    arabicTitle: "بدء الصفقة الاستثمارية ودور DAMA",
    content: "DAMA Group, as exclusive marketing agent, brokered an investment from SCC Simpatrans Limited for 5% of IP rights at 120 million EUR. The deal required a bank guarantee (SBLC) to be received and processed through Al Rajhi Bank."
  },
  {
    id: 5,
    title: "Guarantee Copy Receipt at Bank",
    arabicTitle: "مرحلة استلام صورة خطاب الضمان داخل المصرف",
    content: "Before official SWIFT transmission, a copy of the guarantee was delivered directly to Faisal Al Rowdan at Al Rajhi Bank's headquarters. Witnesses include Youssef Athnian and Hamoud Al Issa."
  },
  {
    id: 6,
    title: "SWIFT/RMA Channel Activation",
    arabicTitle: "تفعيل قناة SWIFT/RMA داخل مصرف الراجحي",
    content: "After the initial SWIFT message failed due to inactive RMA, internal communications on October 30, 2013 confirmed activation of authentication between RJHISARI and PERAUA2X."
  },
  {
    id: 7,
    title: "Resend Instructions Issued",
    arabicTitle: "توجيه الأطراف لإعادة الإرسال بعد التفعيل",
    content: "Following RMA confirmation, Faisal Al Rowdan instructed international parties to resend the guarantee via SWIFT, acknowledging the bank's readiness to receive."
  },
  {
    id: 8,
    title: "Operational Failures",
    arabicTitle: "مرحلة التعثر التشغيلي داخل المصرف",
    content: "Despite RMA activation, critical errors occurred: repeated email address typos (kapran instead of katran), delayed responses, and communication failures that undermined the transaction."
  },
  {
    id: 9,
    title: "Phone & WhatsApp Communications",
    arabicTitle: "مرحلة المراسلات الهاتفية والواتساب",
    content: "WhatsApp messages document the plaintiff's persistent follow-up and the bank representative's promises to address the matter, which were not fulfilled."
  },
  {
    id: 10,
    title: "Internal Bank Communications",
    arabicTitle: "الحركة الداخلية للمراسلات داخل المصرف",
    content: "Internal emails reveal communication flow between the Guarantees Department (Faisal Al Rowdan) and International Operations (Ahmed Subeh), establishing clear responsibility chains."
  },
  {
    id: 11,
    title: "Investor Withdrawal Notice",
    arabicTitle: "إشعار انسحاب الشركة/المستثمر",
    content: "The November 4, 2013 email serves as de facto withdrawal notice, stating UNICOMBANK sent the SBLC despite being unable to contact Al Rajhi Bank, signaling complete loss of confidence."
  },
  {
    id: 12,
    title: "Direct Damage & Causation",
    arabicTitle: "توثيق الضرر المباشر والسببية",
    content: "Direct damage: Loss of 120 million EUR investment. Causation: Bank's failure to activate RMA timely, repeated address errors, and communication failures directly caused deal collapse."
  },
  {
    id: 13,
    title: "Legal Proceedings Initiated",
    arabicTitle: "بدء المسار النظامي عبر المحامي",
    content: "After exhausting direct communication attempts, legal counsel was engaged to send formal inquiry to Al Rajhi Bank's management."
  },
  {
    id: 14,
    title: "Bank's Official Response",
    arabicTitle: "رد المصرف الرسمي على المحامي",
    content: "Al Rajhi Bank's response denied responsibility and attempted to deflect blame, contradicting documented evidence of internal failures."
  },
  {
    id: 15,
    title: "Case Filed with Banking Disputes Committee",
    arabicTitle: "رفع الدعوى أمام لجنة المنازعات المصرفية بالرياض",
    content: "The case was formally filed before the Banking Disputes Committee in Riyadh with comprehensive documentation of the failure sequence."
  },
  {
    id: 16,
    title: "Memoranda Exchange",
    arabicTitle: "تبادل المذكرات داخل اللجنة",
    content: "The Committee notified Al Rajhi Bank, received their defense memorandum, and the plaintiff submitted rebuttals comparing bank denials against documented evidence."
  },
  {
    id: 17,
    title: "Regulatory & Governance Violations",
    arabicTitle: "نقاط الخطأ النظامي والحوكمة المصرفية",
    content: "Al Rajhi Bank violated: Duty of Care, Good Faith principle, Duty to Notify, and Record Keeping obligations - fundamental banking governance standards."
  },
  {
    id: 18,
    title: "International Standards & Regulations",
    arabicTitle: "التعزيز بالقواعد والمعايير الدولية",
    content: "The case is supported by SWIFT/RMA rules, ICC regulations (UCP 600, URDG 758), Basel Committee principles on operational risk, and UNCITRAL standards for international transfers."
  },
  {
    id: 19,
    title: "Legal Conclusion",
    arabicTitle: "الخلاصة القضائية",
    content: "Three elements of tortious liability are established: (1) Fault - documented operational failures, (2) Damage - 120 million EUR lost deal, (3) Causation - bank errors directly caused deal collapse."
  },
  {
    id: 20,
    title: "Official Seal & Contact",
    arabicTitle: "الختم الرسمي وبيانات التواصل",
    content: "Nesma Barzan Commercial Establishment | CEO: Dr. Bandar Al Ali | CR: 2350074840 | Saudi Arabia"
  }
];

// Video content
export const videos = [
  {
    id: "video-1",
    title: "Case Summary Video",
    description: "A brief overview of the SHHEER bank guarantee dispute case",
    path: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033091388/FCJrcdkVFxVyXOln.mp4",
    duration: "Short Version"
  },
  {
    id: "video-2",
    title: "Complete Case Presentation",
    description: "Comprehensive video documentation of the entire case with all details",
    path: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663033091388/rsgKwVmPFKisuedX.mp4",
    duration: "Full Version"
  }
];

// Helper function to get events by year
export function getEventsByYear(year: number): TimelineEvent[] {
  return timelineEvents.filter(event => new Date(event.date).getFullYear() === year);
}

// Helper function to get critical events
export function getCriticalEvents(): TimelineEvent[] {
  return timelineEvents.filter(event => event.critical);
}

// Helper function to get all evidence
export function getAllEvidence(): Evidence[] {
  const allEvidence: Evidence[] = [];
  timelineEvents.forEach(event => {
    allEvidence.push(...event.evidence);
  });
  allEvidence.push(...whatsappEvidence);
  return allEvidence;
}
