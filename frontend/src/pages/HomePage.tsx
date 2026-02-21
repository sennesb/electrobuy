import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout'
import { ProductCard, ProductCardSkeleton, CategoryNavHorizontal } from '@/components/products'
import { Button } from '@/components/ui'
import { productsApi, categoriesApi } from '@/lib/api'

const heroSlides = [
  {
    title: '工业自动化一站式采购平台',
    subtitle: 'PLC、变频器、传感器等电气自动化产品',
    cta: '立即选购',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
  },
]

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: '正品保障',
    description: '所有产品均为官方授权正品',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '快速发货',
    description: '下单后24小时内发货',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '专业服务',
    description: '专业技术支持团队',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: '售后无忧',
    description: '7天无理由退换货',
  },
]

export function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: categoriesApi.getCategoryTree,
  })

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getProducts({ pageSize: 8, sortBy: 'createdAt', sortOrder: 'desc' }),
  })

  const { data: brands } = useQuery({
    queryKey: ['products', 'brands'],
    queryFn: productsApi.getBrands,
  })

  return (
    <MainLayout>
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {heroSlides[0].title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              {heroSlides[0].subtitle}
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                {heroSlides[0].cta}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {categories && categories.length > 0 && (
        <CategoryNavHorizontal categories={categories} />
      )}

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">最新上架</h2>
              <p className="text-gray-500 mt-1">发现最新的电气自动化产品</p>
            </div>
            <Link to="/products?sortBy=createdAt&sortOrder=desc">
              <Button variant="outline">
                查看更多
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : productsData?.data && productsData.data.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsData.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              暂无产品
            </div>
          )}
        </div>
      </section>

      {brands && brands.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">热门品牌</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {brands.slice(0, 8).map((brand) => (
                <Link
                  key={brand}
                  to={`/products?brand=${encodeURIComponent(brand)}`}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories && !categoriesLoading && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">产品分类</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?categoryId=${category.id}`}
                  className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  {category.children && category.children.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      {category.children.length} 个子分类
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  )
}
