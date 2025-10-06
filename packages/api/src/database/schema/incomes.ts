import { randomUUIDv7 } from "bun";
import { date, pgTable, varchar, integer, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const incomes = pgTable("incomes", {
	id: text()
		.primaryKey()
		.notNull()
		.$defaultFn(() => randomUUIDv7()),
	description: varchar().notNull(),
	amount: integer().notNull(),
	date: date().notNull(),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});
