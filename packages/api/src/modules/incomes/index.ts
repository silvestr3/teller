import Elysia, { t } from "elysia";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { IncomeService } from "./service";
import { IncomeModel } from "./model";

export const incomesModule = new Elysia({
	prefix: "/incomes",
})
	.use(betterAuthPlugin)
	.decorate("service", new IncomeService())
	.get(
		"/",
		async ({ user, service }) => {
			return await service.findAll({ userId: user.id });
		},
		{
			auth: true,
			detail: {
				operationId: "getIncomes",
				summary: "Get all incomes",
				tags: ["Incomes"],
			},
		},
	)
	.post(
		"/",
		async ({ user, body, service }) => {
			return await service.create({
				userId: user.id,
				description: body.description,
				amount: body.amount,
				date: body.date,
				isRecurring: body.isRecurring ?? false,
			});
		},
		{
			auth: true,
			body: t.Omit(IncomeModel.createIncomeSchema, ["userId"]),
			detail: {
				operationId: "createIncome",
				summary: "Create a new income",
				tags: ["Incomes"],
			},
		},
	)
	.delete(
		"/:id",
		async ({ user, params, service }) => {
			return await service.delete({
				id: params.id,
				userId: user.id,
			});
		},
		{
			auth: true,
			params: t.Object({
				id: t.String({ minLength: 1 }),
			}),
			detail: {
				operationId: "deleteIncome",
				summary: "Delete an income",
				tags: ["Incomes"],
			},
		},
	);
