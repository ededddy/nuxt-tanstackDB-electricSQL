import { z } from "zod/v4";

export const todoSchema = z.object({
    id: z.int(),
    name: z.string().max(255),
    description: z.string(),
    completed: z.boolean().default(false),
    version: z.int64(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

export type Todo = z.infer<typeof todoSchema>;
