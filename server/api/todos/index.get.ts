import db from "~~/lib/db";

export default defineEventHandler(async (_event) => {
    try {
        const todos = await db.query.testTableInTest.findMany();
        return todos;
    }
    catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : String(error),
        });
    }
});
