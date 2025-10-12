import { accounts } from "./accounts";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";
import { categories } from "./categories";
import { recurringTemplates } from "./recurring-templates";
import { transactions } from "./transactions";

export const schema = {
	// auth
	users,
	accounts,
	sessions,
	verifications,

	// finance management
	categories,
	recurringTemplates,
	transactions,
};

// Export types for use in other modules
export { transactionTypeEnum } from "./categories";
