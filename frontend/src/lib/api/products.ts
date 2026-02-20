import apiClient from '@/lib/api/client'
import type { Category, CategoryTree, Product, ProductList } from '@/types'

export interface ProductQuery {
  page?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const productsApi = {
  getProducts: async (params?: ProductQuery): Promise<ProductList> => {
    const response = await apiClient.get<ProductList>('/products', { params })
    return response.data
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  getBrands: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/products/brands')
    return response.data
  },
}

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories')
    return response.data
  },

  getCategoryTree: async (): Promise<CategoryTree[]> => {
    const response = await apiClient.get<CategoryTree[]>('/categories/tree')
    return response.data
  },

  getCategory: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`)
    return response.data
  },
}
