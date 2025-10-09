import { status } from "elysia";
import { IncomeRepository } from "./repository";

interface CreateIncomeServiceInput {
	userId: string;
	description: string;
	amount: number; // Accepts dollars from API
	date: string;
	isRecurring: boolean;
}

export class IncomeService {
	async findAll({ userId }: { userId: string }) {
		const incomes = await IncomeRepository.findAllByUserId(userId);

		// Convert cents to dollars for API response
		return incomes.map((income) => ({
			...income,
			amount: income.amountCents / 100,
		}));
	}

	async create(input: CreateIncomeServiceInput) {
		// Convert dollars to cents for storage
		const income = await IncomeRepository.createOne({
			userId: input.userId,
			description: input.description,
			amountCents: Math.round(input.amount * 100),
			date: input.date,
			isRecurring: input.isRecurring,
		});

		// Convert cents back to dollars for API response
		return {
			...income,
			amount: income.amountCents / 100,
		};
	}

	async delete({ id, userId }: { id: string; userId: string }) {
		const incomeToDelete = await IncomeRepository.findOne(userId, id);

		if (!incomeToDelete) {
			throw status(404, { message: "Income not found" });
		}

		return await IncomeRepository.deleteOne(id);
	}
}
