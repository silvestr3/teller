import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import type { Income } from "@/types/income";

interface CreateIncomeInput {
	description: string;
	amount: number;
	date: string;
	isRecurring: boolean;
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
		onSuccess: (data) => {
			queryClient.setQueryData(
				[QueryKeys.GET_INCOMES],
				(old: Array<Income>) => {
					if (old) {
						return [...old, data];
					}
					return [data];
				},
			);
		},
	});
};
