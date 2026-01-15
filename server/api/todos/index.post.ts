import { validateInsertTodo } from "~~/lib/db/validation";
import { sql } from "~~/lib/db/postgres";
import generateTxId from "~~/server/utils/generateTxId";
import type { Txid } from "@tanstack/electric-db-collection";

export default defineEventHandler(async (event) => {
    try {
        const body = readBody(event);
        const todoData = validateInsertTodo(body);

        let txid!: Txid;
        const newTodo = await sql.begin(async (tx) => {
            txid = await generateTxId(tx);
            const result = await tx`INSERT INTO test.test_table ${tx(todoData)} RETURNING *`;
            return result;
        });

        return {
            todo: newTodo, txid,
        };
    }
    catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : String(error),
        });
    }
});
