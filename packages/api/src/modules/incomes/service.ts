import { db } from "@/database/client";
import { schema } from "@/database/schema";
import { eq } from "drizzle-orm";

export abstract class IncomeService {
	static async findAll({ userId }: { userId: string }) {
		const incomes = await db.query.incomes.findMany({
			where: eq(schema.incomes.userId, userId),
			columns: {
				userId: false,
				amount: true,
			},
		});

		return incomes;
	}
}
