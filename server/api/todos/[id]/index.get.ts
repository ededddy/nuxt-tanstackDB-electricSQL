import { sql } from "~~/lib/db/postgres";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");
        const [todo] = await sql`select * from test.test_table where id = ${id!}`;

        if (!todo) {
            throw createError({
                statusCode: 404,
                statusMessage: "Todo Not found",
            });
        }

        return todo;
    }
    catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : String(error),
        });
    }
});
