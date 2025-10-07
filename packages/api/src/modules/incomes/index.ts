import Elysia from "elysia";
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
	);
