import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/products")({ component: Products });

function Products() {
	const queryClient = useQueryClient();
	const {data: productList} = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const response = await api.get('products')
			const json = await response.json()
			return json.data
		}
	})

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(false);
	const [formData, setFormData] = useState({
		id: "",
		productName: "",
		price: "",
		qty: "",
	});

	const handleAdd = () => {
		setEditingProduct(null);
		setFormData({ id: "", productName: "", price: "", qty: "" });
		setIsModalOpen(true);
	};

	const {mutate: store} = useMutation({
		mutationFn: async (productData: any) => {
			const response = await api.post('products', {
				json: {
					productName: productData.productName,
					qty: productData.qty,
					price: productData.price,
				}
			})

			return response
		}, onSuccess : () => {
			toast.success('success to add product')
			setIsModalOpen(false);
			queryClient.invalidateQueries({
				queryKey: ['products'],
			});
		}, onError: () => {
			toast.error('failed to add product')
		}
	})

	const { mutate: update } = useMutation({
		mutationFn: async ({ id, productData }: { id: string; productData: any }) => {
			const response = await api.put(`products/${id}`, {
				json: productData,
			});

			return response.json();
		},
		onSuccess: () => {
			toast.success("success to update product");
			setIsModalOpen(false);
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: () => {
			toast.error("failed to update product");
		},
	});


	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		const productData: any = {
			productName: formData.productName,
			price: parseFloat(formData.price),
			qty: parseInt(formData.qty),
		};

		if (editingProduct) {
			update({
				id: formData.id,
				productData,
			});
		} else {
			store(productData);
		}


		setFormData({ id: "", productName: "", price: "", qty: "" });
	};

	const {mutate: getProductDetail} = useMutation({
		mutationFn: async (id: string) => {
			const response = await api.get(`products/${id}`)
			const json = await response.json()
			return json.data
		},
		onSuccess: (data) => {
			setFormData({ id: data[0].id, productName: data[0].productName, price: data[0].price, qty: data[0].qty });
			setEditingProduct(true)
			setIsModalOpen(true);
		}
	})

	const handleEdit = (id: string) => {
		getProductDetail(id.toString())
	}

	const {mutate: deleteProduct} = useMutation({
		mutationFn: async (id: string) => {
			const response = await api.delete(`products/${id}`)
			const json = await response.json()
			return json.data
		},
		onSuccess: () => {
			toast.success('success to delete product')
			queryClient.invalidateQueries({ queryKey: ["products"] });
		}, onError: () => {
			toast.error('error to delete product')
		}
	})

	const handleDelete = (id: string) => {
		const isDelete = confirm('Are you sure to delete this product ?')
		if (isDelete) {
			deleteProduct(id)
		}
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Products</h1>
				<button
					onClick={handleAdd}
					className="btn btn-primary"
				>
					Add Product
				</button>
			</div>

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Price
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								qty
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{productList?.map((product) => (
							<tr key={product.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{product.productName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{product.price}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{product.qty}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
									<button
										onClick={() => handleEdit(product.id)}
										className="btn btn-sm btn-outline-primary"
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(product.id)}
										className="btn btn-sm btn-outline-danger"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<h2 className="text-lg font-semibold mb-4">
							{editingProduct ? "Edit Product" : "Add Product"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Name
								</label>
								<input
									type="text"
									required
									value={formData.productName}
									onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Price
								</label>
								<input
									type="number"
									step="0.01"
									required
									value={formData.price}
									onChange={(e) => setFormData({ ...formData, price: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									qty
								</label>
								<input
									type="number"
									required
									value={formData.qty}
									onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="flex justify-end space-x-3 pt-4">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="btn btn-secondary"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary"
								>
									{editingProduct ? "Update" : "Add"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}