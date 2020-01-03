import isAfter from 'date-fns/isAfter'
import subMonths from 'date-fns/subMonths'
import { createSelector } from 'reselect'

import { Transaction } from '../addTransaction/state'
import { sorted } from '../shared/utils'
import { State } from '../state'

export const tagsSel = (state: State) => state.tags
export const sortedTagsSel = createSelector(tagsSel, (tags) =>
  sorted(tags, (a, b) => (a.name < b.name ? -1 : 1)),
)
export const transactionsSel = (state: State) => state.transactions

export const tagFromSortedTagsByIndex = (index: number) =>
  createSelector(sortedTagsSel, (tags) => tags[index])

export const totalTransactionsSel = (id: string) =>
  createSelector(
    transactionsSel,
    (txs) => Object.values(txs).filter((tx) => tx.tagIds.includes(id)).length,
  )

export const totalExpenseInTransactionsSel = (id: string) =>
  createSelector(transactionsSel, (txs) =>
    Math.round(
      Object.values(txs)
        .filter((tx) => tx.tagIds.includes(id))
        .reduce((acc, tx) => acc + tx.amount, 0),
    ),
  )

export const isRecurringTagSel = (id: string) =>
  createSelector(
    transactionsSel,
    (txs) =>
      Object.values(txs).filter(
        (tx) =>
          tx.repeating !== 'none' &&
          tx.repeating !== 'inactive' &&
          tx.tagIds.includes(id),
      ).length > 0,
  )

export const latestTransactionWithTagSel = (tagId: string) =>
  createSelector(transactionsSel, (txs): Transaction | null => {
    let latest: Transaction | null = null
    Object.values(txs).forEach((tx) => {
      if (!tx.tagIds.includes(tagId)) return

      if (!latest) {
        latest = tx
      } else if (isAfter(tx.dateTime, latest.dateTime)) {
        latest = tx
      }
    })

    return latest
  })

export const isRecentlyUsedSel = (tagId: string) =>
  createSelector(latestTransactionWithTagSel(tagId), (tx) => {
    const lastMonth = subMonths(new Date(), 1)
    return !tx || isAfter(tx.dateTime, lastMonth)
  })

export const tagByIdSel = (id: string) =>
  createSelector(tagsSel, (tags) => tags[id])
