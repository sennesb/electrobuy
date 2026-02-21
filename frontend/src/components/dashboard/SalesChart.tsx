import type { DailySales } from '@/types'

interface SalesChartProps {
  data: DailySales[]
}

export function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">销售趋势</h2>
        <div className="text-center text-gray-500 py-8">暂无销售数据</div>
      </div>
    )
  }

  const maxAmount = Math.max(...data.map(d => d.amount), 1)
  const chartHeight = 200

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(1)}万`
    }
    return `¥${amount.toLocaleString()}`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">近7天销售趋势</h2>
      
      <div className="flex items-end justify-between gap-2" style={{ height: chartHeight + 40 }}>
        {data.map((day, index) => {
          const barHeight = (day.amount / maxAmount) * chartHeight
          const isToday = index === data.length - 1
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end" style={{ height: chartHeight }}>
                <div 
                  className={`w-full max-w-[40px] rounded-t-md transition-all duration-300 ${isToday ? 'bg-blue-500' : 'bg-blue-300'}`}
                  style={{ height: Math.max(barHeight, 4) }}
                  title={`${formatDate(day.date)}: ${formatAmount(day.amount)} (${day.orderCount}单)`}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                <div>{formatDate(day.date)}</div>
                <div className="text-gray-400">{day.orderCount}单</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500">总销售额: </span>
            <span className="font-semibold text-gray-900">
              {formatAmount(data.reduce((sum, d) => sum + d.amount, 0))}
            </span>
          </div>
          <div>
            <span className="text-gray-500">总订单: </span>
            <span className="font-semibold text-gray-900">
              {data.reduce((sum, d) => sum + d.orderCount, 0)}单
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
