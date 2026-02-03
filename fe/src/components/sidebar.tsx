import { Link } from "@tanstack/react-router";

export function Sidebar() {
	return (
		<div className="w-64 border-r border-zinc-100 dark:border-zinc-800 h-full">
			<div className="p-4">
				<h2 className="text-lg font-semibold mb-4">Menu</h2>
				<nav className="space-y-2">
					<Link
						to="/products"
						className="flex gap-2 items-center cursor-pointer text-[14px] font-medium px-3 hover:text-white py-1.5 hover:bg-indigo-600 transition duration-150 rounded-md"
						activeProps={{
							className: "bg-indigo-600 text-white"
						}}
					>
						<span>Product</span>
					</Link>
					<Link
						to="/invoices"
						className="flex gap-2 items-center cursor-pointer text-[14px] font-medium px-3 hover:text-white py-1.5 hover:bg-indigo-600 transition duration-150 rounded-md"
						activeProps={{
							className: "bg-indigo-600 text-white"
						}}
					>
						<span>Invoice</span>
					</Link>
				</nav>
			</div>
		</div>
	);
}