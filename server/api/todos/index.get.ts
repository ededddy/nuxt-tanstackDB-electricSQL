import { sql } from "~~/lib/db/postgres";

export default defineEventHandler(async (event) => {
    try {
        const todos = await sql`select * from test.test_table`;

        return todos;
    }
    catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : String(error),
        });
    }
});
