import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { ENV } from "./env";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
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

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
