import { type ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  className?: string
  showSidebar?: boolean
  sidebar?: ReactNode
}

export function MainLayout({
  children,
  className,
  showSidebar = false,
  sidebar,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className={cn('flex-1', className)}>
        {showSidebar && sidebar ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-6">
              <aside className="w-64 flex-shrink-0">{sidebar}</aside>
              <div className="flex-1 min-w-0">{children}</div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      <Footer />
    </div>
  )
}
