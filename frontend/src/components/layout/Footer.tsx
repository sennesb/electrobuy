import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const productCategories = [
    { name: 'PLC可编程控制器', path: '/products?categoryId=1' },
    { name: '变频器', path: '/products?categoryId=2' },
    { name: '传感器', path: '/products?categoryId=3' },
    { name: '低压电器', path: '/products?categoryId=4' },
    { name: '人机界面', path: '/products?categoryId=5' },
    { name: '伺服系统', path: '/products?categoryId=6' },
  ]

  const quickLinks = [
    { name: '产品目录', path: '/products' },
    { name: '购物车', path: '/cart' },
    { name: '我的订单', path: '/orders' },
    { name: '个人中心', path: '/profile' },
  ]

  const supportLinks = [
    { name: '帮助中心', path: '/help' },
    { name: '联系我们', path: '/contact' },
    { name: '关于我们', path: '/about' },
    { name: '隐私政策', path: '/privacy' },
  ]

  return (
    <footer className={cn('bg-gray-900 text-gray-300', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-white">ElectroBuy</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              专业的电气自动化产品采买平台，为工程师、采购人员和企业提供优质的产品和服务。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">产品分类</h3>
            <ul className="space-y-2">
              {productCategories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">客户服务</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400">客服热线</p>
              <p className="text-lg font-semibold text-white">400-888-8888</p>
              <p className="text-xs text-gray-500 mt-1">周一至周五 9:00-18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} ElectroBuy. 保留所有权利。
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/terms"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                服务条款
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                隐私政策
              </Link>
              <Link
                to="/sitemap"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
