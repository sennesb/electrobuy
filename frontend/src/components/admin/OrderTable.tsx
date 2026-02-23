import type { Order } from '@/lib/api'
import { cn } from '@/lib/utils'

interface OrderTableProps {
  orders: Order[]
  loading?: boolean
  selectedIds?: string[]
  onSelect?: (ids: string[]) => void
  onViewDetail: (order: Order) => void
  onConfirm?: (order: Order) => void
  onShip?: (order: Order) => void
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

export function OrderTable({ 
  orders, 
  loading, 
  selectedIds = [], 
  onSelect,
  onViewDetail, 
  onConfirm, 
  onShip 
}: OrderTableProps) {
  const handleSelectAll = () => {
    if (!onSelect) return
    if (selectedIds.length === orders.length) {
      onSelect([])
    } else {
      onSelect(orders.map(o => o.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (!onSelect) return
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(i => i !== id))
    } else {
      onSelect([...selectedIds, id])
    }
  }

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">加载中...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg">暂无订单</p>
          <p className="text-sm mt-1">没有符合条件的订单</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {onSelect && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">订单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">商品数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">总金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">下单时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                {onSelect && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onViewDetail(order)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {order.orderNumber}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{order.userName || '未知用户'}</p>
                    <p className="text-xs text-gray-500">{order.userEmail || ''}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {order.items.length} 件
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusColors[order.status] || 'bg-gray-100 text-gray-800'
                  )}>
                    {statusTexts[order.status] || order.statusText}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetail(order)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      详情
                    </button>
                    {order.status === 0 && onConfirm && (
                      <button
                        onClick={() => onConfirm(order)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        确认
                      </button>
                    )}
                    {order.status === 1 && onShip && (
                      <button
                        onClick={() => onShip(order)}
                        className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        发货
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
