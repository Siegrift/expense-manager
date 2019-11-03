import { createSelector } from 'reselect'

import { isAmountInValidFormat } from '../shared/utils'
import { State } from '../state'

export const addTransactionSel = (state: State) => state.addTransaction
export const tagsSel = (state: State) => state.tags

export const isInvalidAmountSel = createSelector(
  addTransactionSel,
  ({ amount }) => !isAmountInValidFormat(amount),
)

export const automaticTagIdsSel = createSelector(
  tagsSel,
  (tags) =>
    Object.values(tags)
      .filter((tag) => tag.automatic)
      .map((tag) => tag.id),
)
