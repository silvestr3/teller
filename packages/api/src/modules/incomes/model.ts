import { createUpdateSchema, createSelectSchema } from "drizzle-typebox";
import { Type } from "@sinclair/typebox";
import { schema } from "@/database/schema";

export namespace IncomeModel {
	export const createIncomeSchema = Type.Object({
		userId: Type.String(),
		description: Type.String({ minLength: 1 }),
		amount: Type.Number({ minimum: 0.01 }),
		date: Type.String(),
		isRecurring: Type.Boolean(),
	});

	export const updateIncomeSchema = createUpdateSchema(schema.incomes);
	export const incomeSchema = createSelectSchema(schema.incomes);
}
