export interface User {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  role: UserRole
  isActive: boolean
  createdAt: string
}

export type UserRole = 'User' | 'EnterpriseUser' | 'Admin'

export interface Category {
  id: number
  name: string
  parentId: number | null
  parentName: string | null
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
}

export interface Product {
  id: string
  name: string
  modelNumber: string
  categoryId: number
  categoryName: string | null
  brand: string
  price: number
  unit: string
  stock: number
  minOrderQty: number
  specs: string | Record<string, string> | null
  description: string | null
  images: string[] | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ProductList {
  data: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CartItem {
  id: string
  productId: string
  productName: string
  modelNumber: string
  brand: string
  price: number
  quantity: number
  subtotal: number
  stock: number
  image: string | null
  isActive: boolean
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Completed' | 'Cancelled'

export interface OrderItem {
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
  status: OrderStatus | number
  statusText: string
  totalAmount: number
  remark: string | null
  items: OrderItem[]
  totalItems: number
  createdAt: string
  updatedAt: string | null
  userId?: string
  userName?: string
  userEmail?: string
}

export interface OrderList {
  data: Order[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AuthResponse {
  user: User
  token: string
  expiration: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: number
  createdAt: string
}

export interface DailySales {
  date: string
  amount: number
  orderCount: number
}

export interface DashboardStats {
  totalOrders: number
  totalSales: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: RecentOrder[]
  salesTrend: DailySales[]
}
