import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface SidebarProps {
  className?: string
  categories?: Category[]
  title?: string
}

const defaultCategories: Category[] = [
  { id: 1, name: 'PLC可编程控制器', parentId: null, parentName: null, description: '', sortOrder: 1, isActive: true, createdAt: '' },
  { id: 2, name: '变频器', parentId: null, parentName: null, description: '', sortOrder: 2, isActive: true, createdAt: '' },
  { id: 3, name: '传感器', parentId: null, parentName: null, description: '', sortOrder: 3, isActive: true, createdAt: '' },
  { id: 4, name: '低压电器', parentId: null, parentName: null, description: '', sortOrder: 4, isActive: true, createdAt: '' },
  { id: 5, name: '人机界面', parentId: null, parentName: null, description: '', sortOrder: 5, isActive: true, createdAt: '' },
  { id: 6, name: '伺服系统', parentId: null, parentName: null, description: '', sortOrder: 6, isActive: true, createdAt: '' },
  { id: 7, name: '工业通信', parentId: null, parentName: null, description: '', sortOrder: 7, isActive: true, createdAt: '' },
  { id: 8, name: '电源与配电', parentId: null, parentName: null, description: '', sortOrder: 8, isActive: true, createdAt: '' },
]

export function Sidebar({
  className,
  categories = defaultCategories,
  title = '产品分类',
}: SidebarProps) {
  const location = useLocation()
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const isActive = (categoryId: number) => {
    const params = new URLSearchParams(location.search)
    const currentCategoryId = params.get('categoryId')
    return currentCategoryId === String(categoryId)
  }

  const parentCategories = categories.filter((cat) => cat.parentId === null)

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/products"
              className={cn(
                'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                location.pathname === '/products' && !location.search
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              全部产品
            </Link>
          </li>

          {parentCategories.map((category) => {
            const hasChildren = categories.some((cat) => cat.parentId === category.id)
            const isExpanded = expandedCategories.includes(category.id)

            return (
              <li key={category.id}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <span>{category.name}</span>
                      <svg
                        className={cn(
                          'w-4 h-4 transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isExpanded && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {categories
                          .filter((cat) => cat.parentId === category.id)
                          .map((child) => (
                            <li key={child.id}>
                              <Link
                                to={`/products?categoryId=${child.id}`}
                                className={cn(
                                  'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                                  isActive(child.id)
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                )}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={`/products?categoryId=${category.id}`}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                      isActive(category.id)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {category.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">热门品牌</h3>
        <div className="flex flex-wrap gap-2">
          {['西门子', '三菱', 'ABB', '施耐德', '欧姆龙'].map((brand) => (
            <Link
              key={brand}
              to={`/products?brand=${encodeURIComponent(brand)}`}
              className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
