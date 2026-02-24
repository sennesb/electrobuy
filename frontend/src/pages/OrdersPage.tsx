import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { MainLayout } from '@/components/layout'
import { Pagination } from '@/components/ui'
import { OrderCard, OrderCardSkeleton } from '@/components/orders'
import { ordersApi } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const { t } = useTranslation('orders')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const statusFilters: { value: number | 'all'; label: string }[] = [
    { value: 'all', label: t('filter.all') },
    { value: 0, label: t('filter.pending') },
    { value: 1, label: t('filter.confirmed') },
    { value: 2, label: t('filter.shipped') },
    { value: 3, label: t('filter.completed') },
    { value: 4, label: t('filter.cancelled') },
  ]

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
              {t('common:home', { ns: 'common' })}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{t('title')}</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>

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
              <p className="text-gray-500 mb-4">{t('empty.title')}</p>
              <p className="text-gray-400 text-sm mb-4">{t('empty.description')}</p>
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('empty.button')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
