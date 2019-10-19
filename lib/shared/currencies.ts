export const DEFAULT_CURRENCY = {
  value: 'EUR',
  label: '€',
}

export const currencies = [
  { ...DEFAULT_CURRENCY },
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
]

export const getCurrencySymbol = (currency: string) =>
  currencies.find((c) => c.value === currency)!.label
