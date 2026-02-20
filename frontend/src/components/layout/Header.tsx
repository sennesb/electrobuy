import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { totalItems } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className={cn('bg-white shadow-sm border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ElectroBuy</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/products"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                产品目录
              </Link>
              <Link
                to="/products?categoryId=1"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                PLC控制器
              </Link>
              <Link
                to="/products?categoryId=2"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                变频器
              </Link>
              <Link
                to="/products?categoryId=3"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                传感器
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="搜索产品型号、名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block font-medium">{user.name}</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isUserMenuOpen && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      个人中心
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      我的订单
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    注册
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
