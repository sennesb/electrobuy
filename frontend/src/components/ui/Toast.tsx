import { useEffect, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const toastStyles: Record<ToastType, { container: string; icon: string }> = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-500',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-500',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-500',
  },
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconClass = cn('h-5 w-5', toastStyles[type].icon)

  switch (type) {
    case 'success':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    case 'warning':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'info':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

export function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose(toast.id), 300)
      }, toast.duration || 3000)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => onClose(toast.id), 300)
  }, [toast.id, onClose])

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300',
        toastStyles[toast.type].container,
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      role="alert"
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="rounded p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-1"
        aria-label="关闭"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const positionStyles: Record<string, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

export function ToastContainer({
  toasts,
  onClose,
  position = 'top-right',
}: ToastContainerProps) {
  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2',
        positionStyles[position]
      )}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
