import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Product, CategoryTree } from '@/types'
import { Modal } from '@/components/ui'
import { cn } from '@/lib/utils'

const productSchema = z.object({
  name: z.string().min(1, '产品名称不能为空').max(200, '产品名称长度不能超过200个字符'),
  modelNumber: z.string().min(1, '型号不能为空').max(100, '型号长度不能超过100个字符'),
  categoryId: z.number().min(1, '请选择分类'),
  brand: z.string().min(1, '品牌不能为空').max(100, '品牌长度不能超过100个字符'),
  price: z.number().min(0.01, '价格必须大于0'),
  unit: z.string().max(20, '单位长度不能超过20个字符'),
  stock: z.number().min(0, '库存不能为负数').int('库存必须为整数'),
  minOrderQty: z.number().min(1, '最小起订量必须大于0').int('最小起订量必须为整数'),
  specs: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema> & { images?: string[] }

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  product?: Product | null
  categories: CategoryTree[]
  loading?: boolean
}

export function ProductForm({ isOpen, onClose, onSubmit, product, categories, loading }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState('')
  const initialImages = useMemo(() => product?.images || [], [product?.images])
  const [images, setImages] = useState<string[]>(initialImages)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      modelNumber: '',
      categoryId: 0,
      brand: '',
      price: 0,
      unit: '件',
      stock: 0,
      minOrderQty: 1,
      specs: '',
      description: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        modelNumber: product.modelNumber,
        categoryId: product.categoryId,
        brand: product.brand,
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        minOrderQty: product.minOrderQty,
        specs: typeof product.specs === 'string' ? product.specs : product.specs ? JSON.stringify(product.specs) : '',
        description: product.description || '',
        isActive: product.isActive,
      })
    } else {
      reset({
        name: '',
        modelNumber: '',
        categoryId: 0,
        brand: '',
        price: 0,
        unit: '件',
        stock: 0,
        minOrderQty: 1,
        specs: '',
        description: '',
        isActive: true,
      })
    }
  }, [product, reset])

  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit({ ...data, images })
  }

  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()])
      setImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddImage()
    }
  }

  const flattenCategories = (cats: CategoryTree[], level = 0): { id: number; name: string; level: number }[] => {
    return cats.flatMap((cat) => [
      { id: cat.id, name: cat.name, level },
      ...flattenCategories(cat.children || [], level + 1),
    ])
  }

  const flatCategories = flattenCategories(categories)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? '编辑产品' : '添加产品'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              产品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.name ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="请输入产品名称"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              型号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('modelNumber')}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.modelNumber ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="请输入产品型号"
            />
            {errors.modelNumber && <p className="text-red-500 text-xs mt-1">{errors.modelNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类 <span className="text-red-500">*</span>
            </label>
            <select
              {...register('categoryId', { valueAsNumber: true })}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              )}
            >
              <option value={0}>请选择分类</option>
              {flatCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {'　'.repeat(cat.level)}
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              品牌 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('brand')}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.brand ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="请输入品牌"
            />
            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              价格 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.price ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
            <input
              type="text"
              {...register('unit')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="件"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              库存 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('stock', { valueAsNumber: true })}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.stock ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最小起订量</label>
            <input
              type="number"
              {...register('minOrderQty', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">规格参数</label>
          <textarea
            {...register('specs')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入规格参数，如：电压:220V, 功率:500W, 尺寸:100x50x30mm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">产品描述</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入产品描述"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">产品图片</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入图片URL，按回车添加"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              添加
            </button>
          </div>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`产品图片 ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {product && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              产品上架
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={cn(
              'px-4 py-2 text-white rounded-lg transition-colors',
              isSubmitting || loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {isSubmitting || loading ? '保存中...' : product ? '保存修改' : '添加产品'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
