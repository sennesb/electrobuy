import { create } from 'zustand'
import type { Cart } from '@/types'

interface CartState {
  cart: Cart | null
  isLoading: boolean
  setCart: (cart: Cart | null) => void
  setLoading: (loading: boolean) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  setCart: (cart) => set({ cart }),
  setLoading: (isLoading) => set({ isLoading }),
  clearCart: () => set({ cart: null }),
}))
