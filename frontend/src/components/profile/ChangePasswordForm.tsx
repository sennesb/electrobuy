import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { authApi } from '@/lib/api'
import { useState } from 'react'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z.string().min(6, '新密码至少6个字符').max(50, '密码长度不能超过50个字符'),
  confirmPassword: z.string().min(1, '请确认新密码'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

interface ChangePasswordFormProps {
  onSuccess?: () => void
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true)
    setServerError(null)
    setServerSuccess(null)

    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })

      setServerSuccess('密码修改成功')
      reset()
      onSuccess?.()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setServerError(err.response?.data?.message || '密码修改失败，请稍后重试')
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

      {serverSuccess && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          {serverSuccess}
        </div>
      )}

      <Input
        {...register('currentPassword')}
        type="password"
        label="当前密码"
        placeholder="请输入当前密码"
        error={errors.currentPassword?.message}
        autoComplete="current-password"
      />

      <Input
        {...register('newPassword')}
        type="password"
        label="新密码"
        placeholder="请输入新密码 (至少6个字符)"
        error={errors.newPassword?.message}
        autoComplete="new-password"
      />

      <Input
        {...register('confirmPassword')}
        type="password"
        label="确认新密码"
        placeholder="请再次输入新密码"
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        修改密码
      </Button>
    </form>
  )
}
