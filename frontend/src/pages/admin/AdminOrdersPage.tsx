import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ordersApi } from '@/lib/api/orders'
import type { OrderQuery } from '@/lib/api/orders'
import type { Order } from '@/types'
import { cn } from '@/lib/utils'

const statusOptions = [
  { value: undefined, label: '全部状态' },
  { value: 0, label: '待确认' },
  { value: 1, label: '已确认' },
  { value: 2, label: '已发货' },
  { value: 3, label: '已完成' },
  { value: 4, label: '已取消' },
]

const statusColors: Record<number, { bg: string; text: string }> = {
  0: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  1: { bg: 'bg-blue-100', text: 'text-blue-800' },
  2: { bg: 'bg-purple-100', text: 'text-purple-800' },
  3: { bg: 'bg-green-100', text: 'text-green-800' },
  4: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const query: OrderQuery = { page, pageSize: 10, status }
      const result = await ordersApi.getAllOrders(query)
      setOrders(result.data)
      setTotal(result.total)
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [page, status])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleConfirm = async (orderId: string) => {
    try {
      await ordersApi.confirmOrder(orderId)
      fetchOrders()
    } catch (error) {
      console.error('确认订单失败:', error)
    }
  }

  const handleShip = async (orderId: string) => {
    try {
      await ordersApi.shipOrder(orderId)
      fetchOrders()
    } catch (error) {
      console.error('发货失败:', error)
    }
  }

  const totalPages = Math.ceil(total / 10)

  const getStatusColor = (orderStatus: number | string) => {
    const statusNum = typeof orderStatus === 'number' ? orderStatus : 0
    return statusColors[statusNum] || { bg: 'bg-gray-100', text: 'text-gray-800' }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
        <p className="text-gray-600 mt-1">管理所有订单，确认订单、发货等操作</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <select
            value={status ?? ''}
            onChange={(e) => {
              setStatus(e.target.value ? Number(e.target.value) : undefined)
              setPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.label} value={option.value ?? ''}>
                {option.label}
              </option>
            ))}
          </select>

          <span className="text-sm text-gray-600">共 {total} 条订单</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无订单</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">订单号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">商品</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">下单时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{order.userName || '-'}</div>
                      <div className="text-xs text-gray-400">{order.userEmail || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.items.length} 件商品
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-red-600">
                      ¥{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(order.status).bg,
                          getStatusColor(order.status).text
                        )}
                      >
                        {order.statusText}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {order.status === 0 && (
                          <button
                            onClick={() => handleConfirm(order.id)}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            确认订单
                          </button>
                        )}
                        {order.status === 1 && (
                          <button
                            onClick={() => handleShip(order.id)}
                            className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            发货
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          详情
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="text-sm text-gray-600">
              第 {page} / {totalPages} 页
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
