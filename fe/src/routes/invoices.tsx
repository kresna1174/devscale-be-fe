import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from "@/modules/invoices/hooks/useInvoices";
import { useProducts } from "@/modules/products/hooks/useProducts";
import { getCurrentUser } from "@/utils/auth";

export const Route = createFileRoute("/invoices")({ component: Invoices });

interface InvoiceDetail {
	productId: string;
	qty: number;
	total: number;
}

interface InvoiceFormData {
	date: string;
	items: InvoiceDetail[];
}

function Invoices() {
	const currentUser = getCurrentUser();
	const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();
	const { data: products = [], isLoading: productsLoading } = useProducts();
	const createInvoiceMutation = useCreateInvoice();
	const updateInvoiceMutation = useUpdateInvoice();
	const deleteInvoiceMutation = useDeleteInvoice();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingInvoice, setEditingInvoice] = useState<any>(null);
	const [formData, setFormData] = useState<InvoiceFormData>({
		date: "",
		items: []
	});

	const handleAdd = () => {
		setEditingInvoice(null);
		setFormData({
			date: new Date().toISOString().split('T')[0],
			items: []
		});
		setIsModalOpen(true);
	};

	const handleEdit = (invoice: any) => {
		setEditingInvoice(invoice);
		setFormData({
			date: new Date(invoice.date).toISOString().split('T')[0],
			items: invoice.invoiceDetail.map((detail: any) => ({
				productId: detail.productId,
				qty: detail.qty,
				total: detail.total
			}))
		});
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this invoice?")) {
			deleteInvoiceMutation.mutate(id);
		}
	};

	const addItem = () => {
		setFormData({
			...formData,
			items: [...formData.items, { productId: "", qty: 1, total: 0 }]
		});
	};

	const removeItem = (index: number) => {
		const newItems = formData.items.filter((_, i) => i !== index);
		setFormData({ ...formData, items: newItems });
	};

	const updateItem = (index: number, field: keyof InvoiceDetail, value: string | number) => {
		const newItems = [...formData.items];
		newItems[index] = { ...newItems[index], [field]: value };

		if (field === 'productId' || field === 'qty') {
			const product = products.find(p => p.id === newItems[index].productId);
			if (product && newItems[index].qty > 0) {
				newItems[index].total = product.price * newItems[index].qty;
			}
		}
		
		setFormData({ ...formData, items: newItems });
	};

	const calculateInvoiceTotal = () => {
		return formData.items.reduce((sum, item) => sum + item.total, 0);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!currentUser) {
			alert("Please log in to create invoices");
			return;
		}

		if (formData.items.length === 0) {
			alert("Please add at least one item to the invoice");
			return;
		}

		const invoiceTotal = calculateInvoiceTotal();
		
		const invoiceData = {
			date: formData.date,
			total: invoiceTotal,
			userId: currentUser.id,
			items: formData.items
		};

		if (editingInvoice) {
			updateInvoiceMutation.mutate({
				id: editingInvoice.id,
				...invoiceData
			});
		} else {
			createInvoiceMutation.mutate(invoiceData);
		}

		setIsModalOpen(false);
		setFormData({ date: "", items: [] });
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
				<button
					onClick={handleAdd}
					className="btn btn-primary"
				>
					Add Invoice
				</button>
			</div>

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Invoice ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Customer
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Items
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Total
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{invoices.map((invoice) => (
							<tr key={invoice.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{invoice.id.slice(0, 8)}...
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{new Date(invoice.date).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{invoice.user?.name || invoice.user?.email || 'Unknown'}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{invoice.invoiceDetail == undefined ? 0 : invoice.invoiceDetail.length} item(s)
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{invoice.total.toFixed(2)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
									<button
										onClick={() => handleEdit(invoice)}
										className="btn btn-sm btn-outline-primary"
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(invoice.id)}
										className="btn btn-sm btn-outline-danger"
										disabled={deleteInvoiceMutation.isPending}
									>
										{deleteInvoiceMutation.isPending ? 'Deleting...' : 'Delete'}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
						<h2 className="text-lg font-semibold mb-4">
							{editingInvoice ? "Edit Invoice" : "Add Invoice"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Date
									</label>
									<input
										type="date"
										required
										value={formData.date}
										onChange={(e) => setFormData({ ...formData, date: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Customer
									</label>
									<input
										type="text"
										value={currentUser?.name || currentUser?.email || ''}
										disabled
										className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
									/>
								</div>
							</div>

							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="block text-sm font-medium text-gray-700">
										Items
									</label>
									<button
										type="button"
										onClick={addItem}
										className="btn btn-sm btn-success"
									>
										Add Item
									</button>
								</div>
								
								{formData.items.length === 0 ? (
									<p className="text-gray-500 text-sm">No items added yet</p>
								) : (
									<div className="space-y-2">
										{formData.items.map((item, index) => (
											<div key={index} className="flex gap-2 items-end p-3 border border-gray-200 rounded-md">
												<div className="flex-1">
													<label className="block text-xs text-gray-600 mb-1">Product</label>
													<select
														value={item.productId}
														onChange={(e) => updateItem(index, 'productId', e.target.value)}
														className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
														required
													>
														<option value="">Select Product</option>
														{products.map(product => (
															<option key={product.id} value={product.id}>
																{product.productName} - {product.price}
															</option>
														))}
													</select>
												</div>
												<div className="w-20">
													<label className="block text-xs text-gray-600 mb-1">Qty</label>
													<input
														type="number"
														min="1"
														value={item.qty}
														onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
														className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
														required
													/>
												</div>
												<div className="w-24">
													<label className="block text-xs text-gray-600 mb-1">Total</label>
													<input
														type="number"
														step="0.01"
														value={item.total}
														onChange={(e) => updateItem(index, 'total', parseFloat(e.target.value) || 0)}
														className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
														required
													/>
												</div>
												<button
													type="button"
													onClick={() => removeItem(index)}
													className="btn btn-sm btn-outline-danger"
												>
													Remove
												</button>
											</div>
										))}
									</div>
								)}
								
								{formData.items.length > 0 && (
									<div className="mt-4 p-3 bg-gray-50 rounded-md">
										<div className="flex justify-between items-center">
											<span className="font-medium">Invoice Total:</span>
											<span className="text-lg font-bold">{calculateInvoiceTotal().toFixed(2)}</span>
										</div>
									</div>
								)}
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
									disabled={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
								>
									{createInvoiceMutation.isPending || updateInvoiceMutation.isPending 
										? 'Saving...' 
										: editingInvoice ? "Update" : "Create"} Invoice
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}