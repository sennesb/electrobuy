import { Link } from 'react-router-dom'
import type { RecentOrder } from '@/types'

const statusMap: Record<number, { text: string; className: string }> = {
  0: { text: '待确认', className: 'bg-yellow-100 text-yellow-800' },
  1: { text: '已确认', className: 'bg-blue-100 text-blue-800' },
  2: { text: '已发货', className: 'bg-purple-100 text-purple-800' },
  3: { text: '已完成', className: 'bg-green-100 text-green-800' },
  4: { text: '已取消', className: 'bg-gray-100 text-gray-800' },
}

interface RecentOrdersProps {
  orders: RecentOrder[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">最近订单</h2>
        <div className="text-center text-gray-500 py-8">暂无订单数据</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
        <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
          查看全部 →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单编号
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                客户
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金额
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                时间
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link to={`/admin/orders/${order.id}`} className="hover:text-blue-600">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.customerName}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{order.totalAmount.toLocaleString()}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusMap[order.status]?.className || 'bg-gray-100 text-gray-800'}`}>
                    {statusMap[order.status]?.text || '未知'}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
