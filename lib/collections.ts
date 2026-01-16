import { createCollection } from "@tanstack/vue-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { selectTodoSchema } from "./db/validation";
// import { api } from "./api";

// This alone does not show existing data?
export const todosCollection = createCollection(
    electricCollectionOptions({
        shapeOptions: {
            url: `http://localhost:3000/api/electric`,
            params: {
                table: "test.test_table",
            },
            parser: {
                timestamptz: (data: string) => new Date(data),
                timestamp: (data: string) => new Date(data),
            },
        },
        getKey: item => item.id,
        schema: selectTodoSchema,
        // onInsert: async ({ transaction }) => {
        //     const {
        //         id,
        //         created_at: _f,
        //         updated_at: _ff,
        //         ...modified
        //     } = transaction.mutations[0].modified;
        //     const response = await api.todos.create(modified);
        //     return { txid: response.txid };
        // },
        // onUpdate: async ({ transaction }) => {
        //     console.log(transaction.mutations);
        //     const txids = await Promise.all(
        //         transaction.mutations.map(async (mutation) => {
        //             const { original, changes } = mutation;
        //             if (!(`id` in original)) {
        //                 throw new Error(`Original todo not found for update`);
        //             }
        //             const response = await api.todos.update(original.id, changes);
        //             return response.txid;
        //         }),
        //     );

        //     return { txid: txids };
        // },
        // onDelete: async ({ transaction }) => {
        //     const txids = await Promise.all(
        //         transaction.mutations.map(async (mutation) => {
        //             const { original } = mutation;
        //             if (!(`id` in original)) {
        //                 throw new Error(`Original todo not found for delete`);
        //             }
        //             const response = await api.todos.delete(original.id);
        //             return response.txid;
        //         }),
        //     );
        //     return { txid: txids };
        // },
    }),
);
