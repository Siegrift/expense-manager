import isAfter from 'date-fns/isAfter'
import subMonths from 'date-fns/subMonths'
import { createSelector } from 'reselect'

import { sorted } from '../shared/utils'
import { State } from '../state'

export const tagsSel = (state: State) => state.tags
export const sortedTagsSel = createSelector(
  tagsSel,
  (tags) => sorted(tags, (a, b) => (a.name < b.name ? -1 : 1)),
)
export const transactionsSel = (state: State) => state.transactions

export const tagFromSortedTagsByIndex = (index: number) =>
  createSelector(
    sortedTagsSel,
    (tags) => tags[index],
  )

export const totalTransactionsSel = (id: string) =>
  createSelector(
    transactionsSel,
    (txs) => Object.values(txs).filter((tx) => tx.tagIds.includes(id)).length,
  )

export const totalExpenseInTransactionsSel = (id: string) =>
  createSelector(
    transactionsSel,
    (txs) =>
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

export const isRecentlyUsedTagSel = (id: string) =>
  createSelector(
    transactionsSel,
    (txs) => {
      const lastMonth = subMonths(new Date(), 1)
      return (
        Object.values(txs).filter(
          (tx) => isAfter(tx.dateTime, lastMonth) && tx.tagIds.includes(id),
        ).length > 0
      )
    },
  )

export const tagByIdSel = (id: string) =>
  createSelector(
    tagsSel,
    (tags) => tags[id],
  )
