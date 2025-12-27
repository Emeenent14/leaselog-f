import { create } from 'zustand'
import { apiClient, setAccessToken } from '@/lib/api/client'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  phone?: string
  company_name?: string
  subscription_tier: string
  subscription_status: string
  is_email_verified: boolean
  property_limit: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  phone?: string
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login/', { email, password })
    const { tokens, user } = response.data.data

    // Store tokens
    setAccessToken(tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)

    set({ user, isAuthenticated: true, isLoading: false })
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register/', data)
    const { tokens, user } = response.data.data

    // Store tokens
    setAccessToken(tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)

    set({ user, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      apiClient.post('/auth/logout/', { refresh: refreshToken }).catch(() => {})
    }

    setAccessToken(null)
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user })
  },

  checkAuth: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        set({ isLoading: false })
        return
      }

      // Try to refresh token
      const response = await apiClient.post('/auth/refresh/', {
        refresh: refreshToken,
      })

      const newAccessToken = response.data.access
      setAccessToken(newAccessToken)

      // Get user profile
      const userResponse = await apiClient.get('/users/me/')
      set({
        user: userResponse.data.data,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      localStorage.removeItem('refresh_token')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
