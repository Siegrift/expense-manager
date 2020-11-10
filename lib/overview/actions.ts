import { set } from '@siegrift/tsfunct'

import { Action } from '../redux/types'
import { OverviewPeriod } from '../state'

export const setOverviewPeriod = (
  period: OverviewPeriod,
): Action<OverviewPeriod> => ({
  type: 'Set overview period',
  payload: period,
  reducer: (state) => set(state, ['overviewPeriod'], period),
})
