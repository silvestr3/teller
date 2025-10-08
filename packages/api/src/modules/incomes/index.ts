import Elysia, { t } from "elysia";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { IncomeService } from "./service";

export const incomesModule = new Elysia({
	prefix: "/incomes",
})
	.use(betterAuthPlugin)
	.get(
		"/",
		async ({ user }) => {
			return await IncomeService.findAll({ userId: user.id });
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
		async ({ user, body }) => {
			return await IncomeService.create({
				userId: user.id,
				description: body.description,
				amount: body.amount,
				date: body.date,
				isRecurring: body.isRecurring ?? false,
			});
		},
		{
			auth: true,
			body: t.Object({
				description: t.String({ minLength: 1 }),
				amount: t.Number({ minimum: 0.01 }),
				date: t.String(),
				isRecurring: t.Optional(t.Boolean()),
			}),
			detail: {
				operationId: "createIncome",
				summary: "Create a new income",
				tags: ["Incomes"],
			},
		},
	);
