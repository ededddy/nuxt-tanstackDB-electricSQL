import { pgSchema, varchar, text, timestamp, boolean, serial } from "drizzle-orm/pg-core";

export const test = pgSchema("test");

export const testTableInTest = test.table("test_table", {
    id: serial(`id`).primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    completed: boolean(`completed`).notNull().default(false),
    created_at: timestamp(`created_at`, { withTimezone: true })
        .defaultNow()
        .notNull(),
    updated_at: timestamp(`updated_at`, { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export type Todo = typeof testTableInTest.$inferSelect;
export type NewTodo = typeof testTableInTest.$inferInsert;
