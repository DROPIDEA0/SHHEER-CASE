import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from multiple locations for Hostinger compatibility
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.production'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../.env.production'),
];

console.log('[Env] Current working directory:', process.cwd());
console.log('[Env] Script directory:', __dirname);

let envLoaded = false;
for (const envPath of envPaths) {
  console.log(`[Env] Checking: ${envPath}`);
  if (fs.existsSync(envPath)) {
    console.log(`[Env] Loading environment from: ${envPath}`);
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      console.error('[Env] Error loading .env:', result.error);
    } else {
      console.log('[Env] Successfully loaded environment variables');
      envLoaded = true;
      break;
    }
  }
}

if (!envLoaded) {
  console.log('[Env] No .env file found in checked paths, using system environment variables');
  dotenv.config(); // Try default location anyway
}

// Log DATABASE_URL status
console.log('[Env] DATABASE_URL exists:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const sanitized = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
  console.log('[Env] DATABASE_URL (sanitized):', sanitized);
}
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
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
