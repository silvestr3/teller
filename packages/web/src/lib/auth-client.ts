import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient({
	baseURL: env.VITE_API_URL,
	basePath: "/auth",
});
