import { create } from 'zustand'
import { logoutUser, getCurrentUser } from '../services/authService'

interface AuthUser {
  username: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const storedUser = localStorage.getItem('rica_user_profile')

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,

  login: (user) => {
    localStorage.setItem('rica_user_profile', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: async () => {
    try {
      await logoutUser()
    } catch {

    }
    localStorage.removeItem('rica_user_profile')
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    try {
      const profile = await getCurrentUser()
      const userData = { username: profile.username, role: profile.role }
      localStorage.setItem('rica_user_profile', JSON.stringify(userData))
      set({ user: userData, isAuthenticated: true })
    } catch {
      localStorage.removeItem('rica_user_profile')
      set({ user: null, isAuthenticated: false })
      throw new Error('Not authenticated')
    }
  },
}))
