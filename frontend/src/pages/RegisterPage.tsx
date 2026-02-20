import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '@/components/auth'

export default function RegisterPage() {
  const navigate = useNavigate()

  const handleRegisterSuccess = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">创建账号</h1>
            <p className="text-gray-500 mt-2">加入 ElectroBuy，开启采购之旅</p>
          </div>

          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; 2026 ElectroBuy. 电气自动化产品采买平台
        </p>
      </div>
    </div>
  )
}
