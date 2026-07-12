import api from '../../../services/api'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  username: string
  role: string
}

interface RegisterData {
  username: string
  password: string
  role?: string
}

interface UserProfile {
  id: number
  username: string
  role: string
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/auth/login', credentials)
  return response.data
}

export const registerUser = async (data: RegisterData): Promise<void> => {
  await api.post('/api/auth/register', data)
}

export const logoutUser = async (): Promise<void> => {
  await api.post('/api/auth/logout')
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/api/auth/me')
  return response.data
}
