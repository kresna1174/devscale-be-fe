import { useRegister } from "@/modules/auth/hooks/useRegister";
import {
	createFileRoute,
	Link,
} from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { mutate: registerSubmit, isPending } = useRegister();

	const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		registerSubmit({ email, password });
	};

	return (
		<div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
			<div className="bg-linear-to-br dark:from-zinc-950 dark:to-zinc-900 from-indigo-500 to-indigo-600 relative w-full h-screen flex justify-center items-center">
				<div className="w-[380px] border border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 space-y-5 p-10 rounded-lg">
					<main className="space-y-6">
						<section>
							<h3 className="text-2xl font-semibold tracking-tighter">
								Sign Up
							</h3>
							<p>Create your account</p>
						</section>
						<form className="space-y-2" onSubmit={handleRegisterSubmit}>
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
								{isPending ? "Registering..." : "Register"}
							</button>
						</form>
						<section className="space-y-1">
							<p>
								Have account ? <Link to="/login">Login</Link>
							</p>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}
