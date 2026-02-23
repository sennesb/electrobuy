import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { OrderTable, OrderDetailModal } from '@/components/admin'
import { ordersApi, type Order, type OrderQuery } from '@/lib/api'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | undefined>()
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const pageSize = 10

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const query: OrderQuery = {
        page,
        pageSize,
        keyword: searchKeyword || undefined,
        status: filterStatus ? parseInt(filterStatus) : undefined,
        startDate: filterStartDate || undefined,
        endDate: filterEndDate || undefined,
      }
      const result = await ordersApi.getAllOrders(query)
      setOrders(result.data)
      setTotal(result.total)
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, filterStatus, filterStartDate, filterEndDate])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearch = () => {
    setPage(1)
    fetchOrders()
  }

  const handleReset = () => {
    setSearchKeyword('')
    setFilterStatus(undefined)
    setFilterStartDate('')
    setFilterEndDate('')
    setPage(1)
  }

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const handleConfirm = async (order: Order) => {
    setActionLoading(true)
    try {
      await ordersApi.confirmOrder(order.id)
      setIsDetailOpen(false)
      setSelectedOrder(null)
      fetchOrders()
    } catch (error: unknown) {
      console.error('确认订单失败:', error)
      const message = error instanceof Error ? error.message : '确认失败，请重试'
      alert(message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleShip = async (order: Order) => {
    setActionLoading(true)
    try {
      await ordersApi.shipOrder(order.id)
      setIsDetailOpen(false)
      setSelectedOrder(null)
      fetchOrders()
    } catch (error: unknown) {
      console.error('发货失败:', error)
      const message = error instanceof Error ? error.message : '发货失败，请重试'
      alert(message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleBatchConfirm = async () => {
    if (selectedIds.length === 0) {
      alert('请先选择要确认的订单')
      return
    }

    if (!confirm(`确定要批量确认选中的 ${selectedIds.length} 个订单吗？`)) {
      return
    }

    setActionLoading(true)
    try {
      const result = await ordersApi.batchConfirmOrders({ orderIds: selectedIds })
      alert(result.message)
      setSelectedIds([])
      fetchOrders()
    } catch (error: unknown) {
      console.error('批量确认失败:', error)
      const message = error instanceof Error ? error.message : '批量确认失败，请重试'
      alert(message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const query: OrderQuery = {
        keyword: searchKeyword || undefined,
        status: filterStatus ? parseInt(filterStatus) : undefined,
        startDate: filterStartDate || undefined,
        endDate: filterEndDate || undefined,
      }
      const blob = await ordersApi.exportOrders(query)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
        <p className="text-gray-600 mt-1">管理所有订单，查看详情、确认、发货等操作</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索订单号或用户..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus ?? ''}
            onChange={(e) => setFilterStatus(e.target.value || undefined)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="0">待确认</option>
            <option value="1">已确认</option>
            <option value="2">已发货</option>
            <option value="3">已完成</option>
            <option value="4">已取消</option>
          </select>

          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <span className="text-gray-500">至</span>

          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            重置
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            共 {total} 个订单
            {selectedIds.length > 0 && `，已选择 ${selectedIds.length} 个`}
          </span>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchConfirm}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                批量确认 ({selectedIds.length})
              </button>
            )}
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              导出 CSV
            </button>
          </div>
        </div>
      </div>

      <OrderTable
        orders={orders}
        loading={loading}
        selectedIds={selectedIds}
        onSelect={setSelectedIds}
        onViewDetail={handleViewDetail}
        onConfirm={handleConfirm}
        onShip={handleShip}
      />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
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

      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onConfirm={handleConfirm}
        onShip={handleShip}
        loading={actionLoading}
      />
    </AdminLayout>
  )
}
