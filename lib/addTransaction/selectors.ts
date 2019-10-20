import { createSelector } from 'reselect'

import { State } from '../state'

export const addTransactionSel = (state: State) => state.addTransaction

export const isInvalidAmountSel = createSelector(
  addTransactionSel,
  ({ amount }) => amount.match(/^\d+(\.\d{1,2})?$/) == null,
)
