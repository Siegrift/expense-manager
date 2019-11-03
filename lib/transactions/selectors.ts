import { createSelector } from 'reselect'

import { sorted } from '../shared/utils'
import { State } from '../state'

export const transactionsSel = (state: State) => state.transactions

export const transactionByIdSel = (id: string) =>
  createSelector(
    transactionsSel,
    (txs) => txs[id],
  )

export const sortedTransactionsSel = createSelector(
  transactionsSel,
  (txs) =>
    sorted(txs, (tx1, tx2) => tx2.dateTime.getTime() - tx1.dateTime.getTime()),
)
