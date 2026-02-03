import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export const useRegister = () => {
    const navigate = useNavigate();
    return useMutation({
		mutationKey: ["register"],
		mutationFn: async ({
			email,
			password,
		}: {
			email: string;
			password: string;
		}) => {
			const response = await api
				.post("auth/register", {
					json: { email, password },
				})
				.json();
			return response;
		},

		onSuccess: () => {
			toast.success("Register berhasil, silahkan login");
			navigate({ to: "/login" });
		},

		onError: () => {
			toast.error("Register gagal");
		},
	})
}