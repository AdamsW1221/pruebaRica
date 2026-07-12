import api from '../../../services/api'

export interface UserItem {
  id: number
  username: string
  role: 'SuperAdmin' | 'Admin' | 'User'
  createdAt: string
}

export const getAllUsers = async (): Promise<UserItem[]> => {
  const res = await api.get<UserItem[]>('/api/users')
  return res.data
}

export const updateUserRole = async (id: number, role: 'SuperAdmin' | 'Admin' | 'User'): Promise<void> => {
  await api.put(`/api/users/${id}/role`, { role })
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/api/users/${id}`)
}
