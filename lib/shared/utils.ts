import { pipe } from '@siegrift/tsfunct'
import chunk from 'lodash/chunk'
import Router from 'next/router'

import { ExchangeRates } from '../profile/state'
import { ObjectOf } from '../types'

import { CURRENCIES, Currency } from './currencies'

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const redirectTo = (target: string) => Router.push(target)

export function downloadFile(filename: string, text: string) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// inspired by https://firebase.google.com/docs/storage/web/download-files?authuser=0#download_data_via_url
export function downloadTextFromUrl(url: string): Promise<string> {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'text'
    xhr.onload = () => res(xhr.response)
    xhr.onerror = rej
    xhr.open('GET', url)
    xhr.send()
  })
}

export function isValidDate(date: unknown) {
  return date instanceof Date && !isNaN(date as any)
}

export const isAmountInValidFormat = (amount: string) => /^\d+(\.\d{1,2})?$/.exec(amount) != null

export const sorted = <T>(coll: T[] | ObjectOf<T>, sortFn?: (a: T, b: T) => number) => {
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

export const formatMoney = (amount: number, currency: Currency) =>
  `${formatAmount(amount, CURRENCIES[currency].scale)} ${CURRENCIES[currency].symbol}`

export const reverse = (str: string) => str.split('').reverse().join('')

export const formatAmount = (amount: number, scale = 0): string => {
  amount = round(amount, scale)
  const strAmount = '' + amount

  if (strAmount[0] === '-') return `-${formatAmount(-1 * amount, scale)}`

  const numTokens = strAmount.split('.')
  const insertCommas = pipe(
    reverse,
    (reversed) => chunk(reversed, 3),
    (chunks) => chunks.reverse(),
    (chunks) => chunks.map((c) => c.reverse().join('')),
    (chunks) => chunks.join(',')
  )(numTokens[0])

  return insertCommas + (numTokens[1] ? `.${numTokens[1]}` : '')
}

export const computeExchangeRate = (rates: ExchangeRates['rates'], source: Currency, target: Currency) => {
  const sourceToEur = 1 / rates[source]
  const targetToEur = 1 / rates[target]
  return sourceToEur / targetToEur
}

export const round = (amount: number, decimalPlaces = 2) =>
  Math.round(amount * 10 ** decimalPlaces) / 10 ** decimalPlaces

export const areDistinct = <T>(arr: T[]) => {
  const set = new Set<T>(arr)
  return set.size === arr.length
}

// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
export const deepFreeze = <T>(object: T): T => {
  const propNames = Object.getOwnPropertyNames(object)

  for (const name of propNames) {
    const value = object[name]

    if (value && typeof value === 'object') {
      deepFreeze(value)
    }
  }

  return Object.freeze(object)
}

export const percentage = (value: number, total: number, decimalPlaces = 2) =>
  round((value / total) * 100, decimalPlaces)
