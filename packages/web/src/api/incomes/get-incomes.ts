import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

const getIncomes = async () => {
	const { data, error } = await apiClient.incomes.get();

	if (error) {
		throw new Error(error.value.message);
	}

	return data;
};

export const useGetIncomes = () => {
	return useQuery({
		queryKey: ["incomes"],
		queryFn: getIncomes,
	});
};
