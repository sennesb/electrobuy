import apiClient from '@/lib/api/client'
import type { Order, OrderList } from '@/types'

export interface CreateOrderRequest {
  remark?: string
}

export interface OrderQuery {
  page?: number
  pageSize?: number
  status?: number
}

export interface ShipOrderRequest {
  trackingNumber?: string
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
    const response = await apiClient.get<{ count: number }>('/orders/count')
    return response.data.count
  },

  createOrder: async (data?: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data ?? {})
    return response.data
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`)
    return response.data
  },

  completeOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/complete`)
    return response.data
  },

  getAllOrders: async (params?: OrderQuery): Promise<OrderList> => {
    const response = await apiClient.get<OrderList>('/orders/admin/all', { params })
    return response.data
  },

  confirmOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/admin/${id}/confirm`)
    return response.data
  },

  shipOrder: async (id: string, data?: ShipOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/admin/${id}/ship`, data ?? {})
    return response.data
  },
}
