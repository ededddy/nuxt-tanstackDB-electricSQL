import { validateInsertTodo } from "~~/lib/db/validation";
import generateTxId from "~~/server/utils/generateTxId";
import type { Txid } from "@tanstack/electric-db-collection";
import db from "~~/lib/db";
import { testTableInTest } from "~~/lib/db/schema";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const todoData = validateInsertTodo(body);

        let txid!: Txid;

        const newTodo = await db.transaction(async (tx) => {
            txid = await generateTxId(tx);
            const result = await tx.insert(testTableInTest).values(todoData).returning();
            return result;
        });

        return {
            todo: newTodo, txid,
        };
    }
    catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : String(error),
        });
    }
});
