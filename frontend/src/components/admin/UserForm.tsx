import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AdminUser, UpdateUserByAdminDto, ResetPasswordDto } from '@/lib/api'

const userSchema = z.object({
  name: z.string().max(100, '姓名不能超过100个字符').optional(),
  company: z.string().max(200, '公司名称不能超过200个字符').optional(),
  phone: z.string().max(50, '联系电话不能超过50个字符').optional(),
  role: z.enum(['User', 'EnterpriseUser', 'Admin'], { message: '请选择角色' }),
  isActive: z.boolean(),
})

type UserFormData = z.infer<typeof userSchema>

const passwordSchema = z.object({
  newPassword: z.string().min(6, '密码长度至少6个字符').max(100, '密码不能超过100个字符'),
})

type PasswordFormData = z.infer<typeof passwordSchema>

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UpdateUserByAdminDto) => Promise<void>
  onResetPassword: (data: ResetPasswordDto) => Promise<void>
  user: AdminUser | null
  loading?: boolean
}

const roleOptions = [
  { value: 'User', label: '普通用户' },
  { value: 'EnterpriseUser', label: '企业用户' },
  { value: 'Admin', label: '管理员' },
]

export function UserForm({ isOpen, onClose, onSubmit, onResetPassword, user, loading }: UserFormProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      company: '',
      phone: '',
      role: 'User',
      isActive: true,
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
    },
  })

  useState(() => {
    if (user) {
      reset({
        name: user.name || '',
        company: user.company || '',
        phone: user.phone || '',
        role: user.role as 'User' | 'EnterpriseUser' | 'Admin',
        isActive: user.isActive,
      })
    }
  })

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit({
      name: data.name || undefined,
      company: data.company || undefined,
      phone: data.phone || undefined,
      role: data.role,
      isActive: data.isActive,
    })
  }

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    await onResetPassword(data)
    resetPassword()
  }

  const handleClose = () => {
    reset()
    resetPassword()
    setActiveTab('info')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">编辑用户</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {user && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">邮箱：</span>{user.email}
              </p>
            </div>
          )}

          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              用户信息
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              重置密码
            </button>
          </div>

          {activeTab === 'info' ? (
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入姓名"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司</label>
                <input
                  type="text"
                  {...register('company')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入公司名称"
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入联系电话"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  账户启用
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitPassword(handlePasswordSubmit)} className="space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-700">
                  重置密码后，用户需要使用新密码登录。
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入新密码（至少6个字符）"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '重置中...' : '重置密码'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
