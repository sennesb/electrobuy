import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

export interface OrderSummaryProps {
  totalItems: number
  totalAmount: number
  onSubmit: (remark?: string) => Promise<void>
  isSubmitting?: boolean
  isDisabled?: boolean
  className?: string
}

export function OrderSummary({
  totalItems,
  totalAmount,
  onSubmit,
  isSubmitting = false,
  isDisabled = false,
  className,
}: OrderSummaryProps) {
  const navigate = useNavigate()
  const [remark, setRemark] = useState('')
  const [showRemark, setShowRemark] = useState(false)

  const handleSubmit = async () => {
    await onSubmit(remark || undefined)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-6 sticky top-4',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">商品数量</span>
          <span className="text-gray-900">{totalItems} 件</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">商品金额</span>
          <span className="text-gray-900">¥{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">运费</span>
          <span className="text-green-600">免运费</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-900 font-medium">应付金额</span>
          <span className="text-2xl font-bold text-red-600">
            ¥{formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowRemark(!showRemark)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <svg
            className={cn('w-4 h-4 transition-transform', showRemark && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showRemark ? '收起备注' : '添加订单备注'}
        </button>
        {showRemark && (
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="请输入订单备注信息（选填）"
            maxLength={200}
            rows={3}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isDisabled || isSubmitting || totalItems === 0}
        isLoading={isSubmitting}
        className="w-full"
        size="lg"
      >
        提交订单
      </Button>

      {isDisabled && totalItems > 0 && (
        <p className="text-xs text-red-600 mt-2 text-center">
          购物车中有不可购买的商品，请先处理
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          提交订单即表示您同意
          <button
            onClick={() => navigate('/terms')}
            className="text-blue-600 hover:text-blue-700 mx-1"
          >
            服务条款
          </button>
          和
          <button
            onClick={() => navigate('/privacy')}
            className="text-blue-600 hover:text-blue-700 mx-1"
          >
            隐私政策
          </button>
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>正品保障，假一赔十</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>7天无理由退换</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>全国联保，售后无忧</span>
        </div>
      </div>
    </div>
  )
}
