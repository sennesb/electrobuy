import apiClient from '@/lib/api/client'

export interface AdminUser {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  orderCount: number
}

export interface UserList {
  data: AdminUser[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface UserQuery {
  page?: number
  pageSize?: number
  keyword?: string
  role?: string
  isActive?: boolean
}

export interface UpdateUserByAdminDto {
  name?: string
  company?: string
  phone?: string
  role: string
  isActive: boolean
}

export interface ResetPasswordDto {
  newPassword: string
}

export const usersApi = {
  getUsers: async (params?: UserQuery): Promise<UserList> => {
    const response = await apiClient.get<UserList>('/users', { params })
    return response.data
  },

  getUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get<AdminUser>(`/users/${id}`)
    return response.data
  },

  updateUser: async (id: string, data: UpdateUserByAdminDto): Promise<AdminUser> => {
    const response = await apiClient.put<AdminUser>(`/users/${id}`, data)
    return response.data
  },

  resetPassword: async (id: string, data: ResetPasswordDto): Promise<void> => {
    await apiClient.post(`/users/${id}/reset-password`, data)
  },

  toggleStatus: async (id: string): Promise<{ message: string; isActive: boolean }> => {
    const response = await apiClient.post<{ message: string; isActive: boolean }>(`/users/${id}/toggle-status`)
    return response.data
  },

  getUserCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/users/count')
    return response.data
  },
}
