import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { useState } from 'react'

const registerSchema = z.object({
  name: z.string().min(1, '请输入姓名').min(2, '姓名至少2个字符'),
  email: z.string().min(1, '请输入邮箱').email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少6个字符'),
  confirmPassword: z.string().min(1, '请确认密码'),
  company: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { setAuth } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      phone: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
        company: data.company || undefined,
        phone: data.phone || undefined,
      })

      setAuth(response.user, response.token)
      onSuccess?.()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setServerError(err.response?.data?.message || '注册失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <Input
        {...register('name')}
        type="text"
        label="姓名"
        placeholder="请输入您的姓名"
        error={errors.name?.message}
        autoComplete="name"
        leftIcon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <Input
        {...register('email')}
        type="email"
        label="邮箱"
        placeholder="请输入邮箱"
        error={errors.email?.message}
        autoComplete="email"
        leftIcon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      <Input
        {...register('password')}
        type="password"
        label="密码"
        placeholder="请输入密码 (至少6个字符)"
        error={errors.password?.message}
        autoComplete="new-password"
        leftIcon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <Input
        {...register('confirmPassword')}
        type="password"
        label="确认密码"
        placeholder="请再次输入密码"
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
        leftIcon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('company')}
          type="text"
          label="公司名称 (选填)"
          placeholder="请输入公司名称"
          error={errors.company?.message}
          autoComplete="organization"
        />

        <Input
          {...register('phone')}
          type="tel"
          label="联系电话 (选填)"
          placeholder="请输入联系电话"
          error={errors.phone?.message}
          autoComplete="tel"
        />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          注册
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        已有账号？{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          立即登录
        </Link>
      </p>

      <p className="text-center text-xs text-gray-500">
        注册即表示您同意我们的{' '}
        <Link to="/terms" className="text-blue-600 hover:text-blue-500">
          服务条款
        </Link>{' '}
        和{' '}
        <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
          隐私政策
        </Link>
      </p>
    </form>
  )
}
