import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";

const getIncomes = async () => {
	const { data, error } = await apiClient.incomes.get();

	if (error) {
		throw new Error(error.value.message);
	}

	return data;
};

export const useGetIncomes = () => {
	return useQuery({
		queryKey: [QueryKeys.GET_INCOMES],
		queryFn: getIncomes,
	});
};
