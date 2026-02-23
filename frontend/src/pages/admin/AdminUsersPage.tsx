import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { UserTable, UserForm } from '@/components/admin'
import { usersApi, type AdminUser, type UserQuery, type UpdateUserByAdminDto, type ResetPasswordDto } from '@/lib/api'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterRole, setFilterRole] = useState<string | undefined>()
  const [filterStatus, setFilterStatus] = useState<string | undefined>()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const pageSize = 10

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const query: UserQuery = {
        page,
        pageSize,
        keyword: searchKeyword || undefined,
        role: filterRole,
        isActive: filterStatus === 'active' ? true : filterStatus === 'inactive' ? false : undefined,
      }
      const result = await usersApi.getUsers(query)
      setUsers(result.data)
      setTotal(result.total)
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, filterRole, filterStatus])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = () => {
    setPage(1)
    fetchUsers()
  }

  const handleReset = () => {
    setSearchKeyword('')
    setFilterRole(undefined)
    setFilterStatus(undefined)
    setPage(1)
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: UpdateUserByAdminDto) => {
    if (!editingUser) return
    setFormLoading(true)
    try {
      await usersApi.updateUser(editingUser.id, data)
      setIsFormOpen(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error: unknown) {
      console.error('更新用户失败:', error)
      const message = error instanceof Error ? error.message : '更新失败，请重试'
      alert(message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleResetPassword = async (data: ResetPasswordDto) => {
    if (!editingUser) return
    setFormLoading(true)
    try {
      await usersApi.resetPassword(editingUser.id, data)
      alert('密码重置成功')
      setIsFormOpen(false)
      setEditingUser(null)
    } catch (error: unknown) {
      console.error('重置密码失败:', error)
      const message = error instanceof Error ? error.message : '重置密码失败，请重试'
      alert(message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await usersApi.toggleStatus(user.id)
      fetchUsers()
    } catch (error) {
      console.error('切换用户状态失败:', error)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <p className="text-gray-600 mt-1">管理系统用户，查看、编辑、禁用用户账户</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索邮箱、姓名、公司或电话..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterRole ?? ''}
            onChange={(e) => setFilterRole(e.target.value || undefined)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部角色</option>
            <option value="User">普通用户</option>
            <option value="EnterpriseUser">企业用户</option>
            <option value="Admin">管理员</option>
          </select>

          <select
            value={filterStatus ?? ''}
            onChange={(e) => setFilterStatus(e.target.value || undefined)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">已禁用</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            重置
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          共 {total} 个用户
        </div>
      </div>

      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onResetPassword={(user) => {
          setEditingUser(user)
          setIsFormOpen(true)
        }}
      />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600">
            第 {page} / {totalPages} 页
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingUser(null)
        }}
        onSubmit={handleFormSubmit}
        onResetPassword={handleResetPassword}
        user={editingUser}
        loading={formLoading}
      />
    </AdminLayout>
  )
}
