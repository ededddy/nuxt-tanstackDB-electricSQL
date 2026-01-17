import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    out: "./lib/db/",
    dbCredentials: {
        url: process.env.NEON_URL!,
        database: process.env.POSTGRES_DATABASE!,
    },
    schema: ["./lib/db/schema.ts", "./lib/db/auth-schema.ts"],
    schemaFilter: ["test"],
});
