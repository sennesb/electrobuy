import apiClient from '@/lib/api/client'
import type { Order, OrderList } from '@/types'

export interface CreateOrderRequest {
  remark?: string
}

export interface OrderQuery {
  page?: number
  pageSize?: number
  status?: string
}

export const ordersApi = {
  getOrders: async (params?: OrderQuery): Promise<OrderList> => {
    const response = await apiClient.get<OrderList>('/orders', { params })
    return response.data
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },

  getOrderCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/orders/count')
    return response.data
  },

  createOrder: async (data?: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data)
    return response.data
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`)
    return response.data
  },
}
