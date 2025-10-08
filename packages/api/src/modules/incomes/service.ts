import { db } from "@/database/client";
import { schema } from "@/database/schema";
import { eq } from "drizzle-orm";

interface CreateIncomeInput {
	userId: string;
	description: string;
	amount: number;
	date: string;
	isRecurring: boolean;
}

export abstract class IncomeService {
	static async findAll({ userId }: { userId: string }) {
		const incomes = await db.query.incomes.findMany({
			where: eq(schema.incomes.userId, userId),
			columns: {
				userId: false,
			},
		});

		return incomes;
	}

	static async create(input: CreateIncomeInput) {
		const [income] = await db
			.insert(schema.incomes)
			.values({
				userId: input.userId,
				description: input.description,
				amount: input.amount,
				date: input.date,
				isRecurring: input.isRecurring,
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
