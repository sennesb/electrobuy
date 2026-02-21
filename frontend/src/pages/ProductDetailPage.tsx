import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  ProductGallery,
  ProductGallerySkeleton,
  ProductInfo,
  ProductInfoSkeleton,
  SpecTable,
} from '@/components/products'
import { Button } from '@/components/ui'
import { productsApi } from '@/lib/api/products'
import { cartApi } from '@/lib/api/cart'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { setTotalItems } = useCartStore()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id!),
    enabled: !!id,
  })

  const handleAddToCart = async (quantity: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/products/${id}` } })
      return
    }

    if (!id) return

    setIsAddingToCart(true)
    try {
      await cartApi.addToCart({ productId: id, quantity })
      
      const count = await cartApi.getCartCount()
      setTotalItems(count)
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('添加购物车失败，请稍后重试')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">产品不存在</h1>
            <p className="text-gray-500 mb-6">您访问的产品可能已下架或不存在</p>
            <Link to="/products">
              <Button variant="primary">返回产品列表</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>已成功加入购物车</span>
          <Link to="/cart" className="ml-2 underline hover:no-underline">
            去结算
          </Link>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              首页
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/products" className="hover:text-blue-600 transition-colors">
              产品中心
            </Link>
            {product?.categoryName && (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  to={`/products?categoryId=${product.categoryId}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {product.categoryName}
                </Link>
              </>
            )}
            {product && (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium truncate max-w-xs">
                  {product.name}
                </span>
              </>
            )}
          </nav>

          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <ProductGallerySkeleton />
                <ProductInfoSkeleton />
              </div>
            </div>
          ) : product ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <ProductGallery
                    images={product.images}
                    productName={product.name}
                  />
                  <ProductInfo
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={isAddingToCart}
                  />
                </div>
              </div>

              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  规格参数
                </h2>
                <SpecTable specs={typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs} />
              </div>

              {product.description && (
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    产品描述
                  </h2>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap">{product.description}</p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}
