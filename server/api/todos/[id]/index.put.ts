import { sql } from "~~/lib/db/postgres";
import generateTxId from "~~/server/utils/generateTxId";
import type { Txid } from "@tanstack/electric-db-collection";
import { validateUpdateTodo } from "~~/lib/db/validation";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");
        const body = readBody(event);
        const updateTodo = validateUpdateTodo(body);

        let txid!: Txid;
        const updatedTodo = await sql.begin(async (tx) => {
            txid = await generateTxId(tx);

            const [result] = await tx`
                UPDATE test.test_table
                SET ${tx(updateTodo)}
                WHERE id = ${id}
                RETURNING id
            `;

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
            statusMessage: error instanceof Error ? error.message : String(error),
        });
    }
});
