import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import type { Product } from '@/types'

export interface ProductInfoProps {
  product: Product
  onAddToCart: (quantity: number) => Promise<void>
  isAddingToCart?: boolean
  className?: string
}

export function ProductInfo({
  product,
  onAddToCart,
  isAddingToCart = false,
  className,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(product.minOrderQty)
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 10
  const maxQuantity = Math.min(product.stock, 999)

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10)
    if (isNaN(num)) {
      setQuantity(product.minOrderQty)
    } else if (num < product.minOrderQty) {
      setQuantity(product.minOrderQty)
    } else if (num > maxQuantity) {
      setQuantity(maxQuantity)
    } else {
      setQuantity(num)
    }
  }

  const handleDecrease = () => {
    if (quantity > product.minOrderQty) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const handleAddToCart = async () => {
    if (isOutOfStock || !product.isActive) return
    await onAddToCart(quantity)
  }

  const subtotal = product.price * quantity

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {product.brand}
          </span>
          {product.categoryName && (
            <Link
              to={`/products?categoryId=${product.categoryId}`}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              {product.categoryName}
            </Link>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        <p className="text-gray-500">
          型号：<span className="text-gray-900 font-medium">{product.modelNumber}</span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-red-600">
            ¥{product.price.toLocaleString()}
          </span>
          <span className="text-gray-500">/{product.unit}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">库存：</span>
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">缺货</span>
            ) : isLowStock ? (
              <span className="text-orange-600 font-medium">{product.stock} {product.unit} (库存紧张)</span>
            ) : (
              <span className="text-green-600 font-medium">{product.stock} {product.unit}</span>
            )}
          </div>

          {product.minOrderQty > 1 && (
            <div className="text-gray-500">
              起订量：<span className="font-medium">{product.minOrderQty} {product.unit}</span>
            </div>
          )}
        </div>
      </div>

      {!isOutOfStock && product.isActive && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">数量：</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                disabled={quantity <= product.minOrderQty}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-lg border transition-colors',
                  quantity <= product.minOrderQty
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min={product.minOrderQty}
                max={maxQuantity}
                className="w-20 text-center"
              />

              <button
                onClick={handleIncrease}
                disabled={quantity >= maxQuantity}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-lg border transition-colors',
                  quantity >= maxQuantity
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <span className="text-gray-500 text-sm">
              (小计: <span className="font-medium text-gray-900">¥{subtotal.toLocaleString()}</span>)
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              isLoading={isAddingToCart}
              className="flex-1"
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            >
              加入购物车
            </Button>
          </div>
        </div>
      )}

      {isOutOfStock && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">该商品暂时缺货，请稍后再试</p>
        </div>
      )}

      {!product.isActive && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 font-medium">该商品已下架</p>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>正品保障</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>快速发货</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>专业服务</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>售后无忧</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface ProductInfoSkeletonProps {
  className?: string
}

export function ProductInfoSkeleton({ className }: ProductInfoSkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div>
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="flex gap-4">
        <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
