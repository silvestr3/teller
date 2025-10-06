import { betterAuth } from "better-auth";
import { db } from "../database/client";
import { openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";

export const auth = betterAuth({
	basePath: "/auth",
	trustedOrigins: [env.CLIENT_URL],
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		camelCase: false,
	}),
	plugins: [openAPI()],
	advanced: {
		database: {
			generateId: false,
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		password: {
			hash: (password: string) => Bun.password.hash(password),
			verify: ({ password, hash }) => Bun.password.verify(password, hash),
		},
	},

	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5, // 5 minutes
		},
	},
});
