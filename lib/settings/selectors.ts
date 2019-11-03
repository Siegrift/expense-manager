import { createSelector } from 'reselect'

import { State } from '../state'

export const tagsSel = (state: State) => state.tags
export const transactionsSel = (state: State) => state.transactions

// NOTE: export format described under 'processImportedCSV' function
// NOTE: this is tested in actions not in selectors
export const exportedCsvSel = createSelector(
  tagsSel,
  transactionsSel,
  (tags, txs) => {
    const lines = Object.values(txs).map((tx) =>
      [
        tx.dateTime.toISOString(),
        tx.isExpense ? -tx.amount : tx.amount,
        tx.tagIds.map((id) => tags[id].name).join('|'),
        tx.note,
        tx.currency,
        tx.repeating,
      ].join(','),
    )

    return lines.join('\n')
  },
)
