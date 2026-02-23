import type { Order } from '@/lib/api'
import { cn } from '@/lib/utils'

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onConfirm?: (order: Order) => void
  onShip?: (order: Order) => void
  loading?: boolean
}

const statusColors: Record<number, string> = {
  0: 'bg-yellow-100 text-yellow-800',
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-purple-100 text-purple-800',
  3: 'bg-green-100 text-green-800',
  4: 'bg-red-100 text-red-800',
}

const statusTexts: Record<number, string> = {
  0: '待确认',
  1: '已确认',
  2: '已发货',
  3: '已完成',
  4: '已取消',
}

export function OrderDetailModal({ 
  isOpen, 
  onClose, 
  order, 
  onConfirm, 
  onShip,
  loading 
}: OrderDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(price)
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">订单详情</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">订单号</p>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">状态</p>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  statusColors[order.status] || 'bg-gray-100 text-gray-800'
                )}>
                  {statusTexts[order.status] || order.statusText}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">下单用户</p>
                <p className="font-medium">{order.userName || '未知用户'}</p>
                <p className="text-xs text-gray-500">{order.userEmail || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">下单时间</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              {order.updatedAt && (
                <div>
                  <p className="text-sm text-gray-500">更新时间</p>
                  <p className="font-medium">{formatDate(order.updatedAt)}</p>
                </div>
              )}
              {order.remark && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">备注</p>
                  <p className="font-medium">{order.remark}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">商品明细</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={item.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">型号: {item.modelNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                      <p className="font-medium text-gray-900">{formatPrice(item.unitPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">订单总额</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
              {order.status === 0 && onConfirm && (
                <button
                  onClick={() => onConfirm(order)}
                  disabled={loading}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? '处理中...' : '确认订单'}
                </button>
              )}
              {order.status === 1 && onShip && (
                <button
                  onClick={() => onShip(order)}
                  disabled={loading}
                  className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? '处理中...' : '确认发货'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
