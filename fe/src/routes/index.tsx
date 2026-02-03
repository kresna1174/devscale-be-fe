import { createFileRoute } from "@tanstack/react-router";
import { MockTodos } from "../modules/mockTodos/components/mockTodos";
import { MockTodoFeatured } from "@/modules/mockTodos/components/mockTodosFeatured";
import { Profile } from "@/modules/profile/components/profile";
import { useProfile } from "@/modules/profile/hooks/useProfile";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const {data, isPending} = useProfile()
	return (
		<div className="h-full">
			<header className="flex justify-between p-4 bg-zinc-100 border-b">
				<div className="text-2xl font-semibold tracking-tighter">Todos</div>
				<Profile />
			</header>
			<div className="p-4">
				{isPending && <div className="animate-pulse">Loading...</div>}
				<div>Todos {data?.data.email}</div>
				<div className="grid grid-cols-2">
					<MockTodos />
					<MockTodoFeatured />
				</div>
			</div>
		</div>
	);
}
