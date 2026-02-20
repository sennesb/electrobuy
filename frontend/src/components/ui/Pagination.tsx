import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showQuickJumper?: boolean
  showTotal?: boolean
  total?: number
  pageSize?: number
  className?: string
  siblingCount?: number
}

function usePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | 'dots')[] {
  return useMemo(() => {
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, 'dots', totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      )
      return [firstPageIndex, 'dots', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [firstPageIndex, 'dots', ...middleRange, 'dots', lastPageIndex]
    }

    return []
  }, [currentPage, totalPages, siblingCount])
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showQuickJumper = false,
  showTotal = false,
  total,
  pageSize = 20,
  className,
  siblingCount = 1,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState('')
  const paginationRange = usePaginationRange(currentPage, totalPages, siblingCount)

  const handleJump = () => {
    const page = parseInt(jumpValue, 10)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJump()
    }
  }

  if (totalPages <= 1) return null

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {showTotal && total !== undefined && (
        <span className="mr-4 text-sm text-gray-600">
          共 {total} 条记录，每页 {pageSize} 条
        </span>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
          currentPage === 1
            ? 'cursor-not-allowed border-gray-200 text-gray-300'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        )}
        aria-label="上一页"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === 'dots') {
          return (
            <span key={`dots-${index}`} className="h-9 w-9 text-center leading-9 text-gray-400">
              ...
            </span>
          )
        }

        const isActive = pageNumber === currentPage

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
              isActive
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
          currentPage === totalPages
            ? 'cursor-not-allowed border-gray-200 text-gray-300'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        )}
        aria-label="下一页"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showQuickJumper && (
        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">跳至</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 w-14 rounded-lg border border-gray-300 px-2 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">页</span>
          <button
            onClick={handleJump}
            className="h-9 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            确定
          </button>
        </div>
      )}
    </div>
  )
}
