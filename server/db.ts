import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { 
  InsertUser, users,
  siteSettings, InsertSiteSetting,
  headerContent, InsertHeaderContent,
  heroSection, InsertHeroSection,
  overviewParties, InsertOverviewParty,
  caseElements, InsertCaseElement,
  caseStructure, InsertCaseStructureItem,
  timelineEvents, InsertTimelineEvent,
  evidenceItems, InsertEvidenceItem,
  videos, InsertVideo,
  officialDocuments, InsertOfficialDocument,
  footerContent, InsertFooterContent,
  timelineCategories, InsertTimelineCategory,
  evidenceCategories, InsertEvidenceCategory,
  timelineEventEvidence, InsertTimelineEventEvidence,
  adminUsers, siteAccessUsers, siteProtection, adminSettings,
  whatsappSettings, InsertWhatsAppSetting,
  socialMedia, InsertSocialMedia
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _connectionPool: mysql.Pool | null = null;

// Log database connection status at startup
console.log("[Database] Initializing...");
console.log("[Database] DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("[Database] DB_HOST exists:", !!process.env.DB_HOST);
console.log("[Database] DB_USER exists:", !!process.env.DB_USER);
console.log("[Database] DB_NAME exists:", !!process.env.DB_NAME);
if (process.env.DATABASE_URL) {
  // Log sanitized URL (hide password)
  const sanitizedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
  console.log("[Database] DATABASE_URL (sanitized):", sanitizedUrl);
}

// Build DATABASE_URL from separate variables if not set
function buildDatabaseUrl(): string | null {
  // First try DATABASE_URL
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Then try separate variables
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '3306';
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

// Parse DATABASE_URL and create connection with explicit options
function parseDbUrl(url: string) {
  try {
    const dbUrl = new URL(url);
    
    // Extract database name (remove query string if present)
    let database = dbUrl.pathname.slice(1); // Remove leading /
    if (database.includes('?')) {
      database = database.split('?')[0];
    }
    
    // Check for SSL in query params
    const sslParam = dbUrl.searchParams.get('ssl');
    let ssl: any = undefined;
    if (sslParam) {
      try {
        ssl = JSON.parse(sslParam);
      } catch {
        // If not JSON, treat as boolean
        ssl = sslParam === 'true' ? { rejectUnauthorized: true } : undefined;
      }
    }
    
    return {
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      database,
      ssl,
    };
  } catch (error) {
    console.error("[Database] Failed to parse DATABASE_URL:", error);
    return null;
  }
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (_db) return _db;
  

  
  const dbUrl = buildDatabaseUrl();
  if (!dbUrl) {
    console.warn("[Database] No database configuration found (neither DATABASE_URL nor DB_HOST/DB_USER/DB_PASSWORD/DB_NAME)");
    return null;
  }
  
  try {
    console.log("[Database] Attempting connection...");
    
    // Try parsing the URL and connecting with explicit options
    const config = parseDbUrl(dbUrl);
    if (!config) {
      console.error("[Database] Invalid DATABASE_URL format");
      return null;
    }
    
    console.log("[Database] Connecting to:", config.host + ":" + config.port);
    console.log("[Database] Database name:", config.database);
    console.log("[Database] User:", config.user);
    
    // Create a connection pool with explicit settings
    const poolConfig: mysql.PoolOptions = {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000, // 30 seconds
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    };
    
    // Add SSL if specified
    if (config.ssl) {
      poolConfig.ssl = config.ssl;
      console.log("[Database] SSL enabled:", JSON.stringify(config.ssl));
    }
    
    _connectionPool = mysql.createPool(poolConfig);
    
    // Test the connection
    const testConnection = await _connectionPool.getConnection();
    console.log("[Database] Connection test successful!");
    testConnection.release();
    
    // Create drizzle instance with the pool
    _db = drizzle({ client: _connectionPool }) as any;
    console.log("[Database] Drizzle instance created successfully");
    
    return _db;
  } catch (error: any) {
    console.error("[Database] Connection failed:", error?.message || error);
    console.error("[Database] Error code:", error?.code);
    console.error("[Database] Error errno:", error?.errno);
    _db = null;
    return null;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ SITE SETTINGS ============
export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}

export async function getSiteSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0] || null;
}

export async function upsertSiteSetting(data: InsertSiteSetting) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(siteSettings).values(data).onDuplicateKeyUpdate({
    set: { value: data.value, type: data.type }
  });
  return getSiteSetting(data.key);
}

// ============ HEADER CONTENT ============
export async function getHeaderContent() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(headerContent).limit(1);
  return result[0] || null;
}

export async function upsertHeaderContent(data: InsertHeaderContent) {
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

// ============ HERO SECTION ============
export async function getHeroSection() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(heroSection).limit(1);
  return result[0] || null;
}

export async function upsertHeroSection(data: InsertHeroSection) {
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

// ============ OVERVIEW PARTIES ============
export async function getOverviewParties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(overviewParties).orderBy(asc(overviewParties.displayOrder));
}

export async function getOverviewParty(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(overviewParties).where(eq(overviewParties.id, id)).limit(1);
  return result[0] || null;
}

export async function createOverviewParty(data: InsertOverviewParty) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(overviewParties).values(data);
  return data;
}

export async function updateOverviewParty(id: number, data: Partial<InsertOverviewParty>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(overviewParties).set(data).where(eq(overviewParties.id, id));
  return getOverviewParty(id);
}

export async function deleteOverviewParty(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(overviewParties).where(eq(overviewParties.id, id));
  return true;
}

// ============ CASE ELEMENTS ============
export async function getCaseElements() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseElements).orderBy(asc(caseElements.displayOrder));
}

export async function getCaseElement(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(caseElements).where(eq(caseElements.id, id)).limit(1);
  return result[0] || null;
}

export async function createCaseElement(data: InsertCaseElement) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(caseElements).values(data);
  return data;
}

export async function updateCaseElement(id: number, data: Partial<InsertCaseElement>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(caseElements).set(data).where(eq(caseElements.id, id));
  return getCaseElement(id);
}

export async function deleteCaseElement(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(caseElements).where(eq(caseElements.id, id));
  return true;
}

// ============ CASE STRUCTURE ============
export async function getCaseStructure() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStructure).orderBy(asc(caseStructure.sectionNumber));
}

export async function getCaseStructureItem(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(caseStructure).where(eq(caseStructure.id, id)).limit(1);
  return result[0] || null;
}

export async function createCaseStructureItem(data: InsertCaseStructureItem) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(caseStructure).values(data);
  return data;
}

export async function updateCaseStructureItem(id: number, data: Partial<InsertCaseStructureItem>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(caseStructure).set(data).where(eq(caseStructure.id, id));
  return getCaseStructureItem(id);
}

export async function deleteCaseStructureItem(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(caseStructure).where(eq(caseStructure.id, id));
  return true;
}

// ============ TIMELINE EVENTS ============
export async function getTimelineEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timelineEvents).orderBy(asc(timelineEvents.displayOrder));
}

export async function getTimelineEvent(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(timelineEvents).where(eq(timelineEvents.id, id)).limit(1);
  return result[0] || null;
}

export async function createTimelineEvent(data: InsertTimelineEvent) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(timelineEvents).values(data);
  return data;
}

export async function updateTimelineEvent(id: number, data: Partial<InsertTimelineEvent>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(timelineEvents).set(data).where(eq(timelineEvents.id, id));
  return getTimelineEvent(id);
}

export async function deleteTimelineEvent(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
  return true;
}

// ============ EVIDENCE ITEMS ============
export async function getEvidenceItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(evidenceItems).orderBy(asc(evidenceItems.displayOrder));
}

export async function getEvidenceItem(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(evidenceItems).where(eq(evidenceItems.id, id)).limit(1);
  return result[0] || null;
}

export async function createEvidenceItem(data: InsertEvidenceItem) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(evidenceItems).values(data);
  return data;
}

export async function updateEvidenceItem(id: number, data: Partial<InsertEvidenceItem>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(evidenceItems).set(data).where(eq(evidenceItems.id, id));
  return getEvidenceItem(id);
}

export async function deleteEvidenceItem(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(evidenceItems).where(eq(evidenceItems.id, id));
  return true;
}

// ============ VIDEOS ============
export async function getVideos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(videos).orderBy(asc(videos.displayOrder));
}

export async function getVideo(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return result[0] || null;
}

export async function createVideo(data: InsertVideo) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(videos).values(data);
  return data;
}

export async function updateVideo(id: number, data: Partial<InsertVideo>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(videos).set(data).where(eq(videos.id, id));
  return getVideo(id);
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(videos).where(eq(videos.id, id));
  return true;
}

// ============ OFFICIAL DOCUMENTS ============
export async function getOfficialDocuments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(officialDocuments).orderBy(asc(officialDocuments.displayOrder));
}

export async function getOfficialDocument(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(officialDocuments).where(eq(officialDocuments.id, id)).limit(1);
  return result[0] || null;
}

export async function createOfficialDocument(data: InsertOfficialDocument) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(officialDocuments).values(data);
  return data;
}

export async function updateOfficialDocument(id: number, data: Partial<InsertOfficialDocument>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(officialDocuments).set(data).where(eq(officialDocuments.id, id));
  return getOfficialDocument(id);
}

export async function deleteOfficialDocument(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(officialDocuments).where(eq(officialDocuments.id, id));
  return true;
}

// ============ FOOTER CONTENT ============
export async function getFooterContent() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(footerContent).limit(1);
  return result[0] || null;
}

export async function upsertFooterContent(data: InsertFooterContent) {
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


// ============ TIMELINE CATEGORIES ============
export async function getTimelineCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timelineCategories).orderBy(asc(timelineCategories.displayOrder));
}

export async function getTimelineCategory(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(timelineCategories).where(eq(timelineCategories.id, id)).limit(1);
  return result[0] || null;
}

export async function createTimelineCategory(data: InsertTimelineCategory) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(timelineCategories).values(data);
  return data;
}

export async function updateTimelineCategory(id: number, data: Partial<InsertTimelineCategory>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(timelineCategories).set(data).where(eq(timelineCategories.id, id));
  return getTimelineCategory(id);
}

export async function deleteTimelineCategory(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(timelineCategories).where(eq(timelineCategories.id, id));
  return true;
}

// ============ EVIDENCE CATEGORIES ============
export async function getEvidenceCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(evidenceCategories).orderBy(asc(evidenceCategories.displayOrder));
}

export async function getEvidenceCategory(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(evidenceCategories).where(eq(evidenceCategories.id, id)).limit(1);
  return result[0] || null;
}

export async function createEvidenceCategory(data: InsertEvidenceCategory) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(evidenceCategories).values(data);
  return data;
}

export async function updateEvidenceCategory(id: number, data: Partial<InsertEvidenceCategory>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(evidenceCategories).set(data).where(eq(evidenceCategories.id, id));
  return getEvidenceCategory(id);
}

export async function deleteEvidenceCategory(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(evidenceCategories).where(eq(evidenceCategories.id, id));
  return true;
}

// ============ TIMELINE EVENT EVIDENCE (Junction Table) ============
export async function getTimelineEventEvidence(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timelineEventEvidence).where(eq(timelineEventEvidence.eventId, eventId)).orderBy(asc(timelineEventEvidence.displayOrder));
}

export async function addEvidenceToEvent(eventId: number, evidenceId: number, displayOrder: number = 0) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(timelineEventEvidence).values({ eventId, evidenceId, displayOrder });
  return { eventId, evidenceId, displayOrder };
}

export async function removeEvidenceFromEvent(eventId: number, evidenceId: number) {
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

export async function getEvidenceForEvent(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get evidence IDs linked to this event
  const links = await db.select().from(timelineEventEvidence).where(eq(timelineEventEvidence.eventId, eventId)).orderBy(asc(timelineEventEvidence.displayOrder));
  
  if (links.length === 0) return [];
  
  // Get the actual evidence items
  const evidenceIds = links.map(l => l.evidenceId);
  const { inArray } = await import("drizzle-orm");
  const items = await db.select().from(evidenceItems).where(inArray(evidenceItems.id, evidenceIds));
  
  return items;
}


// ============ ADMIN USERS ============
import { adminUsers, InsertAdminUser, siteAccessUsers, InsertSiteAccessUser, siteProtection, InsertSiteProtection } from "../drizzle/schema";
import bcrypt from 'bcryptjs';

export async function getAdminUsers() {
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
    createdAt: adminUsers.createdAt,
  }).from(adminUsers);
}

export async function getAdminUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
  return result[0] || null;
}

export async function getAdminUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return result[0] || null;
}

export async function createAdminUser(data: { username: string; password: string; name?: string; email?: string; role?: 'super_admin' | 'admin' | 'editor' | 'viewer'; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return null;
  
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  await db.insert(adminUsers).values({
    username: data.username,
    password: hashedPassword,
    name: data.name || null,
    email: data.email || null,
    role: data.role || 'editor',
    isActive: data.isActive ?? true,
  });
  
  return getAdminUserByUsername(data.username);
}

export async function updateAdminUser(id: number, data: { username?: string; password?: string; name?: string; email?: string; role?: 'super_admin' | 'admin' | 'editor' | 'viewer'; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return null;
  
  const updateData: any = { ...data };
  
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else {
    delete updateData.password;
  }
  
  await db.update(adminUsers).set(updateData).where(eq(adminUsers.id, id));
  return getAdminUserById(id);
}

export async function deleteAdminUser(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  return true;
}

export async function updateAdminUserLastLogin(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(adminUsers).set({ lastLogin: new Date() }).where(eq(adminUsers.id, id));
}

export async function verifyAdminPassword(username: string, password: string) {
  console.log('[DB] verifyAdminPassword called:', { username });
  
  const user = await getAdminUserByUsername(username);
  
  if (!user) {
    console.log('[DB] User not found:', username);
    return null;
  }
  
  if (!user.isActive) {
    console.log('[DB] User is inactive:', username);
    return null;
  }
  
  console.log('[DB] User found:', { id: user.id, username: user.username, isActive: user.isActive });
  console.log('[DB] Comparing passwords...');
  
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    console.log('[DB] Password mismatch for user:', username);
    return null;
  }
  
  console.log('[DB] Password verified successfully for user:', username);
  
  await updateAdminUserLastLogin(user.id);
  return user;
}

// ============ SITE ACCESS USERS ============
export async function getSiteAccessUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: siteAccessUsers.id,
    username: siteAccessUsers.username,
    name: siteAccessUsers.name,
    isActive: siteAccessUsers.isActive,
    createdAt: siteAccessUsers.createdAt,
  }).from(siteAccessUsers);
}

export async function getSiteAccessUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteAccessUsers).where(eq(siteAccessUsers.username, username)).limit(1);
  return result[0] || null;
}

export async function getSiteAccessUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteAccessUsers).where(eq(siteAccessUsers.id, id)).limit(1);
  return result[0] || null;
}

export async function createSiteAccessUser(data: { username: string; password: string; name?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return null;
  
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  await db.insert(siteAccessUsers).values({
    username: data.username,
    password: hashedPassword,
    name: data.name || null,
    isActive: data.isActive ?? true,
  });
  
  return getSiteAccessUserByUsername(data.username);
}

export async function updateSiteAccessUser(id: number, data: { username?: string; password?: string; name?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return null;
  
  const updateData: any = { ...data };
  
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else {
    delete updateData.password;
  }
  
  await db.update(siteAccessUsers).set(updateData).where(eq(siteAccessUsers.id, id));
  return getSiteAccessUserById(id);
}

export async function deleteSiteAccessUser(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(siteAccessUsers).where(eq(siteAccessUsers.id, id));
  return true;
}

export async function verifySiteAccessPassword(username: string, password: string) {
  const user = await getSiteAccessUserByUsername(username);
  if (!user || !user.isActive) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  return user;
}

// ============ SITE PROTECTION ============
export async function getSiteProtection() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteProtection).limit(1);
  return result[0] || null;
}

export async function upsertSiteProtection(data: { isEnabled?: boolean; message?: string }) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await getSiteProtection();
  if (existing) {
    await db.update(siteProtection).set(data).where(eq(siteProtection.id, existing.id));
    return getSiteProtection();
  } else {
    await db.insert(siteProtection).values({
      isEnabled: data.isEnabled ?? false,
      message: data.message || null,
    });
    return getSiteProtection();
  }
}

// ============ ADMIN SETTINGS ============

export async function getAdminSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(adminSettings);
}

export async function getAdminSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminSettings).where(eq(adminSettings.settingKey, key)).limit(1);
  return result[0] || null;
}

export async function updateAdminSetting(key: string, value: string, type: string = 'text') {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await getAdminSetting(key);
  if (existing) {
    await db.update(adminSettings).set({ settingValue: value, settingType: type }).where(eq(adminSettings.settingKey, key));
  } else {
    await db.insert(adminSettings).values({
      settingKey: key,
      settingValue: value,
      settingType: type,
    });
  }
  return getAdminSetting(key);
}

export async function changeAdminPassword(adminId: number, currentPassword: string, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get admin user
  const result = await db.select().from(adminUsers).where(eq(adminUsers.id, adminId)).limit(1);
  const admin = result[0];
  if (!admin) throw new Error('Admin user not found');
  
  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) throw new Error('كلمة المرور الحالية غير صحيحة');
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update password
  await db.update(adminUsers).set({ password: hashedPassword }).where(eq(adminUsers.id, adminId));
  return true;
}

export async function uploadAdminLogo(imageData: string) {
  return updateAdminSetting('admin_logo', imageData, 'image');
}

export async function uploadFavicon(imageData: string) {
  return updateAdminSetting('favicon', imageData, 'image');
}

// ============ WHATSAPP SETTINGS ============
export async function getWhatsAppSettings() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(whatsappSettings).limit(1);
  return result[0] || null;
}

export async function upsertWhatsAppSettings(data: Partial<InsertWhatsAppSetting>) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await getWhatsAppSettings();
  if (existing) {
    await db.update(whatsappSettings).set(data).where(eq(whatsappSettings.id, existing.id));
  } else {
    await db.insert(whatsappSettings).values({
      isEnabled: data.isEnabled ?? false,
      phoneNumber: data.phoneNumber || '',
      message: data.message || '',
      position: data.position || 'bottom-right',
    });
  }
  return getWhatsAppSettings();
}

// ============ SOCIAL MEDIA ============
export async function getSocialMediaLinks() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(socialMedia).orderBy(socialMedia.displayOrder);
  return result;
}

export async function updateSocialMediaLink(id: number, data: Partial<InsertSocialMedia>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(socialMedia).set(data).where(eq(socialMedia.id, id));
  const result = await db.select().from(socialMedia).where(eq(socialMedia.id, id)).limit(1);
  return result[0] || null;
}
