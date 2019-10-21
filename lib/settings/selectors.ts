import { createSelector } from 'reselect'

import { State } from '../state'

export const stateSel = (state: State) => state

export const exportedCsvSel = createSelector(
  stateSel,
  (state) => {
    return JSON.stringify(state)
  },
)
