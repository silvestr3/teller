import { randomUUIDv7 } from "bun";
import {
	pgTable,
	text,
	integer,
	date,
	boolean,
	timestamp,
	index,
	check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { categories, transactionTypeEnum } from "./categories";

export const recurringTemplates = pgTable("recurring_templates", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	categoryId: text("category_id")
		.references(() => categories.id, { onDelete: "set null" }),
	type: transactionTypeEnum("type").notNull(),
	description: text("description").notNull(),
	amountCents: integer("amount_cents"), // Nullable for variable amounts
	dayOfMonth: integer("day_of_month").notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"), // NULL means active indefinitely
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull(),
}, (table) => ({
	userIdIdx: index("recurring_templates_user_id_idx").on(table.userId),
	userActiveIdx: index("recurring_templates_user_id_is_active_idx").on(table.userId, table.isActive),
	dayOfMonthCheck: check("day_of_month_check", sql`${table.dayOfMonth} >= 1 AND ${table.dayOfMonth} <= 31`),
}));