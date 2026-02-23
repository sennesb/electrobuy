import apiClient from '@/lib/api/client'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  modelNumber: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  status: number
  statusText: string
  totalAmount: number
  remark: string | null
  createdAt: string
  updatedAt: string | null
  items: OrderItem[]
  totalItems: number
  userId?: string
  userName?: string | null
  userEmail?: string | null
}

export interface OrderList {
  data: Order[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface OrderQuery {
  page?: number
  pageSize?: number
  status?: number
  keyword?: string
  startDate?: string
  endDate?: string
}

export interface CreateOrderDto {
  remark?: string
}

export interface ShipOrderDto {
  trackingNumber?: string
}

export interface BatchConfirmDto {
  orderIds: string[]
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

  createOrder: async (data?: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data || {})
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

  getOrderCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/orders/count')
    return response.data
  },

  getAllOrders: async (params?: OrderQuery): Promise<OrderList> => {
    const response = await apiClient.get<OrderList>('/orders/admin', { params })
    return response.data
  },

  getOrderForAdmin: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/admin/${id}`)
    return response.data
  },

  confirmOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/admin/${id}/confirm`)
    return response.data
  },

  shipOrder: async (id: string, data?: ShipOrderDto): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/admin/${id}/ship`, data)
    return response.data
  },

  exportOrders: async (params?: OrderQuery): Promise<Blob> => {
    const response = await apiClient.get('/orders/admin/export', {
      params,
      responseType: 'blob'
    })
    return response.data
  },

  batchConfirmOrders: async (data: BatchConfirmDto): Promise<{ count: number; message: string }> => {
    const response = await apiClient.post<{ count: number; message: string }>('/orders/admin/batch-confirm', data)
    return response.data
  },
}
