import filter from 'lodash/filter'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import { createSelector } from 'reselect'

import { sorted } from '../shared/utils'
import { State } from '../state'

export interface AssetTagShare {
  id: string
  label: string
  value: number
}

const transactionsSel = (state: State) => state.transactions

const assetTagSel = (state: State) => filter(state.tags, (tag) => tag.isAsset != undefined && tag.isAsset)

const totalAmountSel = createSelector(transactionsSel, assetTagSel, (txs, assetTags) => {
  const assetTxs = filter(txs, (tx) => {
    return tx.tagIds.some((someTagId) => {
      return assetTags.some((someAssetTag) => someTagId === someAssetTag.id)
    })
  })
  return reduce(assetTxs, (acc, tx) => acc + (tx.isExpense ? -tx.amount : tx.amount), 0)
})

export const assetTagSharesSel = createSelector(
  assetTagSel,
  transactionsSel,
  totalAmountSel,
  (assetTags, txs, total): AssetTagShare[] => {
    const assetTagShares = map(assetTags, (assetTag) => {
      const filteredTx = filter(txs, (tx) => tx.tagIds.includes(assetTag.id))
      const sum = reduce(filteredTx, (acc, tx) => acc + tx.amount, 0)

      return {
        id: assetTag.id,
        label: assetTag.name,
        value: Math.round((sum / total) * 100 * 100) / 100,
      }
    })

    // descending sort
    return sorted(assetTagShares, (t1, t2) => t2.value - t1.value)
  }
)
