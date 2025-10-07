import {
	createInsertSchema,
	createUpdateSchema,
	createSelectSchema,
} from "drizzle-typebox";
import { schema } from "@/database/schema";

export namespace IncomeModel {
	export const createIncomeSchema = createInsertSchema(schema.incomes);
	export const updateIncomeSchema = createUpdateSchema(schema.incomes);
	export const incomeSchema = createSelectSchema(schema.incomes);
}
