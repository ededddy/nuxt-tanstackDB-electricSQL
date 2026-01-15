import db from "~~/lib/db";
import { testTableInTest } from "~~/lib/db/schema";
import generateTxId from "~~/server/utils/generateTxId";
import type { Txid } from "@tanstack/electric-db-collection";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");

        let txid!: Txid;

        await db.transaction(async (tx) => {
            txid = await generateTxId(tx);

            const [result] = await tx.delete(testTableInTest)
                .where(
                    eq(testTableInTest.id, parseInt(id!)),
                ).returning({ id: testTableInTest.id });

            if (!result) {
                throw new Error(`Todo with id ${id} not found`);
            }
        });

        return { success: true, txid };
    }
    catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : String(error),
        });
    }
});
