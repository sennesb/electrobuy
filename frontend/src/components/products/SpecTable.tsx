import { cn } from '@/lib/utils'

export interface SpecTableProps {
  specs: Record<string, string> | null
  className?: string
}

export function SpecTable({ specs, className }: SpecTableProps) {
  if (!specs || Object.keys(specs).length === 0) {
    return (
      <div className={cn('text-gray-500 text-sm', className)}>
        暂无规格参数
      </div>
    )
  }

  const specEntries = Object.entries(specs)

  return (
    <div className={cn('overflow-hidden rounded-lg border border-gray-200', className)}>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-200">
          {specEntries.map(([key, value], index) => (
            <tr
              key={key}
              className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
            >
              <td className="px-4 py-3 font-medium text-gray-700 w-1/3 whitespace-nowrap">
                {key}
              </td>
              <td className="px-4 py-3 text-gray-900">
                {value || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export interface SpecTableSkeletonProps {
  rows?: number
  className?: string
}

export function SpecTableSkeleton({ rows = 5, className }: SpecTableSkeletonProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-gray-200', className)}>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, index) => (
            <tr
              key={index}
              className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
            >
              <td className="px-4 py-3 w-1/3">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
