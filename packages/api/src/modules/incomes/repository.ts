import { db } from "@/database/client";
import { schema } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export interface CreateIncomeInput {
	userId: string;
	description: string;
	amount: number;
	date: string;
	isRecurring: boolean;
}

export abstract class IncomeRepository {
	static async findOne(userId: string, id: string) {
		const income = await db.query.incomes.findFirst({
			where: and(eq(schema.incomes.userId, userId), eq(schema.incomes.id, id)),
			columns: {
				userId: false,
			},
		});

		return income;
	}

	static async deleteOne(id: string) {
		const [deletedIncome] = await db
			.delete(schema.incomes)
			.where(eq(schema.incomes.id, id))
			.returning({
				id: schema.incomes.id,
			});

		return deletedIncome;
	}

	static async findAllByUserId(userId: string) {
		const incomes = await db.query.incomes.findMany({
			where: eq(schema.incomes.userId, userId),
			columns: {
				userId: false,
			},
		});

		return incomes;
	}

	static async createOne(data: CreateIncomeInput) {
		const [income] = await db
			.insert(schema.incomes)
			.values({
				userId: data.userId,
				description: data.description,
				amount: data.amount,
				date: data.date,
				isRecurring: data.isRecurring,
			})
			.returning({
				id: schema.incomes.id,
				description: schema.incomes.description,
				amount: schema.incomes.amount,
				date: schema.incomes.date,
				isRecurring: schema.incomes.isRecurring,
			});

		return income;
	}
}
