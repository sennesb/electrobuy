import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

export interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const imageUrl = product.images?.[0] || '/placeholder-product.png'
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 10

  return (
    <Link
      to={`/products/${product.id}`}
      className={cn(
        'group flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden',
        'hover:shadow-lg hover:border-blue-300 transition-all duration-200',
        className
      )}
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"%3E%3Cpath d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium text-sm bg-red-600 px-3 py-1 rounded">
              缺货
            </span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded">
              库存紧张
            </span>
          </div>
        )}
        {!product.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium text-sm bg-gray-600 px-3 py-1 rounded">
              已下架
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
        </div>

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-2">{product.modelNumber}</p>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-red-600">
                ¥{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
            </div>
            {product.stock > 0 && (
              <span className="text-xs text-gray-500">
                库存: {product.stock}
              </span>
            )}
          </div>
          {product.minOrderQty > 1 && (
            <p className="text-xs text-gray-400 mt-1">
              起订量: {product.minOrderQty}{product.unit}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export interface ProductCardSkeletonProps {
  className?: string
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 overflow-hidden',
        className
      )}
    >
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}
