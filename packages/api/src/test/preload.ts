import { afterAll, beforeAll } from "bun:test";
import { randomUUIDv7 } from "bun";
import { execSync } from "node:child_process";
import { db } from "../database/client";

function generateUniqueDatabaseURL(schemaId: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined!");
	}

	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set("schema", schemaId);

	return url.toString();
}

const schemaId = randomUUIDv7();

beforeAll(async () => {
	const databaseUrl = generateUniqueDatabaseURL(schemaId);
	process.env.DATABASE_URL = databaseUrl;

	console.log(`Using database URL: ${databaseUrl}`);

	execSync("bun --env-file .env.test --bun drizzle-kit migrate");
});

afterAll(() => {
	db.execute(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`);
});
