import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  iconBgColor: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon, iconBgColor, trend, className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={cn('text-sm mt-1', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}
