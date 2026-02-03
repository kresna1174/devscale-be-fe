// Utility to get current user from localStorage
// Since we don't have JWT decoding, we'll store user data separately

interface User {
	id: string;
	email: string;
	name: string | null;
}

export const userService = {
	set(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
	},
	get(): User | null {
		const userData = localStorage.getItem('user');
		return userData ? JSON.parse(userData) : null;
	},
	clear() {
		localStorage.removeItem('user');
	}
};

export const getCurrentUser = (): User | null => {
	return userService.get();
};