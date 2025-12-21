import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { ENV } from "./env";

// Admin session cookie name
const ADMIN_SESSION_COOKIE = 'admin_session';

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  adminSession: { id: number; username: string; role: string } | null;
};

// Development mode admin user for local testing
const DEV_ADMIN_USER: User = {
  id: 1,
  openId: "dev-admin-user",
  name: "Dev Admin",
  email: "admin@localhost",
  loginMethod: "dev",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let adminSession: { id: number; username: string; role: string } | null = null;

  // Check for admin session cookie first
  const adminSessionCookie = opts.req.cookies?.[ADMIN_SESSION_COOKIE];
  if (adminSessionCookie) {
    try {
      adminSession = JSON.parse(adminSessionCookie);
      // Create a user object from admin session for compatibility
      if (adminSession) {
        user = {
          id: adminSession.id,
          openId: `admin-${adminSession.id}`,
          name: adminSession.username,
          email: null,
          loginMethod: "local",
          role: "admin", // All admin users have admin role
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };
      }
    } catch (error) {
      console.error("[Auth] Failed to parse admin session cookie:", error);
    }
  }

  // If no admin session, try OAuth authentication
  if (!user) {
    // In development mode without OAuth configured, use dev admin user for admin routes
    const isDevelopment = !ENV.isProduction;
    const isOAuthConfigured = !!ENV.oAuthServerUrl;
    const isAdminRoute = opts.req.path.includes('/admin.') || opts.req.path.includes('/siteProtection.') || opts.req.path.includes('/adminAuth.');

    if (isDevelopment && !isOAuthConfigured && isAdminRoute) {
      console.log("[Auth] Development mode: Using dev admin user for admin routes");
      user = DEV_ADMIN_USER;
    } else {
      try {
        user = await sdk.authenticateRequest(opts.req);
      } catch (error) {
        // Authentication is optional for public procedures.
        user = null;
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    adminSession,
  };
}
