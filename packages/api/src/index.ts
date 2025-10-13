import { Elysia } from "elysia";
import { env } from "@/env";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { corsPlugin } from "@/http/plugins/cors";
import { openapiPlugin } from "@/http/plugins/open-api";
import { incomesModule } from "@/modules/incomes";
import { categoriesModule } from "@/modules/categories";

export const app = new Elysia()
	.use(openapiPlugin)
	.use(corsPlugin)
	.use(betterAuthPlugin)
	.use(incomesModule)
	.use(categoriesModule);

export type App = typeof app;

app.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
