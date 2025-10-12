import { accounts } from "./accounts";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";
import { categories } from "./categories";
import { recurringTemplates } from "./recurring-templates";
import { transactions } from "./transactions";
import { incomes } from "./incomes";

export const schema = {
	// auth
	users,
	accounts,
	sessions,
	verifications,

	// deprecated - to be removed
	incomes,

	// finance management
	categories,
	recurringTemplates,
	transactions,
};

// Export types for use in other modules
export { transactionTypeEnum } from "./categories";
