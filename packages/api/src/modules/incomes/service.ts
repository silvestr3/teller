import { status } from "elysia";
import { type CreateIncomeInput, IncomeRepository } from "./repository";

export class IncomeService {
	async findAll({ userId }: { userId: string }) {
		return await IncomeRepository.findAllByUserId(userId);
	}

	async create(input: CreateIncomeInput) {
		return await IncomeRepository.createOne(input);
	}

	async delete({ id, userId }: { id: string; userId: string }) {
		const incomeToDelete = await IncomeRepository.findOne(userId, id);

		if (!incomeToDelete) {
			throw status(404, { message: "Income not found" });
		}

		return await IncomeRepository.deleteOne(id);
	}
}
