import { create } from 'zustand'
import type { Cart } from '@/types'

interface CartState {
  cart: Cart | null
  isLoading: boolean
  totalItems: number
  setCart: (cart: Cart | null) => void
  setLoading: (loading: boolean) => void
  clearCart: () => void
  setTotalItems: (count: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  totalItems: 0,
  setCart: (cart) => set({ cart, totalItems: cart?.totalItems ?? 0 }),
  setLoading: (isLoading) => set({ isLoading }),
  clearCart: () => set({ cart: null, totalItems: 0 }),
  setTotalItems: (totalItems) => set({ totalItems }),
}))
