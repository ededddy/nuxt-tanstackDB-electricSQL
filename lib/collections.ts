import { createCollection } from "@tanstack/vue-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { todoSchema } from "./schema";

export const todosCollection = createCollection(
    electricCollectionOptions({
        shapeOptions: {
            url: `http://localhost:3000/api/electric`,
            params: {
                table: "test.test_table",
            },
            onError: (error) => {
                console.error(error);
            },
        },
        schema: todoSchema,
        getKey: item => item.id,
    }),
);
