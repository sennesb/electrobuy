import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ProductGalleryProps {
  images: string[] | null
  productName: string
  className?: string
}

const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"%3E%3Cpath d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mainImageError, setMainImageError] = useState(false)
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<number>>(new Set())

  const displayImages = images && images.length > 0 ? images : [placeholderImage]
  const currentImage = mainImageError ? placeholderImage : displayImages[selectedIndex]

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index)
    setMainImageError(false)
  }

  const handleMainImageError = () => {
    setMainImageError(true)
  }

  const handleThumbnailError = (index: number) => {
    setThumbnailErrors((prev) => new Set(prev).add(index))
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={currentImage}
          alt={`${productName} - 图片 ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
          onError={handleMainImageError}
        />
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => {
            const hasError = thumbnailErrors.has(index)
            const isSelected = index === selectedIndex

            return (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <img
                  src={hasError ? placeholderImage : image}
                  alt={`${productName} - 缩略图 ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleThumbnailError(index)}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export interface ProductGallerySkeletonProps {
  className?: string
}

export function ProductGallerySkeleton({ className }: ProductGallerySkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
