let accessToken: string | null = null

export const tokenService = {
    set(token: string) {
        accessToken = token
        localStorage.setItem('token', token)
    },
    get() {
        return accessToken || localStorage.getItem('token')
    },
    clear() {
        accessToken = null
        localStorage.removeItem('token')
    }
}