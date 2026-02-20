import apiClient from '@/lib/api/client'
import type { Cart } from '@/types'

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface UpdateCartRequest {
  quantity: number
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart')
    return response.data
  },

  getCartCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/cart/count')
    return response.data
  },

  addToCart: async (data: AddToCartRequest): Promise<void> => {
    await apiClient.post('/cart', data)
  },

  updateCartItem: async (id: string, data: UpdateCartRequest): Promise<void> => {
    await apiClient.put(`/cart/${id}`, data)
  },

  removeCartItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/cart/${id}`)
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart/clear')
  },
}
