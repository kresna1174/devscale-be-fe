import { useQuery } from "@tanstack/react-query"
import { api } from "@/utils/api"

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await api.get('profile/me')
            const data = await response.json()
            return data
        }
    })
}