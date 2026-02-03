import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { MockTodo } from "../types";

export const useMockTodos = () => {
    return useQuery<MockTodo[]>({
        queryKey: ['mockTodos'],
        queryFn: async () => {
            const response = await api.get('mock-todos?throttle=true')
            const todos: MockTodo[] = await response.json()
            return todos
        }
    })
}