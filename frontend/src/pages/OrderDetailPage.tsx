import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { OrderStatusBadge, OrderStatusSteps } from '@/components/orders'
import { ordersApi } from '@/lib/api'
import { useAuthStore } from '@/stores'

export default function OrderDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStore()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/orders/${id}` } })
    }
  }, [isAuthenticated, navigate, id])

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(id!),
    enabled: isAuthenticated && !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancelOrder(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setShowCancelConfirm(false)
    },
  })

  const completeMutation = useMutation({
    mutationFn: () => ordersApi.completeOrder(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setShowCompleteConfirm(false)
    },
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const canCancel = order ? (typeof order.status === 'number' ? order.status === 0 : order.status === 'Pending') : false
  const canComplete = order ? (typeof order.status === 'number' ? order.status === 2 : order.status === 'Shipped') : false

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
              <p className="text-gray-500 mb-4">订单不存在</p>
              <Link
                to="/orders"
                className="text-blue-600 hover:text-blue-700"
              >
                返回订单列表
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    )
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
            <Link to="/orders" className="hover:text-blue-600">
              我的订单
            </Link>
            <span>/</span>
            <span className="text-gray-900">订单详情</span>
          </nav>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
            <OrderStatusBadge status={order.status} size="lg" />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <OrderStatusSteps status={order.status} />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">订单信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">订单编号：</span>
                <span className="text-gray-900">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">下单时间：</span>
                <span className="text-gray-900">{formatDate(order.createdAt)}</span>
              </div>
              {order.updatedAt && (
                <div>
                  <span className="text-gray-500">更新时间：</span>
                  <span className="text-gray-900">{formatDate(order.updatedAt)}</span>
                </div>
              )}
              {order.remark && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">订单备注：</span>
                  <span className="text-gray-900">{order.remark}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              商品清单 ({order.items.reduce((sum, item) => sum + item.quantity, 0)}件)
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">{item.modelNumber}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      ¥{item.unitPrice.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium text-gray-900">
                      ¥{(item.unitPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end items-center gap-2 mt-6 pt-4 border-t border-gray-200">
              <span className="text-gray-600">订单金额：</span>
              <span className="text-2xl font-bold text-red-600">
                ¥{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link to="/orders">
              <Button variant="outline">返回订单列表</Button>
            </Link>
            <div className="flex gap-3">
              {canComplete && (
                <Button
                  onClick={() => setShowCompleteConfirm(true)}
                  disabled={completeMutation.isPending}
                >
                  {completeMutation.isPending ? '确认中...' : '确认收货'}
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="danger"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? '取消中...' : '取消订单'}
                </Button>
              )}
            </div>
          </div>

          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">确认取消订单</h3>
                <p className="text-gray-600 mb-6">
                  确定要取消订单 {order.orderNumber} 吗？取消后无法恢复。
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                  >
                    再想想
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? '取消中...' : '确认取消'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showCompleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">确认收货</h3>
                <p className="text-gray-600 mb-6">
                  确认已收到订单 {order.orderNumber} 的商品吗？
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCompleteConfirm(false)}
                  >
                    再想想
                  </Button>
                  <Button
                    onClick={() => completeMutation.mutate()}
                    disabled={completeMutation.isPending}
                  >
                    {completeMutation.isPending ? '确认中...' : '确认收货'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
