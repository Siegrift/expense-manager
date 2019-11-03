import { filter, map, reduce } from 'lodash'
import { createSelector } from 'reselect'

import { sorted } from '../shared/utils'
import { State } from '../state'

export const tagsSel = (state: State) => state.tags
export const transactionsSel = (state: State) => state.transactions

export interface TagShare {
  id: string
  label: string
  value: number
}

const totalAmountSel = (state: State) =>
  reduce(state.transactions, (acc, tx) => acc + tx.amount, 0)

export const tagSharesSel = createSelector(
  tagsSel,
  transactionsSel,
  totalAmountSel,
  (tags, txs, total): TagShare[] => {
    const tagShares = map(tags, (tag) => {
      const filteredTx = filter(txs, (tx) => tx.tagIds.includes(tag.id))
      const sum = reduce(filteredTx, (acc, tx) => acc + tx.amount, 0)

      return {
        id: tag.id,
        label: tag.name,
        value: Math.round((sum / total) * 100 * 100) / 100,
      }
    })

    // descending sort
    return sorted(tagShares, (t1, t2) => t2.value - t1.value)
  },
)
