import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Site Settings - General website configuration
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).default("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Header Content - Navigation and branding
 */
export const headerContent = mysqlTable("header_content", {
  id: int("id").autoincrement().primaryKey(),
  logoUrl: text("logoUrl"),
  siteName: varchar("siteName", { length: 200 }),
  siteSubtitle: varchar("siteSubtitle", { length: 300 }),
  navItems: json("navItems"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HeaderContent = typeof headerContent.$inferSelect;
export type InsertHeaderContent = typeof headerContent.$inferInsert;

/**
 * Hero Section - Main landing section
 */
export const heroSection = mysqlTable("hero_section", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }),
  titleHighlight: varchar("titleHighlight", { length: 200 }),
  subtitle: varchar("subtitle", { length: 300 }),
  description: text("description"),
  guaranteeRef: varchar("guaranteeRef", { length: 100 }),
  dealValue: varchar("dealValue", { length: 50 }),
  criticalPeriod: varchar("criticalPeriod", { length: 100 }),
  ctaText: varchar("ctaText", { length: 100 }),
  ctaLink: varchar("ctaLink", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HeroSection = typeof heroSection.$inferSelect;
export type InsertHeroSection = typeof heroSection.$inferInsert;

/**
 * Overview Parties - Plaintiff, Defendant, Third Parties
 */
export const overviewParties = mysqlTable("overview_parties", {
  id: int("id").autoincrement().primaryKey(),
  partyType: mysqlEnum("partyType", ["plaintiff", "defendant", "third_party"]).notNull(),
  name: varchar("name", { length: 300 }).notNull(),
  label: varchar("label", { length: 100 }),
  representative: varchar("representative", { length: 200 }),
  role: varchar("role", { length: 300 }),
  additionalInfo: text("additionalInfo"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OverviewParty = typeof overviewParties.$inferSelect;
export type InsertOverviewParty = typeof overviewParties.$inferInsert;

/**
 * Case Elements - Key information cards
 */
export const caseElements = mysqlTable("case_elements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  items: json("items"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CaseElement = typeof caseElements.$inferSelect;
export type InsertCaseElement = typeof caseElements.$inferInsert;

/**
 * Case Structure - 20 sections overview
 */
export const caseStructure = mysqlTable("case_structure", {
  id: int("id").autoincrement().primaryKey(),
  sectionNumber: int("sectionNumber").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CaseStructureItem = typeof caseStructure.$inferSelect;
export type InsertCaseStructureItem = typeof caseStructure.$inferInsert;

/**
 * Timeline Events - Chronological case events
 */
export const timelineEvents = mysqlTable("timeline_events", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 20 }),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = typeof timelineEvents.$inferInsert;

/**
 * Evidence Items - Documents and proof
 */
export const evidenceItems = mysqlTable("evidence_items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  category: varchar("evidenceCategory", { length: 100 }).notNull(),
  fileUrl: text("fileUrl"),
  fileName: varchar("fileName", { length: 300 }),
  fileType: varchar("fileType", { length: 50 }),
  thumbnailUrl: text("thumbnailUrl"),
  eventId: int("eventId"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvidenceItem = typeof evidenceItems.$inferSelect;
export type InsertEvidenceItem = typeof evidenceItems.$inferInsert;

/**
 * Videos - Case presentation videos
 */
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  duration: varchar("duration", { length: 50 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Footer Content - Footer sections and links
 */
export const footerContent = mysqlTable("footer_content", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 200 }),
  companySubtitle: varchar("companySubtitle", { length: 300 }),
  aboutText: text("aboutText"),
  quickLinks: json("quickLinks"),
  contactAddress: text("contactAddress"),
  contactPhone: varchar("contactPhone", { length: 50 }),
  contactWebsite: varchar("contactWebsite", { length: 200 }),
  legalDisclaimer: text("legalDisclaimer"),
  commercialReg: varchar("commercialReg", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FooterContent = typeof footerContent.$inferSelect;
export type InsertFooterContent = typeof footerContent.$inferInsert;

/**
 * Timeline Categories - Dynamic categories for timeline events
 */
export const timelineCategories = mysqlTable("timeline_categories", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 200 }).notNull(),
  color: varchar("color", { length: 50 }).default("#5d6d4e"),
  bgColor: varchar("bgColor", { length: 50 }).default("bg-[#5d6d4e]"),
  textColor: varchar("textColor", { length: 50 }).default("text-[#5d6d4e]"),
  lightColor: varchar("lightColor", { length: 50 }).default("bg-[#5d6d4e]/10"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TimelineCategory = typeof timelineCategories.$inferSelect;
export type InsertTimelineCategory = typeof timelineCategories.$inferInsert;

/**
 * Evidence Categories - Dynamic categories for evidence items
 */
export const evidenceCategories = mysqlTable("evidence_categories", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 200 }).notNull(),
  color: varchar("color", { length: 50 }).default("#5d6d4e"),
  icon: varchar("icon", { length: 50 }).default("FileText"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvidenceCategory = typeof evidenceCategories.$inferSelect;
export type InsertEvidenceCategory = typeof evidenceCategories.$inferInsert;

/**
 * Timeline Event Evidence - Junction table linking events to evidence
 */
export const timelineEventEvidence = mysqlTable("timeline_event_evidence", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  evidenceId: int("evidenceId").notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TimelineEventEvidence = typeof timelineEventEvidence.$inferSelect;
export type InsertTimelineEventEvidence = typeof timelineEventEvidence.$inferInsert;