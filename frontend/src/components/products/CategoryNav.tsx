import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { CategoryTree } from '@/types'

export interface CategoryNavProps {
  categories: CategoryTree[]
  selectedCategoryId?: number
  className?: string
}

export function CategoryNav({ categories, selectedCategoryId, className }: CategoryNavProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">产品分类</h3>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/products"
              className={cn(
                'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                !selectedCategoryId
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
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              selectedCategoryId={selectedCategoryId}
              level={0}
            />
          ))}
        </ul>
      </nav>
    </div>
  )
}

interface CategoryItemProps {
  category: CategoryTree
  selectedCategoryId?: number
  level: number
}

function CategoryItem({ category, selectedCategoryId, level }: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0
  const isSelected = selectedCategoryId === category.id
  const paddingLeft = 12 + level * 16

  return (
    <li>
      <Link
        to={`/products?categoryId=${category.id}`}
        className={cn(
          'flex items-center py-2 text-sm rounded-md transition-colors',
          isSelected
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        )}
        style={{ paddingLeft }}
      >
        {hasChildren && (
          <svg
            className="w-4 h-4 mr-1 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
        <span className={hasChildren ? '' : 'ml-5'}>{category.name}</span>
      </Link>
      {hasChildren && (
        <ul>
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedCategoryId={selectedCategoryId}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export interface CategoryNavHorizontalProps {
  categories: CategoryTree[]
  selectedCategoryId?: number
  className?: string
}

export function CategoryNavHorizontal({
  categories,
  selectedCategoryId,
  className,
}: CategoryNavHorizontalProps) {
  const parentCategories = categories.filter((cat) => !cat.parentId || cat.parentId === null)

  return (
    <div className={cn('bg-white border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 py-3 overflow-x-auto">
          <Link
            to="/products"
            className={cn(
              'flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors',
              !selectedCategoryId
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            全部
          </Link>
          {parentCategories.map((category) => (
            <Link
              key={category.id}
              to={`/products?categoryId=${category.id}`}
              className={cn(
                'flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors',
                selectedCategoryId === category.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
