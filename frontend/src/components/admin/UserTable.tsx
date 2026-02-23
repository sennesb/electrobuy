import { useState } from 'react'
import type { AdminUser } from '@/lib/api'
import { cn } from '@/lib/utils'

interface UserTableProps {
  users: AdminUser[]
  loading?: boolean
  onEdit: (user: AdminUser) => void
  onToggleStatus: (user: AdminUser) => void
  onResetPassword: (user: AdminUser) => void
}

const roleLabels: Record<string, string> = {
  User: '普通用户',
  EnterpriseUser: '企业用户',
  Admin: '管理员',
}

const roleColors: Record<string, string> = {
  User: 'bg-gray-100 text-gray-800',
  EnterpriseUser: 'bg-blue-100 text-blue-800',
  Admin: 'bg-purple-100 text-purple-800',
}

export function UserTable({ users, loading, onEdit, onToggleStatus, onResetPassword }: UserTableProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleToggleStatus = async (user: AdminUser) => {
    if (togglingId) return
    setTogglingId(user.id)
    try {
      await onToggleStatus(user)
    } finally {
      setTogglingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">加载中...</p>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg">暂无用户</p>
          <p className="text-sm mt-1">系统暂无注册用户</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">公司</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">角色</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">订单数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">注册时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name || '未设置姓名'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.company || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    roleColors[user.role] || 'bg-gray-100 text-gray-800'
                  )}>
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.orderCount} 笔
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(user)}
                    disabled={togglingId === user.id}
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
                      user.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200',
                      togglingId === user.id && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {togglingId === user.id ? '处理中...' : user.isActive ? '正常' : '已禁用'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => onResetPassword(user)}
                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                    >
                      重置密码
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
