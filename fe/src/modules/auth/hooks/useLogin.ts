import { api } from "@/utils/api"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast"
import { tokenService } from "libs/auth";
import { userService } from "@/utils/auth";

export const useLogin = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async ({
			email,
			password,
		}: {
			email: string;
			password: string;
		}) => {
            const response = await api.post('auth/login', {
                json: {
                    email,
                    password,
                },
            })
            const data: {
				success: boolean;
				data: {
					accessToken: string;
					user: {
						id: string;
						email: string;
						name: string | null;
					};
				};
			} = await response.json()
            return data
        },
        onSuccess: (data) => {
			toast.success("Login berhasil");
			tokenService.set(data.data.accessToken);
			userService.set(data.data.user);
			setTimeout(() => {
				navigate({ to: "/" });
			}, 1000);
		},
		onError: () => {
			toast.error("Login gagal");
		},
    })   
}