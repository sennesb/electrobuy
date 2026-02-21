import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout'
import { ProductCard, ProductCardSkeleton, ProductFilter, CategoryNav } from '@/components/products'
import { Pagination } from '@/components/ui'
import { productsApi, categoriesApi, type ProductQuery } from '@/lib/api'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterVisible, setIsFilterVisible] = useState(true)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!, 10) : undefined
  const keyword = searchParams.get('keyword') || undefined
  const brand = searchParams.get('brand') || undefined
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'

  const query: ProductQuery = useMemo(() => ({
    page,
    pageSize: 12,
    categoryId,
    keyword,
    brand,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  }), [page, categoryId, keyword, brand, minPrice, maxPrice, sortBy, sortOrder])

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: categoriesApi.getCategoryTree,
  })

  const { data: productsData, isLoading: productsLoading, isError } = useQuery({
    queryKey: ['products', query],
    queryFn: () => productsApi.getProducts(query),
  })

  const { data: brands } = useQuery({
    queryKey: ['products', 'brands'],
    queryFn: productsApi.getBrands,
  })

  const selectedCategory = useMemo(() => {
    if (!categoryId || !categories) return null
    const findCategory = (cats: typeof categories, id: number): typeof cats[0] | null => {
      for (const cat of cats) {
        if (cat.id === id) return cat
        if (cat.children) {
          const found = findCategory(cat.children, id)
          if (found) return found
        }
      }
      return null
    }
    return findCategory(categories, categoryId)
  }, [categoryId, categories])

  const updateParams = (updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })
    if (!updates.page) {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBrandChange = (newBrand?: string) => {
    updateParams({ brand: newBrand, page: undefined })
  }

  const handlePriceChange = (min?: number, max?: number) => {
    updateParams({ minPrice: min, maxPrice: max, page: undefined })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: undefined })
  }

  const handleReset = () => {
    const newParams = new URLSearchParams()
    if (categoryId) {
      newParams.set('categoryId', String(categoryId))
    }
    setSearchParams(newParams)
  }

  const hasActiveFilters = brand || minPrice || maxPrice

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory ? selectedCategory.name : '全部产品'}
              </h1>
              {keyword && (
                <p className="text-gray-500 mt-1">
                  搜索关键词: "{keyword}"
                </p>
              )}
              {productsData && (
                <p className="text-sm text-gray-500 mt-1">
                  共 {productsData.total} 个产品
                </p>
              )}
            </div>
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              筛选
            </button>
          </div>

          <div className="flex gap-8">
            <aside className={`
              ${isFilterVisible ? 'block' : 'hidden'}
              lg:block w-full lg:w-64 flex-shrink-0
              fixed lg:static inset-0 z-40 lg:z-auto bg-black/50 lg:bg-transparent
            `}>
              <div className="lg:space-y-6 h-full lg:h-auto overflow-y-auto lg:overflow-visible">
                <div className="lg:hidden flex justify-end p-4 bg-white">
                  <button
                    onClick={() => setIsFilterVisible(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {categories && !categoriesLoading && (
                  <CategoryNav
                    categories={categories}
                    selectedCategoryId={categoryId}
                    className="lg:mb-6"
                  />
                )}

                <ProductFilter
                  brands={brands || []}
                  selectedBrand={brand}
                  priceRange={{ min: minPrice, max: maxPrice }}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onBrandChange={handleBrandChange}
                  onPriceChange={handlePriceChange}
                  onSortChange={handleSortChange}
                  onReset={handleReset}
                />
              </div>
            </aside>

            <main className="flex-1">
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-sm text-gray-500">当前筛选:</span>
                  {brand && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      品牌: {brand}
                      <button
                        onClick={() => handleBrandChange(undefined)}
                        className="hover:text-blue-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      价格: {minPrice ? `¥${minPrice}` : '不限'} - {maxPrice ? `¥${maxPrice}` : '不限'}
                      <button
                        onClick={() => handlePriceChange(undefined, undefined)}
                        className="hover:text-blue-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    清除全部
                  </button>
                </div>
              )}

              {isError ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">加载产品失败，请稍后重试</p>
                </div>
              ) : productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : productsData?.data && productsData.data.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {productsData.data.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {productsData.totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={productsData.page}
                        totalPages={productsData.totalPages}
                        total={productsData.total}
                        pageSize={productsData.pageSize}
                        onPageChange={handlePageChange}
                        showTotal
                        showQuickJumper
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 mb-4">没有找到符合条件的产品</p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleReset}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      清除筛选条件
                    </button>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
