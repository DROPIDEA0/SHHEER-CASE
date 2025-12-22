// server/_core/index.ts
import dotenv from "dotenv";
import path3 from "path";
import fs2 from "fs";
import { fileURLToPath } from "url";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).default("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var headerContent = mysqlTable("header_content", {
  id: int("id").autoincrement().primaryKey(),
  logoUrl: text("logoUrl"),
  siteName: varchar("siteName", { length: 200 }),
  siteSubtitle: varchar("siteSubtitle", { length: 300 }),
  navItems: json("navItems"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var heroSection = mysqlTable("hero_section", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var overviewParties = mysqlTable("overview_parties", {
  id: int("id").autoincrement().primaryKey(),
  partyType: mysqlEnum("partyType", ["plaintiff", "defendant", "third_party"]).notNull(),
  name: varchar("name", { length: 300 }).notNull(),
  label: varchar("label", { length: 100 }),
  representative: varchar("representative", { length: 200 }),
  role: varchar("role", { length: 300 }),
  additionalInfo: text("additionalInfo"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var caseElements = mysqlTable("case_elements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  items: json("items"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var caseStructure = mysqlTable("case_structure", {
  id: int("id").autoincrement().primaryKey(),
  sectionNumber: int("sectionNumber").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var timelineEvents = mysqlTable("timeline_events", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 20 }),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  // Custom colors for individual event styling
  customColor: varchar("customColor", { length: 50 }),
  customBgColor: varchar("customBgColor", { length: 50 }),
  customTextColor: varchar("customTextColor", { length: 50 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var evidenceItems = mysqlTable("evidence_items", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  duration: varchar("duration", { length: 50 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var footerContent = mysqlTable("footer_content", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var timelineCategories = mysqlTable("timeline_categories", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var evidenceCategories = mysqlTable("evidence_categories", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 200 }).notNull(),
  color: varchar("color", { length: 50 }).default("#5d6d4e"),
  icon: varchar("icon", { length: 50 }).default("FileText"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var timelineEventEvidence = mysqlTable("timeline_event_evidence", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  evidenceId: int("evidenceId").notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  // Hashed password
  name: varchar("name", { length: 200 }),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("adminRole", ["super_admin", "admin", "editor", "viewer"]).default("editor").notNull(),
  permissions: json("permissions"),
  // Custom permissions JSON
  isActive: boolean("isActive").default(true),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var siteAccessUsers = mysqlTable("site_access_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  // Hashed password
  name: varchar("name", { length: 200 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var siteProtection = mysqlTable("site_protection", {
  id: int("id").autoincrement().primaryKey(),
  isEnabled: boolean("isEnabled").default(false),
  message: text("message"),
  // Custom message shown on login page
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var adminSettings = mysqlTable("admin_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  settingType: varchar("settingType", { length: 50 }).default("text"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
import bcrypt from "bcryptjs";
var _db = null;
var _connectionPool = null;
console.log("[Database] Initializing...");
console.log("[Database] DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("[Database] DB_HOST exists:", !!process.env.DB_HOST);
console.log("[Database] DB_USER exists:", !!process.env.DB_USER);
console.log("[Database] DB_NAME exists:", !!process.env.DB_NAME);
if (process.env.DATABASE_URL) {
  const sanitizedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@");
  console.log("[Database] DATABASE_URL (sanitized):", sanitizedUrl);
}
function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || "3306";
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  if (host && user && password && database) {
    const url = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
    console.log("[Database] Built DATABASE_URL from separate variables");
    return url;
  }
  return null;
}
function parseDbUrl(url) {
  try {
    const dbUrl = new URL(url);
    let database = dbUrl.pathname.slice(1);
    if (database.includes("?")) {
      database = database.split("?")[0];
    }
    const sslParam = dbUrl.searchParams.get("ssl");
    let ssl = void 0;
    if (sslParam) {
      try {
        ssl = JSON.parse(sslParam);
      } catch {
        ssl = sslParam === "true" ? { rejectUnauthorized: true } : void 0;
      }
    }
    return {
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      database,
      ssl
    };
  } catch (error) {
    console.error("[Database] Failed to parse DATABASE_URL:", error);
    return null;
  }
}
async function getDb() {
  if (_db) return _db;
  const dbUrl = buildDatabaseUrl();
  if (!dbUrl) {
    console.warn("[Database] No database configuration found (neither DATABASE_URL nor DB_HOST/DB_USER/DB_PASSWORD/DB_NAME)");
    return null;
  }
  try {
    console.log("[Database] Attempting connection...");
    const config = parseDbUrl(dbUrl);
    if (!config) {
      console.error("[Database] Invalid DATABASE_URL format");
      return null;
    }
    console.log("[Database] Connecting to:", config.host + ":" + config.port);
    console.log("[Database] Database name:", config.database);
    console.log("[Database] User:", config.user);
    const poolConfig = {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3e4,
      // 30 seconds
      enableKeepAlive: true,
      keepAliveInitialDelay: 1e4
    };
    if (config.ssl) {
      poolConfig.ssl = config.ssl;
      console.log("[Database] SSL enabled:", JSON.stringify(config.ssl));
    }
    _connectionPool = mysql.createPool(poolConfig);
    const testConnection = await _connectionPool.getConnection();
    console.log("[Database] Connection test successful!");
    testConnection.release();
    _db = drizzle({ client: _connectionPool });
    console.log("[Database] Drizzle instance created successfully");
    return _db;
  } catch (error) {
    console.error("[Database] Connection failed:", error?.message || error);
    console.error("[Database] Error code:", error?.code);
    console.error("[Database] Error errno:", error?.errno);
    _db = null;
    return null;
  }
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getSiteSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}
async function getSiteSetting(key) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0] || null;
}
async function upsertSiteSetting(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(siteSettings).values(data).onDuplicateKeyUpdate({
    set: { value: data.value, type: data.type }
  });
  return getSiteSetting(data.key);
}
async function getHeaderContent() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(headerContent).limit(1);
  return result[0] || null;
}
async function upsertHeaderContent(data) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getHeaderContent();
  if (existing) {
    await db.update(headerContent).set(data).where(eq(headerContent.id, existing.id));
    return getHeaderContent();
  } else {
    await db.insert(headerContent).values(data);
    return getHeaderContent();
  }
}
async function getHeroSection() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(heroSection).limit(1);
  return result[0] || null;
}
async function upsertHeroSection(data) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getHeroSection();
  if (existing) {
    await db.update(heroSection).set(data).where(eq(heroSection.id, existing.id));
    return getHeroSection();
  } else {
    await db.insert(heroSection).values(data);
    return getHeroSection();
  }
}
async function getOverviewParties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(overviewParties).orderBy(asc(overviewParties.displayOrder));
}
async function getOverviewParty(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(overviewParties).where(eq(overviewParties.id, id)).limit(1);
  return result[0] || null;
}
async function createOverviewParty(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(overviewParties).values(data);
  return data;
}
async function updateOverviewParty(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(overviewParties).set(data).where(eq(overviewParties.id, id));
  return getOverviewParty(id);
}
async function deleteOverviewParty(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(overviewParties).where(eq(overviewParties.id, id));
  return true;
}
async function getCaseElements() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseElements).orderBy(asc(caseElements.displayOrder));
}
async function getCaseElement(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(caseElements).where(eq(caseElements.id, id)).limit(1);
  return result[0] || null;
}
async function createCaseElement(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(caseElements).values(data);
  return data;
}
async function updateCaseElement(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(caseElements).set(data).where(eq(caseElements.id, id));
  return getCaseElement(id);
}
async function deleteCaseElement(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(caseElements).where(eq(caseElements.id, id));
  return true;
}
async function getCaseStructure() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStructure).orderBy(asc(caseStructure.sectionNumber));
}
async function getCaseStructureItem(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(caseStructure).where(eq(caseStructure.id, id)).limit(1);
  return result[0] || null;
}
async function createCaseStructureItem(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(caseStructure).values(data);
  return data;
}
async function updateCaseStructureItem(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(caseStructure).set(data).where(eq(caseStructure.id, id));
  return getCaseStructureItem(id);
}
async function deleteCaseStructureItem(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(caseStructure).where(eq(caseStructure.id, id));
  return true;
}
async function getTimelineEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timelineEvents).orderBy(asc(timelineEvents.displayOrder));
}
async function getTimelineEvent(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(timelineEvents).where(eq(timelineEvents.id, id)).limit(1);
  return result[0] || null;
}
async function createTimelineEvent(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(timelineEvents).values(data);
  return data;
}
async function updateTimelineEvent(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(timelineEvents).set(data).where(eq(timelineEvents.id, id));
  return getTimelineEvent(id);
}
async function deleteTimelineEvent(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
  return true;
}
async function getEvidenceItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(evidenceItems).orderBy(asc(evidenceItems.displayOrder));
}
async function getEvidenceItem(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(evidenceItems).where(eq(evidenceItems.id, id)).limit(1);
  return result[0] || null;
}
async function createEvidenceItem(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(evidenceItems).values(data);
  return data;
}
async function updateEvidenceItem(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(evidenceItems).set(data).where(eq(evidenceItems.id, id));
  return getEvidenceItem(id);
}
async function deleteEvidenceItem(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(evidenceItems).where(eq(evidenceItems.id, id));
  return true;
}
async function getVideos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(videos).orderBy(asc(videos.displayOrder));
}
async function getVideo(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return result[0] || null;
}
async function createVideo(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(videos).values(data);
  return data;
}
async function updateVideo(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(videos).set(data).where(eq(videos.id, id));
  return getVideo(id);
}
async function deleteVideo(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(videos).where(eq(videos.id, id));
  return true;
}
async function getFooterContent() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(footerContent).limit(1);
  return result[0] || null;
}
async function upsertFooterContent(data) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getFooterContent();
  if (existing) {
    await db.update(footerContent).set(data).where(eq(footerContent.id, existing.id));
    return getFooterContent();
  } else {
    await db.insert(footerContent).values(data);
    return getFooterContent();
  }
}
async function getTimelineCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timelineCategories).orderBy(asc(timelineCategories.displayOrder));
}
async function getTimelineCategory(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(timelineCategories).where(eq(timelineCategories.id, id)).limit(1);
  return result[0] || null;
}
async function createTimelineCategory(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(timelineCategories).values(data);
  return data;
}
async function updateTimelineCategory(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(timelineCategories).set(data).where(eq(timelineCategories.id, id));
  return getTimelineCategory(id);
}
async function deleteTimelineCategory(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(timelineCategories).where(eq(timelineCategories.id, id));
  return true;
}
async function getEvidenceCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(evidenceCategories).orderBy(asc(evidenceCategories.displayOrder));
}
async function getEvidenceCategory(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(evidenceCategories).where(eq(evidenceCategories.id, id)).limit(1);
  return result[0] || null;
}
async function createEvidenceCategory(data) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(evidenceCategories).values(data);
  return data;
}
async function updateEvidenceCategory(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(evidenceCategories).set(data).where(eq(evidenceCategories.id, id));
  return getEvidenceCategory(id);
}
async function deleteEvidenceCategory(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(evidenceCategories).where(eq(evidenceCategories.id, id));
  return true;
}
async function addEvidenceToEvent(eventId, evidenceId, displayOrder = 0) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(timelineEventEvidence).values({ eventId, evidenceId, displayOrder });
  return { eventId, evidenceId, displayOrder };
}
async function removeEvidenceFromEvent(eventId, evidenceId) {
  const db = await getDb();
  if (!db) return false;
  const { and } = await import("drizzle-orm");
  await db.delete(timelineEventEvidence).where(
    and(
      eq(timelineEventEvidence.eventId, eventId),
      eq(timelineEventEvidence.evidenceId, evidenceId)
    )
  );
  return true;
}
async function getEvidenceForEvent(eventId) {
  const db = await getDb();
  if (!db) return [];
  const links = await db.select().from(timelineEventEvidence).where(eq(timelineEventEvidence.eventId, eventId)).orderBy(asc(timelineEventEvidence.displayOrder));
  if (links.length === 0) return [];
  const evidenceIds = links.map((l) => l.evidenceId);
  const { inArray } = await import("drizzle-orm");
  const items = await db.select().from(evidenceItems).where(inArray(evidenceItems.id, evidenceIds));
  return items;
}
async function getAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: adminUsers.id,
    username: adminUsers.username,
    name: adminUsers.name,
    email: adminUsers.email,
    role: adminUsers.role,
    isActive: adminUsers.isActive,
    lastLogin: adminUsers.lastLogin,
    createdAt: adminUsers.createdAt
  }).from(adminUsers);
}
async function getAdminUserByUsername(username) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
  return result[0] || null;
}
async function getAdminUserById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return result[0] || null;
}
async function createAdminUser(data) {
  const db = await getDb();
  if (!db) return null;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await db.insert(adminUsers).values({
    username: data.username,
    password: hashedPassword,
    name: data.name || null,
    email: data.email || null,
    role: data.role || "editor",
    isActive: data.isActive ?? true
  });
  return getAdminUserByUsername(data.username);
}
async function updateAdminUser(id, data) {
  const db = await getDb();
  if (!db) return null;
  const updateData = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else {
    delete updateData.password;
  }
  await db.update(adminUsers).set(updateData).where(eq(adminUsers.id, id));
  return getAdminUserById(id);
}
async function deleteAdminUser(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  return true;
}
async function updateAdminUserLastLogin(id) {
  const db = await getDb();
  if (!db) return;
  await db.update(adminUsers).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(adminUsers.id, id));
}
async function verifyAdminPassword(username, password) {
  console.log("[DB] verifyAdminPassword called:", { username });
  const user = await getAdminUserByUsername(username);
  if (!user) {
    console.log("[DB] User not found:", username);
    return null;
  }
  if (!user.isActive) {
    console.log("[DB] User is inactive:", username);
    return null;
  }
  console.log("[DB] User found:", { id: user.id, username: user.username, isActive: user.isActive });
  console.log("[DB] Comparing passwords...");
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log("[DB] Password mismatch for user:", username);
    return null;
  }
  console.log("[DB] Password verified successfully for user:", username);
  await updateAdminUserLastLogin(user.id);
  return user;
}
async function getSiteAccessUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: siteAccessUsers.id,
    username: siteAccessUsers.username,
    name: siteAccessUsers.name,
    isActive: siteAccessUsers.isActive,
    createdAt: siteAccessUsers.createdAt
  }).from(siteAccessUsers);
}
async function getSiteAccessUserByUsername(username) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteAccessUsers).where(eq(siteAccessUsers.username, username)).limit(1);
  return result[0] || null;
}
async function getSiteAccessUserById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteAccessUsers).where(eq(siteAccessUsers.id, id)).limit(1);
  return result[0] || null;
}
async function createSiteAccessUser(data) {
  const db = await getDb();
  if (!db) return null;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await db.insert(siteAccessUsers).values({
    username: data.username,
    password: hashedPassword,
    name: data.name || null,
    isActive: data.isActive ?? true
  });
  return getSiteAccessUserByUsername(data.username);
}
async function updateSiteAccessUser(id, data) {
  const db = await getDb();
  if (!db) return null;
  const updateData = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else {
    delete updateData.password;
  }
  await db.update(siteAccessUsers).set(updateData).where(eq(siteAccessUsers.id, id));
  return getSiteAccessUserById(id);
}
async function deleteSiteAccessUser(id) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(siteAccessUsers).where(eq(siteAccessUsers.id, id));
  return true;
}
async function verifySiteAccessPassword(username, password) {
  const user = await getSiteAccessUserByUsername(username);
  if (!user || !user.isActive) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return user;
}
async function getSiteProtection() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteProtection).limit(1);
  return result[0] || null;
}
async function upsertSiteProtection(data) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getSiteProtection();
  if (existing) {
    await db.update(siteProtection).set(data).where(eq(siteProtection.id, existing.id));
    return getSiteProtection();
  } else {
    await db.insert(siteProtection).values({
      isEnabled: data.isEnabled ?? false,
      message: data.message || null
    });
    return getSiteProtection();
  }
}
async function getAdminSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(adminSettings);
}
async function getAdminSetting(key) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminSettings).where(eq(adminSettings.settingKey, key)).limit(1);
  return result[0] || null;
}
async function updateAdminSetting(key, value, type = "text") {
  const db = await getDb();
  if (!db) return null;
  const existing = await getAdminSetting(key);
  if (existing) {
    await db.update(adminSettings).set({ settingValue: value, settingType: type }).where(eq(adminSettings.settingKey, key));
  } else {
    await db.insert(adminSettings).values({
      settingKey: key,
      settingValue: value,
      settingType: type
    });
  }
  return getAdminSetting(key);
}
async function changeAdminPassword(adminId, currentPassword, newPassword) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(adminUsers).where(eq(adminUsers.id, adminId)).limit(1);
  const admin = result[0];
  if (!admin) throw new Error("Admin user not found");
  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) throw new Error("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.update(adminUsers).set({ password: hashedPassword }).where(eq(adminUsers.id, adminId));
  return true;
}
async function uploadAdminLogo(imageData) {
  return updateAdminSetting("admin_logo", imageData, "image");
}
async function uploadFavicon(imageData) {
  return updateAdminSetting("favicon", imageData, "image");
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";

// server/storage.ts
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
var adminProcedure2 = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var ADMIN_SESSION_COOKIE = "admin_session";
var SITE_ACCESS_COOKIE = "site_access";
var appRouter = router({
  system: systemRouter,
  // ============ ADMIN AUTH API ============
  adminAuth: router({
    login: publicProcedure.input(z2.object({ username: z2.string(), password: z2.string() })).mutation(async ({ input, ctx }) => {
      console.log("[AdminAuth] Login attempt:", { username: input.username });
      const user = await verifyAdminPassword(input.username, input.password);
      if (!user) {
        console.log("[AdminAuth] Login failed: Invalid credentials");
        return { success: false, message: "Invalid username or password" };
      }
      console.log("[AdminAuth] Login successful:", { id: user.id, username: user.username, role: user.role });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      const sessionData = { id: user.id, username: user.username, role: user.role };
      ctx.res.cookie(ADMIN_SESSION_COOKIE, JSON.stringify(sessionData), {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      });
      console.log("[AdminAuth] Session cookie set:", sessionData);
      return { success: true, user: { id: user.id, username: user.username, name: user.name, role: user.role } };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
    me: publicProcedure.query(({ ctx }) => {
      const sessionCookie = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
      if (!sessionCookie) return null;
      try {
        return JSON.parse(sessionCookie);
      } catch {
        return null;
      }
    }),
    getAdminUsers: adminProcedure2.query(() => getAdminUsers()),
    createAdminUser: adminProcedure2.input(z2.object({
      username: z2.string(),
      password: z2.string(),
      name: z2.string().optional(),
      email: z2.string().optional(),
      role: z2.enum(["super_admin", "admin", "editor", "viewer"]).default("editor"),
      isActive: z2.boolean().default(true)
    })).mutation(({ input }) => createAdminUser(input)),
    updateAdminUser: adminProcedure2.input(z2.object({
      id: z2.number(),
      username: z2.string().optional(),
      password: z2.string().optional(),
      name: z2.string().optional(),
      email: z2.string().optional(),
      role: z2.enum(["super_admin", "admin", "editor", "viewer"]).optional(),
      isActive: z2.boolean().optional()
    })).mutation(({ input }) => updateAdminUser(input.id, input)),
    deleteAdminUser: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteAdminUser(input.id))
  }),
  // ============ SITE PROTECTION API ============
  siteProtection: router({
    getSettings: publicProcedure.query(() => getSiteProtection()),
    updateSettings: adminProcedure2.input(z2.object({
      isEnabled: z2.boolean().optional(),
      message: z2.string().optional()
    })).mutation(({ input }) => upsertSiteProtection(input)),
    getAccessUsers: adminProcedure2.query(() => getSiteAccessUsers()),
    createAccessUser: adminProcedure2.input(z2.object({
      username: z2.string(),
      password: z2.string(),
      name: z2.string().optional(),
      isActive: z2.boolean().default(true)
    })).mutation(({ input }) => createSiteAccessUser(input)),
    updateAccessUser: adminProcedure2.input(z2.object({
      id: z2.number(),
      username: z2.string().optional(),
      password: z2.string().optional(),
      name: z2.string().optional(),
      isActive: z2.boolean().optional()
    })).mutation(({ input }) => updateSiteAccessUser(input.id, input)),
    deleteAccessUser: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteSiteAccessUser(input.id)),
    login: publicProcedure.input(z2.object({ username: z2.string(), password: z2.string() })).mutation(async ({ input, ctx }) => {
      const user = await verifySiteAccessPassword(input.username, input.password);
      if (!user) {
        return { success: false, message: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629" };
      }
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(SITE_ACCESS_COOKIE, JSON.stringify({ id: user.id, username: user.username }), {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      });
      return { success: true };
    }),
    checkAccess: publicProcedure.query(({ ctx }) => {
      const sessionCookie = ctx.req.cookies?.[SITE_ACCESS_COOKIE];
      if (!sessionCookie) return { hasAccess: false };
      try {
        const session = JSON.parse(sessionCookie);
        return { hasAccess: true, user: session };
      } catch {
        return { hasAccess: false };
      }
    })
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  // ============ DIAGNOSTICS API ============
  diagnostics: router({
    dbStatus: publicProcedure.query(async () => {
      const envCheck = {
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
        DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + "..." || "NOT_SET",
        NODE_ENV: process.env.NODE_ENV || "NOT_SET",
        // Separate DB variables
        DB_HOST: process.env.DB_HOST || "NOT_SET",
        DB_PORT: process.env.DB_PORT || "3306",
        DB_USER_EXISTS: !!process.env.DB_USER,
        DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME || "NOT_SET",
        // Working directory info
        CWD: process.cwd()
      };
      let dbConnection = {
        status: "unknown",
        error: null,
        tableCount: 0
      };
      try {
        const dbInstance = await getDb();
        if (dbInstance) {
          const testResult = await getSiteSettings();
          dbConnection.status = "connected";
          dbConnection.tableCount = Array.isArray(testResult) ? testResult.length : 0;
        } else {
          dbConnection.status = "no_db_instance";
          dbConnection.error = "getDb() returned null - check server logs for detailed error";
        }
      } catch (error) {
        dbConnection.status = "error";
        dbConnection.error = error?.message || String(error);
        if (error?.code) {
          dbConnection.error += ` (Code: ${error.code})`;
        }
        if (error?.errno) {
          dbConnection.error += ` (Errno: ${error.errno})`;
        }
      }
      return {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: envCheck,
        dbUrl: {
          exists: !!process.env.DATABASE_URL,
          length: process.env.DATABASE_URL?.length || 0,
          prefix: process.env.DATABASE_URL?.substring(0, 30) + "..." || "NOT_SET"
        },
        database: dbConnection
      };
    }),
    // Direct connection test with detailed error
    testConnection: publicProcedure.query(async () => {
      const mysql2 = await import("mysql2/promise");
      const dbUrl = process.env.DATABASE_URL;
      const host = process.env.DB_HOST || "localhost";
      const port = parseInt(process.env.DB_PORT || "3306");
      const user = process.env.DB_USER;
      const password = process.env.DB_PASSWORD;
      const database = process.env.DB_NAME;
      const result = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        config: {
          host,
          port,
          user: user ? user.substring(0, 5) + "..." : "NOT_SET",
          database: database || "NOT_SET",
          hasPassword: !!password,
          passwordLength: password?.length || 0
        },
        connection: {
          status: "unknown",
          error: null
        }
      };
      try {
        if (host && user && password && database) {
          const connection = await mysql2.createConnection({
            host,
            port,
            user,
            password,
            database,
            connectTimeout: 1e4
          });
          const [rows] = await connection.execute("SELECT 1 as test");
          result.connection.status = "connected";
          result.connection.testQuery = rows;
          await connection.end();
        } else {
          result.connection.status = "missing_config";
          result.connection.error = "Missing required database configuration";
        }
      } catch (error) {
        result.connection.status = "error";
        result.connection.error = error?.message || String(error);
        result.connection.code = error?.code;
        result.connection.errno = error?.errno;
        result.connection.sqlState = error?.sqlState;
      }
      return result;
    })
  }),
  // ============ PUBLIC CONTENT API ============
  public: router({
    getHeaderContent: publicProcedure.query(() => getHeaderContent()),
    getHeroSection: publicProcedure.query(() => getHeroSection()),
    getOverviewParties: publicProcedure.query(() => getOverviewParties()),
    getCaseElements: publicProcedure.query(() => getCaseElements()),
    getCaseStructure: publicProcedure.query(() => getCaseStructure()),
    getTimelineEvents: publicProcedure.query(() => getTimelineEvents()),
    getEvidenceItems: publicProcedure.query(() => getEvidenceItems()),
    getVideos: publicProcedure.query(() => getVideos()),
    getFooterContent: publicProcedure.query(() => getFooterContent()),
    getSiteSettings: publicProcedure.query(() => getSiteSettings()),
    getTimelineCategories: publicProcedure.query(() => getTimelineCategories()),
    getEvidenceCategories: publicProcedure.query(() => getEvidenceCategories()),
    getEventEvidence: publicProcedure.input(z2.object({ eventId: z2.number() })).query(({ input }) => getEvidenceForEvent(input.eventId))
  }),
  // ============ ADMIN API ============
  admin: router({
    getStats: adminProcedure2.query(async () => {
      const [timeline, evidence, videos2, parties] = await Promise.all([
        getTimelineEvents(),
        getEvidenceItems(),
        getVideos(),
        getOverviewParties()
      ]);
      return {
        timelineCount: timeline.length,
        evidenceCount: evidence.length,
        videoCount: videos2.length,
        partyCount: parties.length
      };
    }),
    getSiteSettings: adminProcedure2.query(() => getSiteSettings()),
    upsertSiteSetting: adminProcedure2.input(z2.object({ key: z2.string(), value: z2.string().nullable(), type: z2.string().default("text") })).mutation(({ input }) => upsertSiteSetting(input)),
    getHeaderContent: adminProcedure2.query(() => getHeaderContent()),
    upsertHeaderContent: adminProcedure2.input(z2.object({ logoUrl: z2.string().nullable().optional(), siteName: z2.string().nullable().optional(), siteSubtitle: z2.string().nullable().optional(), navItems: z2.any().optional() })).mutation(({ input }) => upsertHeaderContent(input)),
    getHeroSection: adminProcedure2.query(() => getHeroSection()),
    upsertHeroSection: adminProcedure2.input(z2.object({ title: z2.string().nullable().optional(), titleHighlight: z2.string().nullable().optional(), subtitle: z2.string().nullable().optional(), description: z2.string().nullable().optional(), guaranteeRef: z2.string().nullable().optional(), dealValue: z2.string().nullable().optional(), criticalPeriod: z2.string().nullable().optional(), ctaText: z2.string().nullable().optional(), ctaLink: z2.string().nullable().optional() })).mutation(({ input }) => upsertHeroSection(input)),
    getOverviewParties: adminProcedure2.query(() => getOverviewParties()),
    createOverviewParty: adminProcedure2.input(z2.object({ partyType: z2.enum(["plaintiff", "defendant", "third_party"]), name: z2.string(), label: z2.string().nullable().optional(), representative: z2.string().nullable().optional(), role: z2.string().nullable().optional(), additionalInfo: z2.string().nullable().optional(), displayOrder: z2.number().default(0) })).mutation(({ input }) => createOverviewParty(input)),
    updateOverviewParty: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ partyType: z2.enum(["plaintiff", "defendant", "third_party"]).optional(), name: z2.string().optional(), label: z2.string().nullable().optional(), representative: z2.string().nullable().optional(), role: z2.string().nullable().optional(), additionalInfo: z2.string().nullable().optional(), displayOrder: z2.number().optional() }) })).mutation(({ input }) => updateOverviewParty(input.id, input.data)),
    deleteOverviewParty: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteOverviewParty(input.id)),
    getCaseElements: adminProcedure2.query(() => getCaseElements()),
    createCaseElement: adminProcedure2.input(z2.object({ title: z2.string(), icon: z2.string().nullable().optional(), items: z2.any().optional(), displayOrder: z2.number().default(0) })).mutation(({ input }) => createCaseElement(input)),
    updateCaseElement: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ title: z2.string().optional(), icon: z2.string().nullable().optional(), items: z2.any().optional(), displayOrder: z2.number().optional() }) })).mutation(({ input }) => updateCaseElement(input.id, input.data)),
    deleteCaseElement: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteCaseElement(input.id)),
    getCaseStructure: adminProcedure2.query(() => getCaseStructure()),
    createCaseStructureItem: adminProcedure2.input(z2.object({ sectionNumber: z2.number(), title: z2.string(), description: z2.string().nullable().optional(), displayOrder: z2.number().default(0) })).mutation(({ input }) => createCaseStructureItem(input)),
    updateCaseStructureItem: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ sectionNumber: z2.number().optional(), title: z2.string().optional(), description: z2.string().nullable().optional(), displayOrder: z2.number().optional() }) })).mutation(({ input }) => updateCaseStructureItem(input.id, input.data)),
    deleteCaseStructureItem: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteCaseStructureItem(input.id)),
    getTimelineEvents: adminProcedure2.query(() => getTimelineEvents()),
    createTimelineEvent: adminProcedure2.input(z2.object({ date: z2.string(), time: z2.string().nullable().optional(), title: z2.string(), description: z2.string().nullable().optional(), category: z2.string(), customColor: z2.string().nullable().optional(), customBgColor: z2.string().nullable().optional(), customTextColor: z2.string().nullable().optional(), displayOrder: z2.number().default(0), isActive: z2.boolean().default(true) })).mutation(({ input }) => createTimelineEvent(input)),
    updateTimelineEvent: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ date: z2.string().optional(), time: z2.string().nullable().optional(), title: z2.string().optional(), description: z2.string().nullable().optional(), category: z2.string().optional(), customColor: z2.string().nullable().optional(), customBgColor: z2.string().nullable().optional(), customTextColor: z2.string().nullable().optional(), displayOrder: z2.number().optional(), isActive: z2.boolean().optional() }) })).mutation(({ input }) => updateTimelineEvent(input.id, input.data)),
    deleteTimelineEvent: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteTimelineEvent(input.id)),
    getEvidenceItems: adminProcedure2.query(() => getEvidenceItems()),
    createEvidenceItem: adminProcedure2.input(z2.object({ title: z2.string(), description: z2.string().nullable().optional(), category: z2.string(), fileUrl: z2.string().nullable().optional(), fileName: z2.string().nullable().optional(), fileType: z2.string().nullable().optional(), thumbnailUrl: z2.string().nullable().optional(), eventId: z2.number().nullable().optional(), displayOrder: z2.number().default(0), isActive: z2.boolean().default(true) })).mutation(({ input }) => createEvidenceItem(input)),
    updateEvidenceItem: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ title: z2.string().optional(), description: z2.string().nullable().optional(), category: z2.string().optional(), fileUrl: z2.string().nullable().optional(), fileName: z2.string().nullable().optional(), fileType: z2.string().nullable().optional(), thumbnailUrl: z2.string().nullable().optional(), eventId: z2.number().nullable().optional(), displayOrder: z2.number().optional(), isActive: z2.boolean().optional() }) })).mutation(({ input }) => updateEvidenceItem(input.id, input.data)),
    deleteEvidenceItem: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteEvidenceItem(input.id)),
    getVideos: adminProcedure2.query(() => getVideos()),
    createVideo: adminProcedure2.input(z2.object({ title: z2.string(), description: z2.string().nullable().optional(), videoUrl: z2.string(), thumbnailUrl: z2.string().nullable().optional(), duration: z2.string().nullable().optional(), displayOrder: z2.number().default(0), isActive: z2.boolean().default(true) })).mutation(({ input }) => createVideo(input)),
    updateVideo: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ title: z2.string().optional(), description: z2.string().nullable().optional(), videoUrl: z2.string().optional(), thumbnailUrl: z2.string().nullable().optional(), duration: z2.string().nullable().optional(), displayOrder: z2.number().optional(), isActive: z2.boolean().optional() }) })).mutation(({ input }) => updateVideo(input.id, input.data)),
    deleteVideo: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteVideo(input.id)),
    getFooterContent: adminProcedure2.query(() => getFooterContent()),
    upsertFooterContent: adminProcedure2.input(z2.object({ companyName: z2.string().nullable().optional(), companySubtitle: z2.string().nullable().optional(), aboutText: z2.string().nullable().optional(), quickLinks: z2.any().optional(), contactAddress: z2.string().nullable().optional(), contactPhone: z2.string().nullable().optional(), contactWebsite: z2.string().nullable().optional(), legalDisclaimer: z2.string().nullable().optional(), commercialReg: z2.string().nullable().optional() })).mutation(({ input }) => upsertFooterContent(input)),
    uploadFile: adminProcedure2.input(z2.object({ fileName: z2.string(), fileData: z2.string(), contentType: z2.string() })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.fileData, "base64");
      const fileKey = `evidence/${Date.now()}-${input.fileName}`;
      const result = await storagePut(fileKey, buffer, input.contentType);
      return result;
    }),
    uploadVideo: adminProcedure2.input(z2.object({ fileName: z2.string(), fileData: z2.string(), contentType: z2.string() })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.fileData, "base64");
      const fileKey = `videos/${Date.now()}-${input.fileName}`;
      const result = await storagePut(fileKey, buffer, input.contentType);
      return result;
    }),
    // Timeline Categories
    getTimelineCategories: adminProcedure2.query(() => getTimelineCategories()),
    createTimelineCategory: adminProcedure2.input(z2.object({ key: z2.string(), label: z2.string(), color: z2.string().optional(), bgColor: z2.string().optional(), textColor: z2.string().optional(), lightColor: z2.string().optional(), displayOrder: z2.number().default(0), isActive: z2.boolean().default(true) })).mutation(({ input }) => createTimelineCategory(input)),
    updateTimelineCategory: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ key: z2.string().optional(), label: z2.string().optional(), color: z2.string().optional(), bgColor: z2.string().optional(), textColor: z2.string().optional(), lightColor: z2.string().optional(), displayOrder: z2.number().optional(), isActive: z2.boolean().optional() }) })).mutation(({ input }) => updateTimelineCategory(input.id, input.data)),
    deleteTimelineCategory: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteTimelineCategory(input.id)),
    // Evidence Categories
    getEvidenceCategories: adminProcedure2.query(() => getEvidenceCategories()),
    createEvidenceCategory: adminProcedure2.input(z2.object({ key: z2.string(), label: z2.string(), color: z2.string().optional(), icon: z2.string().optional(), displayOrder: z2.number().default(0), isActive: z2.boolean().default(true) })).mutation(({ input }) => createEvidenceCategory(input)),
    updateEvidenceCategory: adminProcedure2.input(z2.object({ id: z2.number(), data: z2.object({ key: z2.string().optional(), label: z2.string().optional(), color: z2.string().optional(), icon: z2.string().optional(), displayOrder: z2.number().optional(), isActive: z2.boolean().optional() }) })).mutation(({ input }) => updateEvidenceCategory(input.id, input.data)),
    deleteEvidenceCategory: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteEvidenceCategory(input.id)),
    // Timeline Event Evidence (linking evidence to events)
    getEventEvidence: adminProcedure2.input(z2.object({ eventId: z2.number() })).query(({ input }) => getEvidenceForEvent(input.eventId)),
    addEvidenceToEvent: adminProcedure2.input(z2.object({ eventId: z2.number(), evidenceId: z2.number(), displayOrder: z2.number().default(0) })).mutation(({ input }) => addEvidenceToEvent(input.eventId, input.evidenceId, input.displayOrder)),
    removeEvidenceFromEvent: adminProcedure2.input(z2.object({ eventId: z2.number(), evidenceId: z2.number() })).mutation(({ input }) => removeEvidenceFromEvent(input.eventId, input.evidenceId)),
    // Admin Settings (logo, favicon, etc.)
    getAdminSettings: adminProcedure2.query(() => getAdminSettings()),
    updateAdminSetting: adminProcedure2.input(z2.object({ key: z2.string(), value: z2.string() })).mutation(({ input }) => updateAdminSetting(input.key, input.value)),
    uploadAdminLogo: adminProcedure2.input(z2.object({ imageData: z2.string() })).mutation(({ input }) => uploadAdminLogo(input.imageData)),
    uploadFavicon: adminProcedure2.input(z2.object({ imageData: z2.string() })).mutation(({ input }) => uploadFavicon(input.imageData)),
    changeAdminPassword: adminProcedure2.input(z2.object({ currentPassword: z2.string(), newPassword: z2.string() })).mutation(async ({ input, ctx }) => {
      const sessionCookie = ctx.req.cookies?.["admin_session"];
      if (!sessionCookie) throw new TRPCError3({ code: "UNAUTHORIZED", message: "Not logged in" });
      try {
        const session = JSON.parse(sessionCookie);
        return changeAdminPassword(session.id, input.currentPassword, input.newPassword);
      } catch (error) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: error.message || "Failed to change password" });
      }
    })
  })
});

// server/_core/context.ts
var ADMIN_SESSION_COOKIE2 = "admin_session";
var DEV_ADMIN_USER = {
  id: 1,
  openId: "dev-admin-user",
  name: "Dev Admin",
  email: "admin@localhost",
  loginMethod: "dev",
  role: "admin",
  createdAt: /* @__PURE__ */ new Date(),
  updatedAt: /* @__PURE__ */ new Date(),
  lastSignedIn: /* @__PURE__ */ new Date()
};
async function createContext(opts) {
  let user = null;
  let adminSession = null;
  const adminSessionCookie = opts.req.cookies?.[ADMIN_SESSION_COOKIE2];
  if (adminSessionCookie) {
    try {
      adminSession = JSON.parse(adminSessionCookie);
      if (adminSession) {
        user = {
          id: adminSession.id,
          openId: `admin-${adminSession.id}`,
          name: adminSession.username,
          email: null,
          loginMethod: "local",
          role: "admin",
          // All admin users have admin role
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          lastSignedIn: /* @__PURE__ */ new Date()
        };
      }
    } catch (error) {
      console.error("[Auth] Failed to parse admin session cookie:", error);
    }
  }
  if (!user) {
    const isDevelopment = !ENV.isProduction;
    const isOAuthConfigured = !!ENV.oAuthServerUrl;
    const isAdminRoute = opts.req.path.includes("/admin.") || opts.req.path.includes("/siteProtection.") || opts.req.path.includes("/adminAuth.");
    if (isDevelopment && !isOAuthConfigured && isAdminRoute) {
      console.log("[Auth] Development mode: Using dev admin user for admin routes");
      user = DEV_ADMIN_USER;
    } else {
      try {
        user = await sdk.authenticateRequest(opts.req);
      } catch (error) {
        user = null;
      }
    }
  }
  return {
    req: opts.req,
    res: opts.res,
    user,
    adminSession
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
var plugins = [react(), tailwindcss()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
      ".shheercase.com"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
var envPaths = [
  path3.resolve(process.cwd(), ".env"),
  path3.resolve(process.cwd(), ".env.production"),
  path3.resolve(__dirname, "../../.env"),
  path3.resolve(__dirname, "../../.env.production")
];
console.log("[Env] Current working directory:", process.cwd());
console.log("[Env] Script directory:", __dirname);
var envLoaded = false;
for (const envPath of envPaths) {
  console.log(`[Env] Checking: ${envPath}`);
  if (fs2.existsSync(envPath)) {
    console.log(`[Env] Loading environment from: ${envPath}`);
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      console.error("[Env] Error loading .env:", result.error);
    } else {
      console.log("[Env] Successfully loaded environment variables");
      envLoaded = true;
      break;
    }
  }
}
if (!envLoaded) {
  console.log("[Env] No .env file found in checked paths, using system environment variables");
  dotenv.config();
}
console.log("[Env] DATABASE_URL exists:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const sanitized = process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@");
  console.log("[Env] DATABASE_URL (sanitized):", sanitized);
}
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
