import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ProductFilterProps {
  brands: string[]
  selectedBrand?: string
  priceRange?: { min?: number; max?: number }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onBrandChange: (brand?: string) => void
  onPriceChange: (min?: number, max?: number) => void
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onReset: () => void
  className?: string
}

const sortOptions = [
  { value: 'createdAt_desc', label: '最新上架' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
  { value: 'name_asc', label: '名称 A-Z' },
  { value: 'stock_desc', label: '库存最多' },
]

export function ProductFilter({
  brands,
  selectedBrand,
  priceRange,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onBrandChange,
  onPriceChange,
  onSortChange,
  onReset,
  className,
}: ProductFilterProps) {
  const [minPrice, setMinPrice] = useState(priceRange?.min?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(priceRange?.max?.toString() || '')
  const [isExpanded, setIsExpanded] = useState(true)

  const handlePriceApply = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined
    const max = maxPrice ? parseFloat(maxPrice) : undefined
    onPriceChange(min, max)
  }

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('_')
    onSortChange(newSortBy, newSortOrder as 'asc' | 'desc')
  }

  const currentSort = `${sortBy}_${sortOrder}`

  const hasActiveFilters = selectedBrand || priceRange?.min || priceRange?.max

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 border-b border-gray-200"
      >
        <h3 className="font-medium text-gray-900">筛选条件</h3>
        <svg
          className={cn('w-5 h-5 text-gray-500 transition-transform', isExpanded && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {brands.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">品牌</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onBrandChange(undefined)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    !selectedBrand
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  )}
                >
                  全部
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => onBrandChange(brand)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      selectedBrand === brand
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    )}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">价格区间</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="最低价"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="最高价"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handlePriceApply}
              className="mt-2 w-full py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              应用价格筛选
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              清除筛选
            </button>
          )}
        </div>
      )}
    </div>
  )
}
