import type { Txid } from "@tanstack/electric-db-collection";
import { eq } from "drizzle-orm";
import db from "~~/lib/db";
import { testTableInTest } from "~~/lib/db/schema";
import { validateUpdateTodo } from "~~/lib/db/validation";
import generateTxId from "~~/server/utils/generateTxId";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    const updateTodo = validateUpdateTodo(body);

    try {
        let txid!: Txid;
        const updatedTodo = await db.transaction(async (tx) => {
            txid = await generateTxId(tx);

            const [result] = await tx
                .update(testTableInTest)
                .set(updateTodo)
                .where(
                    eq(testTableInTest.id, parseInt(id!)),
                ).returning({ id: testTableInTest.id });

            if (!result) {
                throw new Error(`Todo with id ${id} not found`);
            }

            return result;
        });

        return { todo: updatedTodo, txid };
    }
    catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal server error",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
