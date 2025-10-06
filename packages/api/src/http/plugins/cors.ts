import { env } from "@/env";
import cors from "@elysiajs/cors";
import Elysia from "elysia";

export const corsPlugin = new Elysia().use(
	cors({
		origin: env.CLIENT_URL,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);
