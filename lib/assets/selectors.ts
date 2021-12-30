import filter from 'lodash/filter'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import { createSelector } from 'reselect'

import { Tag } from '../addTransaction/state'
import { sorted } from '../shared/utils'
import { State } from '../state'

interface AssetTagShare {
  id: string
  label: string
  value: number
}

const transactionsSel = (state: State) => state.transactions

const assetTagsSel = (state: State) => filter(state.tags, (tag) => !!tag.isAsset)

interface AssetTagSum {
  tag: Tag
  value: number
}

const assetTagsSumsSel = createSelector(assetTagsSel, transactionsSel, (assetTags, txs): AssetTagSum[] =>
  map(assetTags, (assetTag) => {
    const filteredTxs = filter(txs, (tx) => tx.tagIds.includes(assetTag.id))
    const sum = reduce(filteredTxs, (acc, tx) => acc + (tx.isExpense ? -tx.amount : tx.amount), 0)
    return {
      tag: assetTag,
      value: sum,
    }
  })
)

const percentage = (value: number, total: number) => Math.round((value / total) * 100 * 100) / 100

export const assetTagSharesSel = createSelector(assetTagsSumsSel, (assetTagsSums): AssetTagShare[] => {
  const filteredAssetTagsSums = filter(assetTagsSums, (assetTagSum) => assetTagSum.value > 0)
  const total = reduce(filteredAssetTagsSums, (acc, assetTagSum) => acc + assetTagSum.value, 0)
  const assetTagShares = map(filteredAssetTagsSums, (assetTagSum) => ({
    // graph displays both id and label - we want them both to be assetTag.name
    id: assetTagSum.tag.name,
    label: assetTagSum.tag.name,
    value: percentage(assetTagSum.value, total),
  }))

  // descending sort
  return sorted(assetTagShares, (t1, t2) => t2.value - t1.value)
})
