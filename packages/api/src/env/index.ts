import { z } from "zod";

export const EnvSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.url().startsWith("postgresql://"),
	CLIENT_URL: z.url(),
});

export const env = EnvSchema.parse(Bun.env);
