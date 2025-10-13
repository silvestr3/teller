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
import { recurringTemplates } from "./recurring-templates";

export const transactions = pgTable(
	"transactions",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		recurringTemplateId: text("recurring_template_id").references(
			() => recurringTemplates.id,
			{ onDelete: "set null" },
		),
		categoryId: text("category_id").references(() => categories.id, {
			onDelete: "set null",
		}),
		type: transactionTypeEnum("type").notNull(),
		description: text("description").notNull(),
		amountCents: integer("amount_cents").notNull(),
		transactionDate: date("transaction_date").notNull(),
		year: integer("year").notNull(),
		month: integer("month").notNull(),
		isPaid: boolean("is_paid").notNull().default(false),
		notes: text("notes"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		userIdIdx: index("transactions_user_id_idx").on(table.userId),
		userYearMonthIdx: index("transactions_user_id_year_month_idx").on(
			table.userId,
			table.year,
			table.month,
		),
		userTypeYearMonthIdx: index("transactions_user_id_type_year_month_idx").on(
			table.userId,
			table.type,
			table.year,
			table.month,
		),
		monthCheck: check(
			"month_check",
			sql`${table.month} >= 1 AND ${table.month} <= 12`,
		),
		amountCheck: check("amount_check", sql`${table.amountCents} > 0`),
	}),
);
