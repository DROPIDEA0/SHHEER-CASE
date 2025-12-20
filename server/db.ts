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
  footerContent, InsertFooterContent,
  timelineCategories, InsertTimelineCategory,
  evidenceCategories, InsertEvidenceCategory,
  timelineEventEvidence, InsertTimelineEventEvidence
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;

// Build DATABASE_URL from individual environment variables if not set
function getDatabaseUrl(): string | null {
  // First check if DATABASE_URL is set directly
  if (process.env.DATABASE_URL) {
    console.log("[Database] Using DATABASE_URL from environment");
    return process.env.DATABASE_URL;
  }
  
  // Otherwise, build from individual variables
  const host = process.env.DB_HOST || '127.0.0.1';
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT || '3306';
  
  if (user && password && database) {
    const url = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
    console.log("[Database] Built DATABASE_URL from individual variables");
    console.log(`[Database] Host: ${host}, User: ${user}, Database: ${database}`);
    return url;
  }
  
  console.warn("[Database] No database configuration found");
  console.warn("[Database] Set DATABASE_URL or (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)");
  return null;
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (_db) return _db;
  
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    console.warn("[Database] Cannot connect: no database URL configured");
    return null;
  }
  
  try {
    console.log("[Database] Attempting to connect...");
    
    // Create a connection pool for better reliability
    _pool = mysql.createPool({
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    
    // Test the connection
    const connection = await _pool.getConnection();
    console.log("[Database] Connection successful!");
    connection.release();
    
    _db = drizzle(_pool);
    return _db;
  } catch (error: any) {
    console.error("[Database] Failed to connect:", error.message);
    console.error("[Database] Error code:", error.code);
    console.error("[Database] Error errno:", error.errno);
    _db = null;
    _pool = null;
    return null;
  }
}

// Export function to check database status (for debugging)
export async function checkDatabaseStatus() {
  const dbUrl = getDatabaseUrl();
  const hasUrl = !!dbUrl;
  const maskedUrl = dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'NOT SET';
  
  if (!dbUrl) {
    return {
      status: 'no_config',
      hasUrl: false,
      maskedUrl: 'NOT SET',
      envVars: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        DB_HOST: !!process.env.DB_HOST,
        DB_USER: !!process.env.DB_USER,
        DB_PASSWORD: !!process.env.DB_PASSWORD,
        DB_NAME: !!process.env.DB_NAME
      }
    };
  }
  
  try {
    const connection = await mysql.createConnection(dbUrl);
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM header_content');
    await connection.end();
    
    return {
      status: 'connected',
      hasUrl: true,
      maskedUrl,
      dataCount: (rows as any)[0]?.count || 0
    };
  } catch (error: any) {
    return {
      status: 'error',
      hasUrl: true,
      maskedUrl,
      error: error.message,
      errorCode: error.code
    };
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
  return db.select().from(timelineEventEvidence)
    .where(eq(timelineEventEvidence.eventId, eventId))
    .orderBy(asc(timelineEventEvidence.displayOrder));
}

export async function linkEvidenceToEvent(data: InsertTimelineEventEvidence) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(timelineEventEvidence).values(data);
  return data;
}

export async function unlinkEvidenceFromEvent(eventId: number, evidenceId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(timelineEventEvidence)
    .where(eq(timelineEventEvidence.eventId, eventId));
  return true;
}

export async function getEvidenceForEvent(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db.select().from(timelineEventEvidence)
    .where(eq(timelineEventEvidence.eventId, eventId))
    .orderBy(asc(timelineEventEvidence.displayOrder));
  
  const evidenceIds = links.map(l => l.evidenceId);
  if (evidenceIds.length === 0) return [];
  
  const items = await db.select().from(evidenceItems);
  return items.filter(item => evidenceIds.includes(item.id));
}
