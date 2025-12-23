import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Server } from "http";
import { nanoid } from "nanoid";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    appType: "custom" as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    server: serverOptions,
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve("client", "index.html");
      let template = fs.readFileSync(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(url, template);

      const nonce = nanoid();
      template = template.replace(
        /<script/g,
        `<script nonce="${nonce}"`
      );

      res
        .status(200)
        .set({
          "Content-Type": "text/html",
          "Content-Security-Policy": `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval';`,
        })
        .end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, "../..", "dist", "public")
      : path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
