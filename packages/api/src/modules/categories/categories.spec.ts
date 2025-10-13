import { apiClient } from "@/test/lib";
import { expect, it } from "bun:test";

it("should create a category", async () => {
	const { status } = await apiClient.categories.post({
		name: "New Category",
		color: "#FF5733",
		type: "expense",
	});

	expect(status).toBe(401);
});
