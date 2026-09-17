import { config as loadEnv } from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// `import "dotenv/config"` only loads a file literally named `.env`.
// This project follows Next.js convention and keeps secrets in
// `.env.local`, so we load env files explicitly here — `.env` first
// (if present), then `.env.local` overriding it — same precedence
// Next.js itself uses for the app.
loadEnv({ path: path.join(process.cwd(), ".env") });
loadEnv({ path: path.join(process.cwd(), ".env.local"), override: true });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
