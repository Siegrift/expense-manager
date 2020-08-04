import { pipe } from '@siegrift/tsfunct'
import chunk from 'lodash/chunk'
import Router from 'next/router'

import { ExchangeRates } from '../settings/state'
import { ObjectOf } from '../types'

import { CURRENCIES, Currency } from './currencies'

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const redirectTo = (target: string) => {
  Router.push(target)
}

export function downloadFile(filename: string, text: string) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function isValidDate(date: unknown) {
  return date instanceof Date && !isNaN(date as any)
}

export const isAmountInValidFormat = (amount: string) =>
  amount.match(/^\d+(\.\d{1,2})?$/) != null

export const sorted = <T>(
  coll: T[] | ObjectOf<T>,
  sortFn?: (a: T, b: T) => number,
) => {
  let copy: T[]
  if (Array.isArray(coll)) {
    copy = [...coll]
  } else {
    copy = Object.values(coll)
  }
  copy.sort(sortFn)
  return copy
}

export const formatBoolean = (value: boolean) => (value ? 'yes' : 'no')

export const formatMoney = (amount: string | number, currency: Currency) =>
  `${formatAmount(amount)}${CURRENCIES[currency]}`

export const reverse = (str: string) => str.split('').reverse().join('')

export const formatAmount = (amount: string | number): string => {
  const strAmount = '' + amount

  if (strAmount[0] === '-') return `-${formatAmount(strAmount.substr(1))}`

  const numTokens = strAmount.split('.')
  const insertCommas = pipe(
    reverse,
    (reversed) => chunk(reversed, 3),
    (chunks) => chunks.reverse(),
    (chunks) => chunks.map((c) => c.reverse().join('')),
    (chunks) => chunks.join(','),
  )(numTokens[0])

  return insertCommas + (numTokens[1] ? `.${numTokens[1]}` : '')
}

export const computeExchangeRate = (
  rates: ExchangeRates['rates'],
  source: Currency,
  target: Currency,
) => {
  const sourceToEur = 1 / rates[source]
  const targetToEur = 1 / rates[target]
  return sourceToEur / targetToEur
}
