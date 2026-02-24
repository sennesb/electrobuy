import i18n from 'i18next'

export type Currency = 'CNY' | 'USD' | 'EUR'

const currencySymbols: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
}

const currencyLocales: Record<Currency, string> = {
  CNY: 'zh-CN',
  USD: 'en-US',
  EUR: 'de-DE',
}

export function formatPrice(
  price: number,
  currency: Currency = 'CNY',
  options?: {
    showSymbol?: boolean
    showCode?: boolean
  }
): string {
  const { showSymbol = true, showCode = false } = options || {}
  const symbol = currencySymbols[currency]
  const locale = currencyLocales[currency]

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)

  let result = ''
  if (showSymbol) {
    result = `${symbol}${formatted}`
  } else {
    result = formatted
  }

  if (showCode) {
    result = `${result} ${currency}`
  }

  return result
}

export function formatPriceByLocale(price: number): string {
  const currentLang = i18n.language
  const currency: Currency = currentLang === 'zh' ? 'CNY' : 'USD'
  return formatPrice(price, currency)
}

export function getCurrencySymbol(): string {
  const currentLang = i18n.language
  const currency: Currency = currentLang === 'zh' ? 'CNY' : 'USD'
  return currencySymbols[currency]
}

export function getCurrencyCode(): Currency {
  const currentLang = i18n.language
  return currentLang === 'zh' ? 'CNY' : 'USD'
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const currentLang = i18n.language
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US'
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  }

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj)
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatNumber(num: number): string {
  const currentLang = i18n.language
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US'
  return new Intl.NumberFormat(locale).format(num)
}
