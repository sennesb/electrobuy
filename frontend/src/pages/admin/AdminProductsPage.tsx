import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProductTable, ProductForm } from '@/components/admin'
import { productsApi, categoriesApi, type ProductQuery, type CreateProductDto, type UpdateProductDto } from '@/lib/api'
import type { Product, CategoryTree } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<CategoryTree[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterCategory, setFilterCategory] = useState<number | undefined>()
  const [filterBrand, setFilterBrand] = useState<string | undefined>()
  const [filterStatus, setFilterStatus] = useState<string | undefined>()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null)

  const pageSize = 10

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const query: ProductQuery = {
        page,
        pageSize,
        keyword: searchKeyword || undefined,
        categoryId: filterCategory,
        brand: filterBrand,
      }
      const result = await productsApi.getProducts(query)
      let filteredProducts = result.data

      if (filterStatus === 'active') {
        filteredProducts = filteredProducts.filter((p) => p.isActive)
      } else if (filterStatus === 'inactive') {
        filteredProducts = filteredProducts.filter((p) => !p.isActive)
      }

      setProducts(filteredProducts)
      setTotal(result.total)
    } catch (error) {
      console.error('获取产品列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, filterCategory, filterBrand, filterStatus])

  const fetchCategories = async () => {
    try {
      const result = await categoriesApi.getCategoryTree()
      setCategories(result)
    } catch (error) {
      console.error('获取分类列表失败:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const result = await productsApi.getBrands()
      setBrands(result)
    } catch (error) {
      console.error('获取品牌列表失败:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = () => {
    setPage(1)
    fetchProducts()
  }

  const handleReset = () => {
    setSearchKeyword('')
    setFilterCategory(undefined)
    setFilterBrand(undefined)
    setFilterStatus(undefined)
    setPage(1)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    setFormLoading(true)
    try {
      if (editingProduct) {
        await productsApi.updateProduct(editingProduct.id, data as UpdateProductDto)
      } else {
        await productsApi.createProduct(data as CreateProductDto)
      }
      setIsFormOpen(false)
      setEditingProduct(null)
      fetchProducts()
      fetchBrands()
    } catch (error: unknown) {
      console.error('保存产品失败:', error)
      const message = error instanceof Error ? error.message : '保存失败，请重试'
      alert(message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (product: Product) => {
    setDeleteConfirm(product)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return
    try {
      await productsApi.deleteProduct(deleteConfirm.id)
      setDeleteConfirm(null)
      fetchProducts()
    } catch (error: unknown) {
      console.error('删除产品失败:', error)
      const message = error instanceof Error ? error.message : '删除失败，请重试'
      alert(message)
    }
  }

  const handleToggleStatus = async (product: Product) => {
    try {
      const updateData: UpdateProductDto = {
        name: product.name,
        modelNumber: product.modelNumber,
        categoryId: product.categoryId,
        brand: product.brand,
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        minOrderQty: product.minOrderQty,
        specs: typeof product.specs === 'string' ? product.specs : product.specs ? JSON.stringify(product.specs) : undefined,
        description: product.description || undefined,
        images: product.images || undefined,
        isActive: !product.isActive,
      }
      await productsApi.updateProduct(product.id, updateData)
      fetchProducts()
    } catch (error) {
      console.error('更新产品状态失败:', error)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  const flattenCategories = (cats: CategoryTree[], level = 0): { id: number; name: string; level: number }[] => {
    return cats.flatMap((cat) => [
      { id: cat.id, name: cat.name, level },
      ...flattenCategories(cat.children || [], level + 1),
    ])
  }

  const flatCategories = flattenCategories(categories)

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
        <p className="text-gray-600 mt-1">管理所有产品，添加、编辑、删除产品</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索产品名称或型号..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterCategory ?? ''}
            onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {'　'.repeat(cat.level)}
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={filterBrand ?? ''}
            onChange={(e) => setFilterBrand(e.target.value || undefined)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部品牌</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={filterStatus ?? ''}
            onChange={(e) => setFilterStatus(e.target.value || undefined)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="active">上架</option>
            <option value="inactive">下架</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            重置
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + 添加产品
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          共 {total} 个产品
        </div>
      </div>

      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600">
            第 {page} / {totalPages} 页
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={categories}
        loading={formLoading}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">确认删除</h3>
            <p className="text-gray-600 mb-4">
              确定要删除产品 <span className="font-medium">{deleteConfirm.name}</span> 吗？此操作不可撤销。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
