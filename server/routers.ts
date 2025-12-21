import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Admin session cookie name
const ADMIN_SESSION_COOKIE = 'admin_session';
const SITE_ACCESS_COOKIE = 'site_access';

export const appRouter = router({
  system: systemRouter,
  
  // ============ ADMIN AUTH API ============
  adminAuth: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.verifyAdminPassword(input.username, input.password);
        if (!user) {
          return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
        }
        
        // Set admin session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(ADMIN_SESSION_COOKIE, JSON.stringify({ id: user.id, username: user.username, role: user.role }), {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
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
    
    getAdminUsers: adminProcedure.query(() => db.getAdminUsers()),
    
    createAdminUser: adminProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        role: z.enum(['super_admin', 'admin', 'editor', 'viewer']).default('editor'),
        isActive: z.boolean().default(true),
      }))
      .mutation(({ input }) => db.createAdminUser(input)),
    
    updateAdminUser: adminProcedure
      .input(z.object({
        id: z.number(),
        username: z.string().optional(),
        password: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        role: z.enum(['super_admin', 'admin', 'editor', 'viewer']).optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(({ input }) => db.updateAdminUser(input.id, input)),
    
    deleteAdminUser: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteAdminUser(input.id)),
  }),

  // ============ SITE PROTECTION API ============
  siteProtection: router({
    getSettings: publicProcedure.query(() => db.getSiteProtection()),
    
    updateSettings: adminProcedure
      .input(z.object({
        isEnabled: z.boolean().optional(),
        message: z.string().optional(),
      }))
      .mutation(({ input }) => db.upsertSiteProtection(input)),
    
    getAccessUsers: adminProcedure.query(() => db.getSiteAccessUsers()),
    
    createAccessUser: adminProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
        name: z.string().optional(),
        isActive: z.boolean().default(true),
      }))
      .mutation(({ input }) => db.createSiteAccessUser(input)),
    
    updateAccessUser: adminProcedure
      .input(z.object({
        id: z.number(),
        username: z.string().optional(),
        password: z.string().optional(),
        name: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(({ input }) => db.updateSiteAccessUser(input.id, input)),
    
    deleteAccessUser: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteSiteAccessUser(input.id)),
    
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.verifySiteAccessPassword(input.username, input.password);
        if (!user) {
          return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
        }
        
        // Set site access cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(SITE_ACCESS_COOKIE, JSON.stringify({ id: user.id, username: user.username }), {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    }),
  }),

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ DIAGNOSTICS API ============
  diagnostics: router({
    dbStatus: publicProcedure.query(async () => {
      const envCheck = {
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
        DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + '...' || 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
        // Separate DB variables
        DB_HOST: process.env.DB_HOST || 'NOT_SET',
        DB_PORT: process.env.DB_PORT || '3306',
        DB_USER_EXISTS: !!process.env.DB_USER,
        DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME || 'NOT_SET',
        // Working directory info
        CWD: process.cwd(),
      };
      
      let dbConnection = {
        status: 'unknown' as string,
        error: null as string | null,
        tableCount: 0,
      };
      
      try {
        const dbInstance = await db.getDb();
        if (dbInstance) {
          // Try a simple query to test connection
          const testResult = await db.getSiteSettings();
          dbConnection.status = 'connected';
          dbConnection.tableCount = Array.isArray(testResult) ? testResult.length : 0;
        } else {
          dbConnection.status = 'no_db_instance';
          dbConnection.error = 'getDb() returned null - check server logs for detailed error';
        }
      } catch (error: any) {
        dbConnection.status = 'error';
        dbConnection.error = error?.message || String(error);
        // Add more error details
        if (error?.code) {
          dbConnection.error += ` (Code: ${error.code})`;
        }
        if (error?.errno) {
          dbConnection.error += ` (Errno: ${error.errno})`;
        }
      }
      
      return {
        timestamp: new Date().toISOString(),
        environment: envCheck,
        dbUrl: {
          exists: !!process.env.DATABASE_URL,
          length: process.env.DATABASE_URL?.length || 0,
          prefix: process.env.DATABASE_URL?.substring(0, 30) + '...' || 'NOT_SET',
        },
        database: dbConnection,
      };
    }),
    
    // Direct connection test with detailed error
    testConnection: publicProcedure.query(async () => {
      const mysql = await import('mysql2/promise');
      
      const dbUrl = process.env.DATABASE_URL;
      const host = process.env.DB_HOST || 'localhost';
      const port = parseInt(process.env.DB_PORT || '3306');
      const user = process.env.DB_USER;
      const password = process.env.DB_PASSWORD;
      const database = process.env.DB_NAME;
      
      const result: any = {
        timestamp: new Date().toISOString(),
        config: {
          host,
          port,
          user: user ? user.substring(0, 5) + '...' : 'NOT_SET',
          database: database || 'NOT_SET',
          hasPassword: !!password,
          passwordLength: password?.length || 0,
        },
        connection: {
          status: 'unknown',
          error: null,
        },
      };
      
      try {
        // Try direct connection with separate variables
        if (host && user && password && database) {
          const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            database,
            connectTimeout: 10000,
          });
          
          // Test query
          const [rows] = await connection.execute('SELECT 1 as test');
          result.connection.status = 'connected';
          result.connection.testQuery = rows;
          
          await connection.end();
        } else {
          result.connection.status = 'missing_config';
          result.connection.error = 'Missing required database configuration';
        }
      } catch (error: any) {
        result.connection.status = 'error';
        result.connection.error = error?.message || String(error);
        result.connection.code = error?.code;
        result.connection.errno = error?.errno;
        result.connection.sqlState = error?.sqlState;
      }
      
      return result;
    }),
  }),

  // ============ PUBLIC CONTENT API ============
  public: router({
    getHeaderContent: publicProcedure.query(() => db.getHeaderContent()),
    getHeroSection: publicProcedure.query(() => db.getHeroSection()),
    getOverviewParties: publicProcedure.query(() => db.getOverviewParties()),
    getCaseElements: publicProcedure.query(() => db.getCaseElements()),
    getCaseStructure: publicProcedure.query(() => db.getCaseStructure()),
    getTimelineEvents: publicProcedure.query(() => db.getTimelineEvents()),
    getEvidenceItems: publicProcedure.query(() => db.getEvidenceItems()),
    getVideos: publicProcedure.query(() => db.getVideos()),
    getFooterContent: publicProcedure.query(() => db.getFooterContent()),
    getSiteSettings: publicProcedure.query(() => db.getSiteSettings()),
    getTimelineCategories: publicProcedure.query(() => db.getTimelineCategories()),
    getEvidenceCategories: publicProcedure.query(() => db.getEvidenceCategories()),
    getEventEvidence: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(({ input }) => db.getEvidenceForEvent(input.eventId)),
  }),

  // ============ ADMIN API ============
  admin: router({
    getStats: adminProcedure.query(async () => {
      const [timeline, evidence, videos, parties] = await Promise.all([
        db.getTimelineEvents(),
        db.getEvidenceItems(),
        db.getVideos(),
        db.getOverviewParties(),
      ]);
      return {
        timelineCount: timeline.length,
        evidenceCount: evidence.length,
        videoCount: videos.length,
        partyCount: parties.length,
      };
    }),

    getSiteSettings: adminProcedure.query(() => db.getSiteSettings()),
    upsertSiteSetting: adminProcedure
      .input(z.object({ key: z.string(), value: z.string().nullable(), type: z.string().default("text") }))
      .mutation(({ input }) => db.upsertSiteSetting(input)),

    getHeaderContent: adminProcedure.query(() => db.getHeaderContent()),
    upsertHeaderContent: adminProcedure
      .input(z.object({ logoUrl: z.string().nullable().optional(), siteName: z.string().nullable().optional(), siteSubtitle: z.string().nullable().optional(), navItems: z.any().optional() }))
      .mutation(({ input }) => db.upsertHeaderContent(input)),

    getHeroSection: adminProcedure.query(() => db.getHeroSection()),
    upsertHeroSection: adminProcedure
      .input(z.object({ title: z.string().nullable().optional(), titleHighlight: z.string().nullable().optional(), subtitle: z.string().nullable().optional(), description: z.string().nullable().optional(), guaranteeRef: z.string().nullable().optional(), dealValue: z.string().nullable().optional(), criticalPeriod: z.string().nullable().optional(), ctaText: z.string().nullable().optional(), ctaLink: z.string().nullable().optional() }))
      .mutation(({ input }) => db.upsertHeroSection(input)),

    getOverviewParties: adminProcedure.query(() => db.getOverviewParties()),
    createOverviewParty: adminProcedure
      .input(z.object({ partyType: z.enum(["plaintiff", "defendant", "third_party"]), name: z.string(), label: z.string().nullable().optional(), representative: z.string().nullable().optional(), role: z.string().nullable().optional(), additionalInfo: z.string().nullable().optional(), displayOrder: z.number().default(0) }))
      .mutation(({ input }) => db.createOverviewParty(input)),
    updateOverviewParty: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ partyType: z.enum(["plaintiff", "defendant", "third_party"]).optional(), name: z.string().optional(), label: z.string().nullable().optional(), representative: z.string().nullable().optional(), role: z.string().nullable().optional(), additionalInfo: z.string().nullable().optional(), displayOrder: z.number().optional() }) }))
      .mutation(({ input }) => db.updateOverviewParty(input.id, input.data)),
    deleteOverviewParty: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteOverviewParty(input.id)),

    getCaseElements: adminProcedure.query(() => db.getCaseElements()),
    createCaseElement: adminProcedure
      .input(z.object({ title: z.string(), icon: z.string().nullable().optional(), items: z.any().optional(), displayOrder: z.number().default(0) }))
      .mutation(({ input }) => db.createCaseElement(input)),
    updateCaseElement: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ title: z.string().optional(), icon: z.string().nullable().optional(), items: z.any().optional(), displayOrder: z.number().optional() }) }))
      .mutation(({ input }) => db.updateCaseElement(input.id, input.data)),
    deleteCaseElement: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCaseElement(input.id)),

    getCaseStructure: adminProcedure.query(() => db.getCaseStructure()),
    createCaseStructureItem: adminProcedure
      .input(z.object({ sectionNumber: z.number(), title: z.string(), description: z.string().nullable().optional(), displayOrder: z.number().default(0) }))
      .mutation(({ input }) => db.createCaseStructureItem(input)),
    updateCaseStructureItem: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ sectionNumber: z.number().optional(), title: z.string().optional(), description: z.string().nullable().optional(), displayOrder: z.number().optional() }) }))
      .mutation(({ input }) => db.updateCaseStructureItem(input.id, input.data)),
    deleteCaseStructureItem: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteCaseStructureItem(input.id)),

    getTimelineEvents: adminProcedure.query(() => db.getTimelineEvents()),
    createTimelineEvent: adminProcedure
      .input(z.object({ date: z.string(), time: z.string().nullable().optional(), title: z.string(), description: z.string().nullable().optional(), category: z.string(), customColor: z.string().nullable().optional(), customBgColor: z.string().nullable().optional(), customTextColor: z.string().nullable().optional(), displayOrder: z.number().default(0), isActive: z.boolean().default(true) }))
      .mutation(({ input }) => db.createTimelineEvent(input as any)),
    updateTimelineEvent: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ date: z.string().optional(), time: z.string().nullable().optional(), title: z.string().optional(), description: z.string().nullable().optional(), category: z.string().optional(), customColor: z.string().nullable().optional(), customBgColor: z.string().nullable().optional(), customTextColor: z.string().nullable().optional(), displayOrder: z.number().optional(), isActive: z.boolean().optional() }) }))
      .mutation(({ input }) => db.updateTimelineEvent(input.id, input.data as any)),
    deleteTimelineEvent: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTimelineEvent(input.id)),

    getEvidenceItems: adminProcedure.query(() => db.getEvidenceItems()),
    createEvidenceItem: adminProcedure
      .input(z.object({ title: z.string(), description: z.string().nullable().optional(), category: z.string(), fileUrl: z.string().nullable().optional(), fileName: z.string().nullable().optional(), fileType: z.string().nullable().optional(), thumbnailUrl: z.string().nullable().optional(), eventId: z.number().nullable().optional(), displayOrder: z.number().default(0), isActive: z.boolean().default(true) }))
      .mutation(({ input }) => db.createEvidenceItem(input as any)),
    updateEvidenceItem: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ title: z.string().optional(), description: z.string().nullable().optional(), category: z.string().optional(), fileUrl: z.string().nullable().optional(), fileName: z.string().nullable().optional(), fileType: z.string().nullable().optional(), thumbnailUrl: z.string().nullable().optional(), eventId: z.number().nullable().optional(), displayOrder: z.number().optional(), isActive: z.boolean().optional() }) }))
      .mutation(({ input }) => db.updateEvidenceItem(input.id, input.data as any)),
    deleteEvidenceItem: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteEvidenceItem(input.id)),

    getVideos: adminProcedure.query(() => db.getVideos()),
    createVideo: adminProcedure
      .input(z.object({ title: z.string(), description: z.string().nullable().optional(), videoUrl: z.string(), thumbnailUrl: z.string().nullable().optional(), duration: z.string().nullable().optional(), displayOrder: z.number().default(0), isActive: z.boolean().default(true) }))
      .mutation(({ input }) => db.createVideo(input)),
    updateVideo: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ title: z.string().optional(), description: z.string().nullable().optional(), videoUrl: z.string().optional(), thumbnailUrl: z.string().nullable().optional(), duration: z.string().nullable().optional(), displayOrder: z.number().optional(), isActive: z.boolean().optional() }) }))
      .mutation(({ input }) => db.updateVideo(input.id, input.data)),
    deleteVideo: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteVideo(input.id)),

    getFooterContent: adminProcedure.query(() => db.getFooterContent()),
    upsertFooterContent: adminProcedure
      .input(z.object({ companyName: z.string().nullable().optional(), companySubtitle: z.string().nullable().optional(), aboutText: z.string().nullable().optional(), quickLinks: z.any().optional(), contactAddress: z.string().nullable().optional(), contactPhone: z.string().nullable().optional(), contactWebsite: z.string().nullable().optional(), legalDisclaimer: z.string().nullable().optional(), commercialReg: z.string().nullable().optional() }))
      .mutation(({ input }) => db.upsertFooterContent(input)),

    uploadFile: adminProcedure
      .input(z.object({ fileName: z.string(), fileData: z.string(), contentType: z.string() }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `evidence/${Date.now()}-${input.fileName}`;
        const result = await storagePut(fileKey, buffer, input.contentType);
        return result;
      }),

    uploadVideo: adminProcedure
      .input(z.object({ fileName: z.string(), fileData: z.string(), contentType: z.string() }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `videos/${Date.now()}-${input.fileName}`;
        const result = await storagePut(fileKey, buffer, input.contentType);
        return result;
      }),

    // Timeline Categories
    getTimelineCategories: adminProcedure.query(() => db.getTimelineCategories()),
    createTimelineCategory: adminProcedure
      .input(z.object({ key: z.string(), label: z.string(), color: z.string().optional(), bgColor: z.string().optional(), textColor: z.string().optional(), lightColor: z.string().optional(), displayOrder: z.number().default(0), isActive: z.boolean().default(true) }))
      .mutation(({ input }) => db.createTimelineCategory(input)),
    updateTimelineCategory: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ key: z.string().optional(), label: z.string().optional(), color: z.string().optional(), bgColor: z.string().optional(), textColor: z.string().optional(), lightColor: z.string().optional(), displayOrder: z.number().optional(), isActive: z.boolean().optional() }) }))
      .mutation(({ input }) => db.updateTimelineCategory(input.id, input.data)),
    deleteTimelineCategory: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTimelineCategory(input.id)),

    // Evidence Categories
    getEvidenceCategories: adminProcedure.query(() => db.getEvidenceCategories()),
    createEvidenceCategory: adminProcedure
      .input(z.object({ key: z.string(), label: z.string(), color: z.string().optional(), icon: z.string().optional(), displayOrder: z.number().default(0), isActive: z.boolean().default(true) }))
      .mutation(({ input }) => db.createEvidenceCategory(input)),
    updateEvidenceCategory: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ key: z.string().optional(), label: z.string().optional(), color: z.string().optional(), icon: z.string().optional(), displayOrder: z.number().optional(), isActive: z.boolean().optional() }) }))
      .mutation(({ input }) => db.updateEvidenceCategory(input.id, input.data)),
    deleteEvidenceCategory: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteEvidenceCategory(input.id)),

    // Timeline Event Evidence (linking evidence to events)
    getEventEvidence: adminProcedure
      .input(z.object({ eventId: z.number() }))
      .query(({ input }) => db.getEvidenceForEvent(input.eventId)),
    addEvidenceToEvent: adminProcedure
      .input(z.object({ eventId: z.number(), evidenceId: z.number(), displayOrder: z.number().default(0) }))
      .mutation(({ input }) => db.addEvidenceToEvent(input.eventId, input.evidenceId, input.displayOrder)),
    removeEvidenceFromEvent: adminProcedure
      .input(z.object({ eventId: z.number(), evidenceId: z.number() }))
      .mutation(({ input }) => db.removeEvidenceFromEvent(input.eventId, input.evidenceId)),

    // Admin Settings (logo, favicon, etc.)
    getAdminSettings: adminProcedure.query(() => db.getAdminSettings()),
    updateAdminSetting: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(({ input }) => db.updateAdminSetting(input.key, input.value)),
    uploadAdminLogo: adminProcedure
      .input(z.object({ imageData: z.string() }))
      .mutation(({ input }) => db.uploadAdminLogo(input.imageData)),
    uploadFavicon: adminProcedure
      .input(z.object({ imageData: z.string() }))
      .mutation(({ input }) => db.uploadFavicon(input.imageData)),
    changeAdminPassword: adminProcedure
      .input(z.object({ currentPassword: z.string(), newPassword: z.string() }))
      .mutation(async ({ input, ctx }) => {
        // Get admin ID from session cookie
        const sessionCookie = ctx.req.cookies?.['admin_session'];
        if (!sessionCookie) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' });
        try {
          const session = JSON.parse(sessionCookie);
          return db.changeAdminPassword(session.id, input.currentPassword, input.newPassword);
        } catch (error: any) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: error.message || 'Failed to change password' });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
