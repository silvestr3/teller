import { accounts } from "./accounts";
import { incomes } from "./incomes";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

export const schema = {
	// auth
	users,
	accounts,
	sessions,
	verifications,

	// models
	incomes,
};
