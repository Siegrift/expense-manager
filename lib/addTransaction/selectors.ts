import { createSelector } from 'reselect'

import { isAmountInValidFormat } from '../shared/utils'
import { State } from '../state'

export const addTransactionSel = (state: State) => state.addTransaction

export const isInvalidAmountSel = createSelector(
  addTransactionSel,
  ({ amount }) => !isAmountInValidFormat(amount),
)
