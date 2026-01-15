import { sql } from "~~/lib/db/postgres";
import generateTxId from "~~/server/utils/generateTxId";
import type { Txid } from "@tanstack/electric-db-collection";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");

        let txid!: Txid;
        await sql.begin(async (tx) => {
            txid = await generateTxId(tx);

            const [result] = await tx`
                DELETE FROM test.test_table
                WHERE id = ${id}
                RETURNING id
            `;

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
