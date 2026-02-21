import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { OrderStatusBadge } from './OrderStatus'
import type { Order } from '@/types'

export interface OrderCardProps {
  order: Order
  onCancel?: (orderId: string) => Promise<void>
  isCancelling?: boolean
  className?: string
}

export function OrderCard({ order, onCancel, isCancelling = false, className }: OrderCardProps) {
  const status = typeof order.status === 'number' ? order.status : 0
  const canCancel = status === 0

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

  const handleCancel = async () => {
    if (onCancel && window.confirm('确定要取消此订单吗？')) {
      await onCancel(order.id)
    }
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>订单编号: <span className="font-medium text-gray-900">{order.orderNumber}</span></span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">{formatDate(order.createdAt)}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                <p className="text-xs text-gray-500">{item.modelNumber}</p>
                <p className="text-xs text-gray-500">
                  ¥{item.unitPrice.toLocaleString()} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ¥{item.subtotal.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-gray-500 text-center">
              还有 {order.items.length - 3} 件商品...
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            共 <span className="font-medium text-gray-900">{order.totalItems}</span> 件商品
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm text-gray-600">订单金额: </span>
              <span className="text-lg font-bold text-red-600">
                ¥{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          {canCancel && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {isCancelling ? '取消中...' : '取消订单'}
            </Button>
          )}
          <Link to={`/orders/${order.id}`}>
            <Button variant="outline" size="sm">
              查看详情
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export interface OrderCardSkeletonProps {
  className?: string
}

export function OrderCardSkeleton({ className }: OrderCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
