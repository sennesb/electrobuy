import { cn } from '@/lib/utils'
import type { OrderStatus as OrderStatusType } from '@/types'

export interface OrderStatusBadgeProps {
  status: OrderStatusType | number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig: Record<OrderStatusType, { label: string; bgColor: string; textColor: string }> = {
  Pending: {
    label: '待确认',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  Confirmed: {
    label: '已确认',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  Shipped: {
    label: '已发货',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  Completed: {
    label: '已完成',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  Cancelled: {
    label: '已取消',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
}

const statusNumberMap: Record<number, OrderStatusType> = {
  0: 'Pending',
  1: 'Confirmed',
  2: 'Shipped',
  3: 'Completed',
  4: 'Cancelled',
}

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

function normalizeStatus(status: OrderStatusType | number): OrderStatusType {
  if (typeof status === 'number') {
    return statusNumberMap[status] || 'Pending'
  }
  return status
}

export function OrderStatusBadge({ status, size = 'md', className }: OrderStatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status)
  const config = statusConfig[normalizedStatus]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.bgColor,
        config.textColor,
        sizeConfig[size],
        className
      )}
    >
      {config.label}
    </span>
  )
}

export interface OrderStatusStepsProps {
  status: OrderStatusType | number
  className?: string
}

const steps = [
  { key: 'Pending', label: '待确认', icon: '📋' },
  { key: 'Confirmed', label: '已确认', icon: '✅' },
  { key: 'Shipped', label: '已发货', icon: '🚚' },
  { key: 'Completed', label: '已完成', icon: '🎉' },
]

export function OrderStatusSteps({ status, className }: OrderStatusStepsProps) {
  const normalizedStatus = normalizeStatus(status)
  const currentStepIndex = steps.findIndex((s) => s.key === normalizedStatus)
  const isCancelled = normalizedStatus === 'Cancelled'

  if (isCancelled) {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-4', className)}>
        <span className="text-2xl">❌</span>
        <span className="text-lg font-medium text-gray-600">订单已取消</span>
      </div>
    )
  }

  return (
    <div className={cn('py-4', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          const isLast = index === steps.length - 1

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-blue-500 text-white ring-4 ring-blue-100',
                    !isCompleted && !isCurrent && 'bg-gray-200 text-gray-400'
                  )}
                >
                  {step.icon}
                </div>
                <span
                  className={cn(
                    'mt-2 text-sm font-medium',
                    (isCompleted || isCurrent) ? 'text-gray-900' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2 rounded-full transition-colors',
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
