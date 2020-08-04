import { omit } from '@siegrift/tsfunct'

export const CURRENCIES = {
  AUD: '$',
  CHF: 'Fr.',
  CZK: 'Kč',
  EUR: '€',
  GBP: '£',
  HKD: 'HK$',
  HRK: 'kn',
  HUF: 'ft',
  PLN: 'zł',
  SEK: 'kr',
  USD: '$',
}

export type Currency = keyof typeof CURRENCIES

export const DEFAULT_CURRENCY: Currency = 'EUR'

export const exchangeRatesUrl = `https://api.exchangeratesapi.io/latest?symbols=${Object.keys(
  omit(CURRENCIES, ['EUR']), // base currency must be excluded
).join(',')}`
