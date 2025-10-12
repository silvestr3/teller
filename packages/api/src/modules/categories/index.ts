import Elysia, { t } from "elysia";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { CategoryService } from "./service";
import { CategoryModel } from "./model";

export const categoriesModule = new Elysia({
	prefix: "/categories",
})
	.use(betterAuthPlugin)
	.decorate("service", new CategoryService())
	.get(
		"/",
		async ({ user, service, query }) => {
			const categories = await service.findAll({
				userId: user.id,
				type: query.type,
			});

			return { categories };
		},
		{
			auth: true,
			query: t.Object({
				type: t.Optional(t.Union([t.Literal("income"), t.Literal("expense")])),
			}),
			detail: {
				operationId: "getCategories",
				summary: "Get all categories",
				description:
					"Get all categories for the authenticated user, optionally filtered by type",
				tags: ["Categories"],
			},
		},
	)
	.get(
		"/:id",
		async ({ user, service, params }) => {
			return await service.findOne({
				userId: user.id,
				id: params.id,
			});
		},
		{
			auth: true,
			params: t.Object({
				id: t.String({ minLength: 1 }),
			}),
			detail: {
				operationId: "getCategory",
				summary: "Get a single category",
				description: "Get a single category by ID for the authenticated user",
				tags: ["Categories"],
			},
		},
	)
	.post(
		"/",
		async ({ user, body, service }) => {
			return await service.create({
				userId: user.id,
				name: body.name,
				type: body.type,
				color: body.color,
				icon: body.icon,
			});
		},
		{
			auth: true,
			body: t.Omit(CategoryModel.createCategorySchema, ["userId"]),
			detail: {
				operationId: "createCategory",
				summary: "Create a new category",
				description: "Create a new income or expense category",
				tags: ["Categories"],
			},
		},
	)
	.patch(
		"/:id",
		async ({ user, params, body, service }) => {
			return await service.update({
				id: params.id,
				userId: user.id,
				data: body,
			});
		},
		{
			auth: true,
			params: t.Object({
				id: t.String({ minLength: 1 }),
			}),
			body: CategoryModel.updateCategorySchema,
			detail: {
				operationId: "updateCategory",
				summary: "Update a category",
				description: "Update name, color, or icon of an existing category",
				tags: ["Categories"],
			},
		},
	)
	.delete(
		"/:id",
		async ({ user, params, service, set }) => {
			await service.delete({
				id: params.id,
				userId: user.id,
			});

			set.status = 204;
			return;
		},
		{
			auth: true,
			params: t.Object({
				id: t.String({ minLength: 1 }),
			}),
			detail: {
				operationId: "deleteCategory",
				summary: "Delete a category",
				description:
					"Delete a category (fails if category is in use by transactions or templates)",
				tags: ["Categories"],
			},
		},
	);
