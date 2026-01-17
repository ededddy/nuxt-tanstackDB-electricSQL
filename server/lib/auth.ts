import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "~~/lib/db";
import * as authSchema from "~~/lib/db/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema, // NOTE: point to your auth schema otherwise defaults to use `public` schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    /* NOTE: these are defaults no need to set
     * baseUrl: process.env.BETTER_AUTH_URL,
     * secret: process.env.BETTER_AUTH_SECRET,
     * basePath: "/api/auth",
    */
});
