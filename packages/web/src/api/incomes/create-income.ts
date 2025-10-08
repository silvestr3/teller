import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateIncomeInput {
	description: string;
	amount: number;
	date: string;
	isRecurring?: boolean;
}

const createIncome = async (input: CreateIncomeInput) => {
	const { data, error } = await apiClient.incomes.post(input);

	if (error) {
		throw new Error(error.value.message);
	}

	return data;
};

export const useCreateIncome = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createIncome,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["incomes"] });
		},
	});
};
