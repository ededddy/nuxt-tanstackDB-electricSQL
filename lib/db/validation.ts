import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";

import { testTableInTest } from "./schema";

export const insertTodoSchema = createInsertSchema(testTableInTest).omit({
    id: true,
    created_at: true,
    updated_at: true,
});
export const selectTodoSchema = createSelectSchema(testTableInTest);

export const updateTodoSchema = insertTodoSchema.partial().strict();

export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type SelectTodo = z.infer<typeof selectTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

export const validateSelectTodo = (data: unknown): SelectTodo => {
    return selectTodoSchema.parse(data);
};

export const validateInsertTodo = (data: unknown): InsertTodo => {
    const parsed = insertTodoSchema.parse(data);
    if (parsed.description === `really hard todo`) {
        throw new Error(`we don't want to do really hard todos`);
    }
    return parsed;
};

export const validateUpdateTodo = (data: unknown): UpdateTodo => {
    return updateTodoSchema.parse(data);
};

export const safeParseInsertTodo = (data: unknown) => {
    return insertTodoSchema.safeParse(data);
};

export const safeParseSelectTodo = (data: unknown) => {
    return selectTodoSchema.safeParse(data);
};

export const safeParseUpdateTodo = (data: unknown) => {
    return updateTodoSchema.safeParse(data);
};
