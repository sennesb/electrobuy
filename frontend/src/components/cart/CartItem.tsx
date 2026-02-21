import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { CartItem as CartItemType } from '@/types'

export interface CartItemProps {
  item: CartItemType
  onQuantityChange: (id: string, quantity: number) => Promise<void>
  onRemove: (id: string) => Promise<void>
  isUpdating?: boolean
  className?: string
}

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  isUpdating = false,
  className,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isEditing, setIsEditing] = useState(false)

  const imageUrl = item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"%3E%3Cpath d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.stock) return
    setQuantity(newQuantity)
    setIsEditing(true)
    await onQuantityChange(item.id, newQuantity)
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= item.stock) {
      setQuantity(value)
    }
  }

  const handleInputBlur = async () => {
    if (quantity !== item.quantity) {
      setIsEditing(true)
      await onQuantityChange(item.id, quantity)
      setIsEditing(false)
    }
  }

  const isDisabled = isUpdating || isEditing || !item.isActive || item.stock <= 0

  return (
    <div
      className={cn(
        'flex gap-4 p-4 bg-white rounded-lg border border-gray-200',
        isDisabled && 'opacity-60',
        className
      )}
    >
      <Link
        to={`/products/${item.productId}`}
        className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={item.productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"%3E%3Cpath d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'
          }}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <Link
              to={`/products/${item.productId}`}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
            >
              {item.productName}
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              {item.brand} | {item.modelNumber}
            </p>
            {!item.isActive && (
              <span className="inline-block text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded mt-1">
                已下架
              </span>
            )}
            {item.stock <= 0 && (
              <span className="inline-block text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded mt-1">
                缺货
              </span>
            )}
            {item.stock > 0 && item.stock <= 10 && (
              <span className="inline-block text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1">
                库存紧张
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            disabled={isUpdating}
            className="text-gray-400 hover:text-red-600 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isDisabled}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min={1}
              max={item.stock}
              disabled={isDisabled}
              className="w-16 h-8 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= item.stock || isDisabled}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-xs text-gray-500 ml-1">
              库存: {item.stock}
            </span>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-red-600">
              ¥{item.subtotal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              ¥{item.price.toLocaleString()} × {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface CartItemSkeletonProps {
  className?: string
}

export function CartItemSkeleton({ className }: CartItemSkeletonProps) {
  return (
    <div
      className={cn(
        'flex gap-4 p-4 bg-white rounded-lg border border-gray-200',
        className
      )}
    >
      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
