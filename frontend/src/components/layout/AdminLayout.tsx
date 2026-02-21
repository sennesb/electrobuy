import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
}

const menuItems = [
  { path: '/admin/dashboard', label: '仪表盘', icon: '📊' },
  { path: '/admin/orders', label: '订单管理', icon: '📋' },
  { path: '/admin/products', label: '产品管理', icon: '📦' },
  { path: '/admin/users', label: '用户管理', icon: '👥' },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300',
            !sidebarOpen && '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-lg font-bold">管理后台</span>
            </Link>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </aside>

        <div
          className={cn(
            'flex-1 transition-all duration-300',
            sidebarOpen ? 'ml-64' : 'ml-0'
          )}
        >
          <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="ml-4 flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">
                返回前台
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.role === 'Admin' ? '管理员' : user?.role === 'EnterpriseUser' ? '企业用户' : '普通用户'}
              </span>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
