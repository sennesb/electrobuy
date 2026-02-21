import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { useState } from 'react'
import type { User } from '@/types'

const profileSchema = z.object({
  name: z.string().max(50, '姓名长度不能超过50个字符').optional().or(z.literal('')),
  company: z.string().max(100, '公司名称长度不能超过100个字符').optional().or(z.literal('')),
  phone: z.string().max(20, '电话号码长度不能超过20个字符').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: User
  onSuccess?: (user: User) => void
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)
  const { setAuth } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      company: user.company || '',
      phone: user.phone || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setServerError(null)
    setServerSuccess(null)

    try {
      const updatedUser = await authApi.updateUser({
        name: data.name || undefined,
        company: data.company || undefined,
        phone: data.phone || undefined,
      })

      const token = localStorage.getItem('token') || ''
      setAuth(updatedUser, token)
      setServerSuccess('个人信息更新成功')
      onSuccess?.(updatedUser)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setServerError(err.response?.data?.message || '更新失败，请稍后重试')
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

      <div className="rounded-lg bg-gray-50 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
        <p className="text-gray-900">{user.email}</p>
        <p className="text-xs text-gray-500 mt-1">邮箱不可修改</p>
      </div>

      <Input
        {...register('name')}
        type="text"
        label="姓名"
        placeholder="请输入姓名"
        error={errors.name?.message}
      />

      <Input
        {...register('company')}
        type="text"
        label="公司名称"
        placeholder="请输入公司名称"
        error={errors.company?.message}
      />

      <Input
        {...register('phone')}
        type="tel"
        label="联系电话"
        placeholder="请输入联系电话"
        error={errors.phone?.message}
      />

      <div className="rounded-lg bg-gray-50 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">账户角色</label>
        <p className="text-gray-900">
          {user.role === 'Admin' ? '管理员' : user.role === 'EnterpriseUser' ? '企业用户' : '普通用户'}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">注册时间</label>
        <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString('zh-CN')}</p>
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        保存修改
      </Button>
    </form>
  )
}
