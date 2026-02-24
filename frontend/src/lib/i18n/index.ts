import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import enHeader from './locales/en/header.json'
import enFooter from './locales/en/footer.json'
import enAuth from './locales/en/auth.json'
import enProducts from './locales/en/products.json'
import enCart from './locales/en/cart.json'
import enOrders from './locales/en/orders.json'
import enProfile from './locales/en/profile.json'

import zhCommon from './locales/zh/common.json'
import zhHeader from './locales/zh/header.json'
import zhFooter from './locales/zh/footer.json'
import zhAuth from './locales/zh/auth.json'
import zhProducts from './locales/zh/products.json'
import zhCart from './locales/zh/cart.json'
import zhOrders from './locales/zh/orders.json'
import zhProfile from './locales/zh/profile.json'

const resources = {
  en: {
    common: enCommon,
    header: enHeader,
    footer: enFooter,
    auth: enAuth,
    products: enProducts,
    cart: enCart,
    orders: enOrders,
    profile: enProfile,
  },
  zh: {
    common: zhCommon,
    header: zhHeader,
    footer: zhFooter,
    auth: zhAuth,
    products: zhProducts,
    cart: zhCart,
    orders: zhOrders,
    profile: zhProfile,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'header', 'footer', 'auth', 'products', 'cart', 'orders', 'profile'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
