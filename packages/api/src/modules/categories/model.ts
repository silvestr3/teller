import { createSelectSchema } from "drizzle-typebox";
import { Type } from "@sinclair/typebox";
import { schema } from "@/database/schema";

export namespace CategoryModel {
	export const createCategorySchema = Type.Object({
		userId: Type.String(),
		name: Type.String({ minLength: 1, maxLength: 100 }),
		type: Type.Union([Type.Literal("income"), Type.Literal("expense")]),
		color: Type.Optional(Type.String({ pattern: "^#[0-9A-Fa-f]{6}$" })),
		icon: Type.Optional(Type.String({ maxLength: 10 })),
	});

	export const updateCategorySchema = Type.Object({
		name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
		color: Type.Optional(Type.String({ pattern: "^#[0-9A-Fa-f]{6}$" })),
		icon: Type.Optional(Type.String({ maxLength: 10 })),
	});

	export const categorySchema = createSelectSchema(schema.categories);
}
