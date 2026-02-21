import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MainLayout } from '@/components/layout'
import { ProfileForm, ChangePasswordForm } from '@/components/profile'
import { useAuthStore } from '@/stores'
import type { User } from '@/types'
import { cn } from '@/lib/utils'

type TabType = 'profile' | 'password'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user, setAuth } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/profile' } })
    }
  }, [isAuthenticated, navigate])

  const handleProfileUpdate = (updatedUser: User) => {
    const token = localStorage.getItem('token') || ''
    setAuth(updatedUser, token)
  }

  if (!user) {
    return null
  }

  const tabs: { value: TabType; label: string }[] = [
    { value: 'profile', label: '个人信息' },
    { value: 'password', label: '修改密码' },
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-blue-600">
              首页
            </Link>
            <span>/</span>
            <span className="text-gray-900">个人中心</span>
          </nav>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h1 className="text-xl font-bold text-gray-900">个人中心</h1>
            </div>

            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      'px-6 py-4 text-sm font-medium transition-colors relative',
                      activeTab === tab.value
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.value && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
                  <ProfileForm user={user} onSuccess={handleProfileUpdate} />
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">修改密码</h2>
                  <ChangePasswordForm />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">快捷入口</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/orders"
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">我的订单</p>
                    <p className="text-sm text-gray-500">查看订单历史</p>
                  </div>
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">购物车</p>
                    <p className="text-sm text-gray-500">查看购物车商品</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
