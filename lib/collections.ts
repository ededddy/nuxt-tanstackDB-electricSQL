import { createCollection } from "@tanstack/vue-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { todoSchema } from "./schema";

// This alone does not show existing data?
export const todosCollection = createCollection(
    electricCollectionOptions({
        shapeOptions: {
            url: `http://localhost:3000/api/electric`,
            params: {
                table: "test.test_table",
            },
            parser: {
                timestampz: (data: string) => new Date(data),
            },
            onError: (error) => {
                console.error(error);
            },
        },
        schema: todoSchema,
        getKey: item => item.id,
    }),
);
