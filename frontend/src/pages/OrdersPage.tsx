import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout'
import { Pagination } from '@/components/ui'
import { OrderCard, OrderCardSkeleton } from '@/components/orders'
import { ordersApi } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

const statusFilters: { value: number | 'all'; label: string }[] = [
  { value: 'all', label: '全部订单' },
  { value: 0, label: '待确认' },
  { value: 1, label: '已确认' },
  { value: 2, label: '已发货' },
  { value: 3, label: '已完成' },
  { value: 4, label: '已取消' },
]

export default function OrdersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/orders' } })
    }
  }, [isAuthenticated, navigate])

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, statusFilter],
    queryFn: () =>
      ordersApi.getOrders({
        page,
        pageSize,
        status: statusFilter === 'all' ? undefined : statusFilter,
      }),
    enabled: isAuthenticated,
  })

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => ordersApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const handleCancelOrder = async (orderId: string) => {
    await cancelMutation.mutateAsync(orderId)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-blue-600">
              首页
            </Link>
            <span>/</span>
            <span className="text-gray-900">我的订单</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">我的订单</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setStatusFilter(filter.value)
                  setPage(1)
                }}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  statusFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              <div className="space-y-4">
                {data.data.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onCancel={handleCancelOrder}
                    isCancelling={cancelMutation.isPending}
                  />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    showTotal
                    total={data.total}
                    pageSize={pageSize}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500 mb-4">暂无订单记录</p>
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                去购物
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
