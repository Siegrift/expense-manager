import { update } from '@siegrift/tsfunct'
import { endOfMonth, subMonths, differenceInCalendarMonths } from 'date-fns'
import isWithinInterval from 'date-fns/isWithinInterval'
import filter from 'lodash/filter'
import map from 'lodash/map'
import range from 'lodash/range'
import reduce from 'lodash/reduce'
import { createSelector } from 'reselect'

import { Tag, Transaction } from '../addTransaction/state'
import { percentage, sorted } from '../shared/utils'
import { State } from '../state'
import { tagsSel } from '../tags/selectors'
import { sortedTransactionsSel } from '../transactions/selectors'
import { DateRange, ObjectOf } from '../types'

interface AssetTagShare {
  id: string
  value: number
}

const transactionsSel = (state: State) => state.transactions

const assetTagsSel = (state: State) => filter(state.tags, (tag) => !!tag.isAsset)

interface AssetTagSum {
  tag: Tag
  value: number
}

export const assetTagsSumsSel = createSelector(assetTagsSel, transactionsSel, (assetTags, txs): AssetTagSum[] =>
  map(assetTags, (assetTag) => {
    const asssetTxs = filter(txs, (tx) => tx.tagIds.includes(assetTag.id))
    const minusTransferTxs = filter(txs, (tx) => tx.tagIds[0] === assetTag.id && tx.type === 'transfer')
    const plusTransferTxs = filter(txs, (tx) => tx.tagIds[1] === assetTag.id && tx.type === 'transfer')
    const minusAmout = reduce(
      filter(asssetTxs, (tx) => tx.type === 'expense').concat(minusTransferTxs),
      (acc, tx) => acc - tx.amount,
      0
    )
    const plusAmout = reduce(
      filter(asssetTxs, (tx) => tx.type === 'income').concat(plusTransferTxs),
      (acc, tx) => acc + tx.amount,
      0
    )
    return {
      tag: assetTag,
      value: minusAmout + plusAmout,
    }
  })
)

// TODO: Write unit test for this
export const assetTagSharesSel = createSelector(assetTagsSumsSel, (assetTagsSums) => {
  const filteredAssetTagsSums = filter(assetTagsSums, (assetTagSum) => assetTagSum.value > 0)
  const total = reduce(filteredAssetTagsSums, (acc, assetTagSum) => acc + assetTagSum.value, 0)
  const assetTagShares = map(
    filteredAssetTagsSums,
    (assetTagSum): AssetTagShare => ({
      id: assetTagSum.tag.name,
      value: percentage(assetTagSum.value, total),
    })
  )

  // descending sort
  return sorted(assetTagShares, (t1, t2) => t2.value - t1.value)
})

export const displayDataSel = (width: number, dateRange: DateRange | undefined) =>
  createSelector(sortedTransactionsSel, () => {
    // 55 is ad-hoc const that works well with current xAxis format (dd.MM)
    // `width / LABEL_WIDTH_PX` is the number of labels displayed on xAxis
    const LABEL_WIDTH_PX = 55

    const endOfThisMonth = endOfMonth(new Date())
    let range: DateRange
    let xAxisMergeSize: number
    let monthsToDisplay: number
    if (dateRange) {
      range = dateRange
      monthsToDisplay = differenceInCalendarMonths(dateRange.end, dateRange.start) + 1
      xAxisMergeSize = Math.round(monthsToDisplay / (width / LABEL_WIDTH_PX))
    } else {
      monthsToDisplay = Math.round(width / LABEL_WIDTH_PX)
      range = { start: subMonths(endOfThisMonth, monthsToDisplay), end: endOfThisMonth }
      xAxisMergeSize = 1 // show every label
    }

    return {
      xAxisMergeSize: Math.max(xAxisMergeSize, 1),
      monthsToDisplay,
      ...range,
    }
  })

const assetTxsSel = createSelector(assetTagsSel, transactionsSel, (assetTags, txs) =>
  filter(txs, (tx) => tx.tagIds.some((id) => assetTags.map((assetTag) => assetTag.id).includes(id)))
)

const assetTxBelogsTo = (tx: Transaction, assetTags: Tag[], tags: ObjectOf<Tag>): string => {
  const assetTagsIds = assetTags.map((tag) => tag.id)
  let idOfAssetTag = ''
  tx.tagIds.forEach((id) => {
    if (assetTagsIds.includes(id)) idOfAssetTag = id
  })
  return tags[idOfAssetTag].name
}

const nameOfTag = (id: string, tags: ObjectOf<Tag>): string => tags[id].name

type Lines = {
  [key: string]: {
    id: string
    data: Array<{
      x: number
      y: number
      index: number
    }>
  }
}

export const recentBalanceDataSel = (monthsToDisplay: number, dateRange: DateRange) =>
  createSelector(assetTxsSel, assetTagsSel, tagsSel, (transactions, assetTags, tags) => {
    if (monthsToDisplay === 0) return null
    interface LineChartData {
      amount: number
      dataIndex: number
      type: 'income' | 'expense' | 'transfer'
      asset: string
    }

    const assetTagsIds = assetTags.map((tag) => tag.id)
    const expenseTrasferTransactions = transactions
      .filter((tx) => tx.type === 'transfer' && assetTagsIds.includes(tx.tagIds[0]))
      .map(
        (tx): Transaction => ({
          ...tx,
          type: 'expense',
          tagIds: tx.tagIds.slice(0, 1),
        })
      )
    const incomeTrasferTransactions = transactions
      .filter((tx) => tx.type === 'transfer' && assetTagsIds.includes(tx.tagIds[1]))
      .map(
        (tx): Transaction => ({
          ...tx,
          type: 'income',
          tagIds: tx.tagIds.slice(1, 2),
        })
      )
    const assets = transactions
      .filter((tx) => tx.type !== 'transfer')
      .concat(incomeTrasferTransactions)
      .concat(expenseTrasferTransactions)

    type LCO = {
      [key: string]: LineChartData[]
    }

    const groupedTransactions = assets
      .map(
        (tx): LineChartData => ({
          amount: tx.amount * (tx.rate ?? 1),
          type: tx.type,
          dataIndex: isWithinInterval(tx.dateTime, dateRange)
            ? monthsToDisplay - (differenceInCalendarMonths(dateRange.end, tx.dateTime) + 1)
            : 0,
          asset: tx.tagIds.length === 1 ? nameOfTag(tx.tagIds[0], tags) : assetTxBelogsTo(tx, assetTags, tags),
        })
      )
      .reduce(
        (acc, tx) => {
          return update(acc, [tx.dataIndex, tx.asset], (d) => (d ? [...d, tx] : [tx]))
        },
        range(monthsToDisplay).map(() => ({} as LCO))
      )

    const data = {} as Lines

    groupedTransactions.forEach((assetsInMonth, dataInd) => {
      Object.keys(assetsInMonth).forEach((asset) => {
        const txs = assetsInMonth[asset]
        if (!data[asset])
          data[asset] = {
            id: asset,
            data: range(monthsToDisplay).map((_, index) => ({
              x: index,
              y: 0,
              index: index,
            })),
          }
        txs.forEach((tx) => {
          if (tx.type === 'expense') data[tx.asset].data[dataInd].y -= tx.amount
          if (tx.type === 'income') data[tx.asset].data[dataInd].y += tx.amount
        })
      })
    })

    Object.values(data).forEach((asset) =>
      asset.data.forEach((_, index) => {
        if (index !== 0) asset.data[index].y += asset.data[index - 1].y
      })
    )

    // the y values are not rounded! Make sure to round in the component
    return Object.values(data)
  })
