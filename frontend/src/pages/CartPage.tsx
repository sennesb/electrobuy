import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { CartItem, CartItemSkeleton, OrderSummary } from '@/components/cart'
import { cartApi, ordersApi } from '@/lib/api'
import { useAuthStore, useCartStore } from '@/stores'
import type { Cart } from '@/types'

export default function CartPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const { setTotalItems } = useCartStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/cart' } })
    }
  }, [isAuthenticated, navigate])

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateCartItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      refetchCartCount()
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => cartApi.removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      refetchCartCount()
    },
  })

  const clearMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      setTotalItems(0)
    },
  })

  const createOrderMutation = useMutation({
    mutationFn: (remark?: string) => ordersApi.createOrder(remark ? { remark } : {}),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setTotalItems(0)
      setOrderId(order.id)
      setShowSuccess(true)
    },
  })

  const refetchCartCount = async () => {
    try {
      const count = await cartApi.getCartCount()
      setTotalItems(count)
    } catch {
      // ignore
    }
  }

  const handleQuantityChange = async (id: string, quantity: number) => {
    await updateMutation.mutateAsync({ id, quantity })
  }

  const handleRemove = async (id: string) => {
    await removeMutation.mutateAsync(id)
  }

  const handleClearCart = async () => {
    if (window.confirm('确定要清空购物车吗？')) {
      await clearMutation.mutateAsync()
    }
  }

  const handleSubmitOrder = async (remark?: string) => {
    await createOrderMutation.mutateAsync(remark)
  }

  const hasInvalidItems = cart?.items.some(
    (item) => !item.isActive || item.stock <= 0
  )

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-blue-600">
                首页
              </Link>
              <span>/</span>
              <span className="text-gray-900">购物车</span>
            </nav>
          </div>

          {showSuccess && orderId && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-green-800 font-medium">订单提交成功！</p>
                  <p className="text-green-600 text-sm">订单号已生成，请前往订单列表查看详情</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/orders')}
                >
                  查看订单
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuccess(false)}
                >
                  继续购物
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">
                加载购物车失败，请刷新页面重试
              </p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-gray-900">
                    购物车
                    {cart && (
                      <span className="text-base font-normal text-gray-500 ml-2">
                        ({cart.totalItems} 件商品)
                      </span>
                    )}
                  </h1>
                  {cart && cart.items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCart}
                      isLoading={clearMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      清空购物车
                    </Button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <CartItemSkeleton key={i} />
                  ))}
                </div>
              ) : cart && cart.items.length > 0 ? (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      isUpdating={updateMutation.isPending || removeMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    购物车是空的
                  </h3>
                  <p className="text-gray-500 mb-6">
                    快去挑选心仪的商品吧！
                  </p>
                  <Button onClick={() => navigate('/products')}>
                    去购物
                  </Button>
                </div>
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div className="lg:w-80 flex-shrink-0">
                <OrderSummary
                  totalItems={cart.totalItems}
                  totalAmount={cart.totalAmount}
                  onSubmit={handleSubmitOrder}
                  isSubmitting={createOrderMutation.isPending}
                  isDisabled={hasInvalidItems}
                />
              </div>
            )}
          </div>

          {cart && cart.items.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                猜你喜欢
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-500">
                  推荐功能开发中...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
