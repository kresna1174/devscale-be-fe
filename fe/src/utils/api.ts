import ky from "ky";
import { tokenService } from "libs/auth";

export const api = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8081",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	hooks: {
		beforeRequest: [
			request => {
				const token = tokenService.get()
				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`)
				}
			}
		]
	}
});