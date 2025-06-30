// import type { LoginCredentials, RegisterData } from "./types" // Assuming these types are declared in a separate file

// class AuthService {
//   private tokenKey = "auth_token"

//   async login(credentials: LoginCredentials): Promise<boolean> {
//     // Simple mock login - just store a flag
//     localStorage.setItem(this.tokenKey, "logged_in")
//     return true
//   }

//   async register(data: RegisterData): Promise<boolean> {
//     // Simple mock register - just store a flag
//     localStorage.setItem(this.tokenKey, "logged_in")
//     return true
//   }

//   logout() {
//     localStorage.removeItem(this.tokenKey)
//   }

//   isAuthenticated(): boolean {
//     return !!localStorage.getItem(this.tokenKey)
//   }
// }

// export const authService = new AuthService()
