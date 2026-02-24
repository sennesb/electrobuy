import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { useState } from 'react'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation('auth')
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const loginSchema = z.object({
    email: z.string().min(1, t('login.errors.emailRequired')).email(t('login.errors.emailInvalid')),
    password: z.string().min(1, t('login.errors.passwordRequired')).min(6, t('login.errors.passwordMin')),
  })

  type LoginFormData = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      })

      setAuth(response.user, response.token)

      if (onSuccess) {
        onSuccess()
      } else {
        if (response.user.role === 'Admin') {
          navigate('/admin', { replace: true })
        } else {
          const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/'
          navigate(returnUrl, { replace: true })
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setServerError(err.response?.data?.message || t('login.errors.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <Input
        {...register('email')}
        type="email"
        label={t('login.email')}
        placeholder={t('login.emailPlaceholder')}
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
        label={t('login.password')}
        placeholder={t('login.passwordPlaceholder')}
        error={errors.password?.message}
        autoComplete="current-password"
        leftIcon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">{t('login.rememberMe')}</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
          {t('login.forgotPassword')}
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        {t('login.submit')}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {t('login.noAccount')}{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
          {t('login.registerNow')}
        </Link>
      </p>
    </form>
  )
}
