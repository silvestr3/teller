import { randomUUIDv7 } from "bun";
import { pgTable, text, pgEnum, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const transactionTypeEnum = pgEnum("transaction_type", [
	"income",
	"expense",
]);

export const categories = pgTable(
	"categories",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		type: transactionTypeEnum("type").notNull(),
		color: text("color"),
		icon: text("icon"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		userTypeIdx: index("categories_user_id_type_idx").on(
			table.userId,
			table.type,
		),
	}),
);
