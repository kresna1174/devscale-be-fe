import { useMockTodos } from "../hooks/useMockTodos";

export const MockTodos = () => {
    const {data, isPending} = useMockTodos()

    console.log(data, isPending)

    if (isPending) {
        return <div className="text-4xl animate-pulse">Loading Mock Todos...</div>
    }

	return <div>
        {data?.map((todo) => (
            <div key={todo.id} className="flex w-[380px] border border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 p-10 rounded-lg space-y-6">
                <div className="font-semibold tracking-tighter">{todo.title}</div>
            </div>
        ))}
    </div>;
};