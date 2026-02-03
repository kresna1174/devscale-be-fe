import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import { useLogin } from "@/modules/auth/hooks/useLogin";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// const navigate = useNavigate();

	const { mutate: loginSubmit, isPending } = useLogin();

	const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginSubmit({ email, password });
	};
	return (
		<div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
			<div className="bg-linear-to-br dark:from-zinc-950 dark:to-zinc-900 from-indigo-500 to-indigo-600 relative w-full h-screen flex justify-center items-center">
				<div className="w-[380px] border border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 space-y-5 p-10 rounded-lg">
					<main className="space-y-6">
						<section>
							<h3 className="text-2xl font-semibold tracking-tighter">
								Sign in
							</h3>
							<p>Login to continue</p>
						</section>
						<form className="space-y-2" onSubmit={handleLoginSubmit}>
							<input
								placeholder="Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<input
								placeholder="Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button type="submit" disabled={isPending} className="btn btn-primary w-full">
								{isPending ? "Logging in..." : "Login"}
							</button>
						</form>
						<section className="space-y-1">
							<p>
								Don't have an account ? <Link to="/register">Register</Link>
							</p>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}
