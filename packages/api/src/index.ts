import { Elysia } from "elysia";
import { env } from "./env";
import { betterAuthPlugin } from "./http/plugins/better-auth";
import { corsPlugin } from "./http/plugins/cors";
import { openapiPlugin } from "./http/plugins/open-api";
import { incomesModule } from "./modules/incomes";

export const app = new Elysia()
	.use(openapiPlugin)
	.use(corsPlugin)
	.use(betterAuthPlugin)
	.use(incomesModule)
	.listen(env.PORT);

export type App = typeof app;

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
