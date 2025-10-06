import type { App } from "@teller/api";
import { treaty } from "@elysiajs/eden";
import { env } from "@/env";

export const apiClient = treaty<App>(env.VITE_API_URL);
