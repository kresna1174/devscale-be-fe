import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

interface Product {
	id: string;
	productName: string;
	qty: number;
	price: number;
}

export function useProducts() {
	return useQuery({
		queryKey: ["products"],
		queryFn: async (): Promise<Product[]> => {
			const response = await api.get("products").json<{ success: boolean; data: Product[] }>();
			return response.data;
		},
	});
}