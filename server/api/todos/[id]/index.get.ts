import db from "~~/lib/db";
import { testTableInTest } from "~~/lib/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");

        const result = await db.select().from(testTableInTest).where(
            eq(testTableInTest.id, parseInt(id!)),
        ).limit(1);

        const todo = result[0];

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
            message: error instanceof Error ? error.message : String(error),
            statusMessage: "Internal server error",
        });
    }
});
