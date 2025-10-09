import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import type { Income } from "@/types/income";

const deleteIncome = async (incomeId: string) => {
	const { data, error } = await apiClient.incomes({ id: incomeId }).delete();

	if (error) {
		throw new Error(error.value.message);
	}

	return data;
};

export const useDeleteIncome = () => {
	return useMutation({
		mutationFn: deleteIncome,
		onSuccess: (data) => {
			queryClient.setQueryData(
				[QueryKeys.GET_INCOMES],
				(oldData: Array<Income>) => {
					return oldData.filter((income) => income.id !== data.id);
				},
			);
		},
	});
};
