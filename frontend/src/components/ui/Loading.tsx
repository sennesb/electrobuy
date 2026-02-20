import { cn } from '@/lib/utils'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-blue-600', spinnerSizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export interface LoadingProps {
  text?: string
  className?: string
}

export function Loading({ text = '加载中...', className }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-8', className)}>
      <Spinner size="lg" />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export interface FullscreenLoadingProps {
  text?: string
}

export function FullscreenLoading({ text = '加载中...' }: FullscreenLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" />
      {text && <p className="mt-4 text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantStyles: Record<string, string> = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variantStyles[variant],
        className
      )}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  )
}

export interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 p-4', className)}>
      <Skeleton variant="rectangular" className="mb-4 h-40 w-full" />
      <Skeleton variant="text" className="mb-2 h-4 w-3/4" />
      <Skeleton variant="text" className="mb-2 h-4 w-1/2" />
      <Skeleton variant="text" className="h-4 w-1/4" />
    </div>
  )
}

export interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="mb-3 flex gap-4 border-b border-gray-100 pb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
