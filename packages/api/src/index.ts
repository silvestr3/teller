import { Elysia } from "elysia";
import { env } from "./env";
import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth";
import openapi from "@elysiajs/openapi";
import cors from "@elysiajs/cors";

export const app = new Elysia()
	.use(
		openapi({
			path: "/docs",
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(
		cors({
			origin: env.CLIENT_URL,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(betterAuthPlugin)
	.listen(env.PORT);

export type App = typeof app;

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
