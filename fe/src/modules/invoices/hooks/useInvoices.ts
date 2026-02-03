import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

interface InvoiceDetail {
	id?: string;
	productId: string;
	invoiceId?: string;
	qty: number;
	total: number;
	product?: {
		id: string;
		productName: string;
		qty: number;
		price: number;
	};
}

interface Invoice {
	id: string;
	date: string;
	total: number;
	userId: string;
	user?: {
		id: string;
		email: string;
		name: string | null;
	};
	invoiceDetail: InvoiceDetail[];
}

interface CreateInvoiceRequest {
	date: string;
	total: number;
	userId: string;
	items: {
		productId: string;
		qty: number;
		total: number;
	}[];
}

interface UpdateInvoiceRequest extends CreateInvoiceRequest {
	id: string;
}

export function useInvoices() {
	return useQuery({
		queryKey: ["invoices"],
		queryFn: async (): Promise<Invoice[]> => {
			const response = await api.get("invoice").json<{ success: boolean; data: Invoice[] }>();
			return response.data;
		},
	});
}

export function useInvoice(id: string) {
	return useQuery({
		queryKey: ["invoice", id],
		queryFn: async (): Promise<Invoice> => {
			const response = await api.get(`invoice/${id}`).json<{ success: boolean; data: Invoice }>();
			return response.data;
		},
		enabled: !!id,
	});
}

export function useCreateInvoice() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateInvoiceRequest): Promise<Invoice> => {
			const response = await api.post("invoice", { json: data }).json<{ success: boolean; data: Invoice }>();
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["invoices"] });
			toast.success("Invoice created successfully");
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to create invoice");
		},
	});
}

export function useUpdateInvoice() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, ...data }: UpdateInvoiceRequest): Promise<Invoice> => {
			const response = await api.put(`invoice/${id}`, { json: data }).json<{ success: boolean; data: Invoice }>();
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["invoices"] });
			queryClient.invalidateQueries({ queryKey: ["invoice", data.id] });
			toast.success("Invoice updated successfully");
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to update invoice");
		},
	});
}

export function useDeleteInvoice() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await api.delete(`invoice/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["invoices"] });
			toast.success("Invoice deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to delete invoice");
		},
	});
}