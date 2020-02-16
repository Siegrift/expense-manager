import { createSelector } from 'reselect'
import {
  COMMANDS,
  isCommandWithValidation,
  isValidQuery,
  search,
} from '../search/transactionSearch'

import { sorted } from '../shared/utils'
import { State } from '../state'

export const transactionsSel = (state: State) => state.transactions

export const querySel = (state: State) => state.transactionSearch

export const tagsSel = (state: State) => state.tags

export const transactionByIdSel = (id: string) =>
  createSelector(transactionsSel, (txs) => txs[id])

export const sortedTransactionsSel = createSelector(transactionsSel, (txs) =>
  sorted(txs, (tx1, tx2) => tx2.dateTime.getTime() - tx1.dateTime.getTime()),
)

export const isValidQuerySel = createSelector(querySel, (query) =>
  isValidQuery(query),
)

export const valueOptionsSel = createSelector(querySel, (query) => {
  const command = COMMANDS.find((c) => c.name === query.command)
  if (!command || isCommandWithValidation(command)) return undefined
  else return command.valueOptions
})

export const applySearchOnTransactions = createSelector(
  sortedTransactionsSel,
  querySel,
  isValidQuerySel,
  tagsSel,
  (txs, query, validQuery, tags) =>
    validQuery ? search(txs, query, { tags }) : txs,
)

export const txSearchQuerySel = (state: State) => state.transactionSearch
