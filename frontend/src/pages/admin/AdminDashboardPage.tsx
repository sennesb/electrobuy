import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { StatCard, RecentOrders, SalesChart } from '@/components/dashboard'
import { Loading } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { dashboardApi } from '@/lib/api'

export function AdminDashboardPage() {
  const { user } = useAuthStore()
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
  })

  if (isLoading) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">加载仪表盘数据失败</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">管理仪表盘</h1>
        <p className="text-gray-600 mt-1">欢迎回来，{user?.name || '管理员'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总订单数"
          value={stats?.totalOrders ?? 0}
          icon="📋"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="总销售额"
          value={`¥${(stats?.totalSales ?? 0).toLocaleString()}`}
          icon="💰"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="产品数量"
          value={stats?.totalProducts ?? 0}
          icon="📦"
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="用户数量"
          value={stats?.totalUsers ?? 0}
          icon="👥"
          iconBgColor="bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="待处理订单"
          value={stats?.pendingOrders ?? 0}
          icon="⏳"
          iconBgColor="bg-yellow-100"
        />
        <StatCard
          title="库存紧张产品"
          value={stats?.lowStockProducts ?? 0}
          icon="⚠️"
          iconBgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={stats?.recentOrders ?? []} />
        <SalesChart data={stats?.salesTrend ?? []} />
      </div>
    </AdminLayout>
  )
}

export default AdminDashboardPage
