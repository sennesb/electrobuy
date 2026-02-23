import { useState } from 'react'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

interface ProductTableProps {
  products: Product[]
  loading?: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleStatus: (product: Product) => void
}

export function ProductTable({ products, loading, onEdit, onDelete, onToggleStatus }: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (product: Product) => {
    if (deletingId) return
    setDeletingId(product.id)
    try {
      await onDelete(product)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">加载中...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg">暂无产品</p>
          <p className="text-sm mt-1">点击"添加产品"按钮创建新产品</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">产品信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">品牌</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">价格</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">库存</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-xl">📦</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.modelNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.categoryName || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.brand}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">
                  ¥{product.price.toLocaleString()}
                  <span className="text-gray-400 text-xs ml-1">/{product.unit}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      product.stock === 0
                        ? 'text-red-600'
                        : product.stock < 10
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    )}
                  >
                    {product.stock}
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="text-xs ml-1">(库存紧张)</span>
                    )}
                    {product.stock === 0 && (
                      <span className="text-xs ml-1">(缺货)</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleStatus(product)}
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
                      product.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    )}
                  >
                    {product.isActive ? '上架' : '下架'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      className={cn(
                        'px-3 py-1 text-xs rounded transition-colors',
                        deletingId === product.id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      )}
                    >
                      {deletingId === product.id ? '删除中...' : '删除'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
