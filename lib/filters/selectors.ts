import { createSelector } from 'reselect'

import { deepFreeze } from '../shared/utils'
import { State } from '../state'

const tagsSel = (state: State) => state.tags
const transactionsSel = (state: State) => state.transactions
const profileSel = (state: State) => state.profile

const filterDataSel = createSelector(tagsSel, transactionsSel, profileSel, (tags, transactions, profile) => ({
  tags: Object.values(tags),
  transactions: Object.values(transactions),
  profile: Object.values(profile)[0],
}))

export const frozenFilterDataSel = createSelector(filterDataSel, (data) => deepFreeze(data))

export const availableFiltersSel = (state: State) => state.filters?.available
export const filtersErrorSel = (state: State) => state.filters?.error
export const currentFilterSel = (state: State) => state.filters?.current

export type FilterFunctionData = ReturnType<typeof frozenFilterDataSel>
export type FilterFunction = (data: FilterFunctionData) => FilterFunctionData

export const filterFunctionFromCodeSel = createSelector(
  currentFilterSel,
  (filter) => filter && (eval(filter.code) as FilterFunction)
)
