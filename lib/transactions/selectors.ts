import { createSelector } from 'reselect'

import { State } from '../state'

export const transactionsSel = (state: State) => state.transactions

export const sortedTransactionsSel = createSelector(
  transactionsSel,
  (txs) =>
    Object.values(txs).sort(
      (tx1, tx2) => tx2.dateTime.getTime() - tx1.dateTime.getTime(),
    ),
)
