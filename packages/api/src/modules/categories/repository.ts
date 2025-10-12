import { db } from "@/database/client";
import { schema } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export interface CreateCategoryInput {
	userId: string;
	name: string;
	type: "income" | "expense";
	color?: string;
	icon?: string;
}

export interface UpdateCategoryInput {
	name?: string;
	color?: string;
	icon?: string;
}

export abstract class CategoryRepository {
	static async findOne(userId: string, id: string) {
		const category = await db.query.categories.findFirst({
			where: and(eq(schema.categories.userId, userId), eq(schema.categories.id, id)),
			columns: {
				userId: false,
			},
		});

		return category;
	}

	static async findAllByUserId(userId: string, type?: "income" | "expense") {
		const whereConditions = [eq(schema.categories.userId, userId)];
		
		if (type) {
			whereConditions.push(eq(schema.categories.type, type));
		}

		const categories = await db.query.categories.findMany({
			where: and(...whereConditions),
			columns: {
				userId: false,
			},
			orderBy: schema.categories.createdAt,
		});

		return categories;
	}

	static async createOne(data: CreateCategoryInput) {
		const [category] = await db
			.insert(schema.categories)
			.values({
				userId: data.userId,
				name: data.name,
				type: data.type,
				color: data.color,
				icon: data.icon,
			})
			.returning({
				id: schema.categories.id,
				name: schema.categories.name,
				type: schema.categories.type,
				color: schema.categories.color,
				icon: schema.categories.icon,
				createdAt: schema.categories.createdAt,
			});

		return category;
	}

	static async updateOne(id: string, userId: string, data: UpdateCategoryInput) {
		const [category] = await db
			.update(schema.categories)
			.set(data)
			.where(and(eq(schema.categories.id, id), eq(schema.categories.userId, userId)))
			.returning({
				id: schema.categories.id,
				name: schema.categories.name,
				type: schema.categories.type,
				color: schema.categories.color,
				icon: schema.categories.icon,
				createdAt: schema.categories.createdAt,
			});

		return category;
	}

	static async deleteOne(id: string, userId: string) {
		const [deletedCategory] = await db
			.delete(schema.categories)
			.where(and(eq(schema.categories.id, id), eq(schema.categories.userId, userId)))
			.returning({
				id: schema.categories.id,
			});

		return deletedCategory;
	}

	static async checkCategoryInUse(categoryId: string, userId: string): Promise<boolean> {
		// Check if category is used in transactions
		const transactionCount = await db
			.select({ count: schema.transactions.id })
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.categoryId, categoryId),
					eq(schema.transactions.userId, userId)
				)
			);

		// Check if category is used in recurring templates
		const templateCount = await db
			.select({ count: schema.recurringTemplates.id })
			.from(schema.recurringTemplates)
			.where(
				and(
					eq(schema.recurringTemplates.categoryId, categoryId),
					eq(schema.recurringTemplates.userId, userId)
				)
			);

		return transactionCount.length > 0 || templateCount.length > 0;
	}
}