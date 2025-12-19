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

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
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
      .input(z.object({ date: z.string(), time: z.string().nullable().optional(), title: z.string(), description: z.string().nullable().optional(), category: z.enum(["foundation", "investment_deal", "swift_operations", "critical_failure", "legal_proceedings"]), displayOrder: z.number().default(0), isActive: z.boolean().default(true) }))
      .mutation(({ input }) => db.createTimelineEvent(input)),
    updateTimelineEvent: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ date: z.string().optional(), time: z.string().nullable().optional(), title: z.string().optional(), description: z.string().nullable().optional(), category: z.enum(["foundation", "investment_deal", "swift_operations", "critical_failure", "legal_proceedings"]).optional(), displayOrder: z.number().optional(), isActive: z.boolean().optional() }) }))
      .mutation(({ input }) => db.updateTimelineEvent(input.id, input.data)),
    deleteTimelineEvent: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => db.deleteTimelineEvent(input.id)),

    getEvidenceItems: adminProcedure.query(() => db.getEvidenceItems()),
    createEvidenceItem: adminProcedure
      .input(z.object({ title: z.string(), description: z.string().nullable().optional(), category: z.enum(["licenses", "letters", "swift", "documents", "emails", "whatsapp"]), fileUrl: z.string().nullable().optional(), fileName: z.string().nullable().optional(), fileType: z.string().nullable().optional(), thumbnailUrl: z.string().nullable().optional(), eventId: z.number().nullable().optional(), displayOrder: z.number().default(0), isActive: z.boolean().default(true) }))
      .mutation(({ input }) => db.createEvidenceItem(input)),
    updateEvidenceItem: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ title: z.string().optional(), description: z.string().nullable().optional(), category: z.enum(["licenses", "letters", "swift", "documents", "emails", "whatsapp"]).optional(), fileUrl: z.string().nullable().optional(), fileName: z.string().nullable().optional(), fileType: z.string().nullable().optional(), thumbnailUrl: z.string().nullable().optional(), eventId: z.number().nullable().optional(), displayOrder: z.number().optional(), isActive: z.boolean().optional() }) }))
      .mutation(({ input }) => db.updateEvidenceItem(input.id, input.data)),
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
  }),
});

export type AppRouter = typeof appRouter;
