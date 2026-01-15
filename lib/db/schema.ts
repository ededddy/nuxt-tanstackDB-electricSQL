import { pgSchema, integer, varchar, text, bigint, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const test = pgSchema("test");

export const testTableInTest = test.table("test_table", {
    id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "test.test_tabe_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
    name: varchar({ length: 255 }),
    description: text(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    version: bigint({ mode: "number" }),
    createdAt: timestamp("created_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    completed: boolean().default(false),
});

export type Todo = typeof testTableInTest.$inferSelect;
export type NewTodo = typeof testTableInTest.$inferInsert;
