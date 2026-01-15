import postgres from "postgres";

export const sql = postgres(process.env.NEON_URL!, {
    database: process.env.POSTGRES_DATABASE!,
});

export default sql;
