import { status } from "elysia";
import { CategoryRepository } from "./repository";

interface CreateCategoryServiceInput {
	userId: string;
	name: string;
	type: "income" | "expense";
	color?: string;
	icon?: string;
}

interface UpdateCategoryServiceInput {
	name?: string;
	color?: string;
	icon?: string;
}

export class CategoryService {
	async findAll({ userId, type }: { userId: string; type?: "income" | "expense" }) {
		return await CategoryRepository.findAllByUserId(userId, type);
	}

	async findOne({ userId, id }: { userId: string; id: string }) {
		const category = await CategoryRepository.findOne(userId, id);

		if (!category) {
			throw status(404, { message: "Category not found" });
		}

		return category;
	}

	async create(input: CreateCategoryServiceInput) {
		return await CategoryRepository.createOne(input);
	}

	async update({ id, userId, data }: { id: string; userId: string; data: UpdateCategoryServiceInput }) {
		// First check if category exists and belongs to user
		const existingCategory = await CategoryRepository.findOne(userId, id);

		if (!existingCategory) {
			throw status(404, { message: "Category not found" });
		}

		const updatedCategory = await CategoryRepository.updateOne(id, userId, data);

		if (!updatedCategory) {
			throw status(404, { message: "Category not found" });
		}

		return updatedCategory;
	}

	async delete({ id, userId }: { id: string; userId: string }) {
		// First check if category exists and belongs to user
		const categoryToDelete = await CategoryRepository.findOne(userId, id);

		if (!categoryToDelete) {
			throw status(404, { message: "Category not found" });
		}

		// Check if category is in use
		const isInUse = await CategoryRepository.checkCategoryInUse(id, userId);

		if (isInUse) {
			throw status(409, { 
				message: "Cannot delete category that is used in transactions or recurring templates" 
			});
		}

		return await CategoryRepository.deleteOne(id, userId);
	}
}