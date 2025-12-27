import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Token management
let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const getAccessToken = () => accessToken

// Request interceptor
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          })

          const newAccessToken = response.data.access
          setAccessToken(newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('refresh_token')
        setAccessToken(null)
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// API response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    pagination?: {
      page: number
      per_page: number
      total: number
      total_pages: number
      has_next: boolean
      has_prev: boolean
    }
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{ field: string; message: string }>
  }
}
