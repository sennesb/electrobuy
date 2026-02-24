import { useTranslation } from 'react-i18next'
import { LoginForm } from '@/components/auth'

export default function LoginPage() {
  const { t } = useTranslation('auth')

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
            <h1 className="text-2xl font-bold text-gray-900">{t('login.title')}</h1>
            <p className="text-gray-500 mt-2">{t('login.subtitle')}</p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; 2026 ElectroBuy. Industrial Automation Products Platform
        </p>
      </div>
    </div>
  )
}
