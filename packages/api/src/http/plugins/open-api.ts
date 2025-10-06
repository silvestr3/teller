import openapi from "@elysiajs/openapi";
import Elysia from "elysia";
import { OpenAPI } from "./better-auth";

export const openapiPlugin = new Elysia().use(
	openapi({
		path: "/docs",
		documentation: {
			components: await OpenAPI.components,
			paths: await OpenAPI.getPaths(),
		},
	}),
);
