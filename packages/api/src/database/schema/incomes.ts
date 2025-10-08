import { randomUUIDv7 } from "bun";
import {
	date,
	pgTable,
	varchar,
	decimal,
	text,
	boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const incomes = pgTable("incomes", {
	id: text()
		.primaryKey()
		.notNull()
		.$defaultFn(() => randomUUIDv7()),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	isRecurring: boolean().notNull().default(false),
	description: varchar().notNull(),
	amount: decimal().notNull(),
	date: date().notNull(),
});
