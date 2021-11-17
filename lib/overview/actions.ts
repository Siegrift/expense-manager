import { set } from '@siegrift/tsfunct'

import { Action } from '../redux/types'
import { OverviewPeriod } from '../state'

export const setOverviewPeriod = (period: OverviewPeriod): Action<OverviewPeriod> => ({
  type: 'Set overview period',
  payload: period,
  reducer: (state) => set(state, ['overview', 'period'], period),
})

export const setCustomDateRange = (range: [Date | null, Date | null]): Action<[Date | null, Date | null]> => ({
  type: 'Set custom date range',
  payload: range,
  reducer: (state) => set(state, ['overview', 'customDateRange'], range),
})

export const setMonth = (month: number): Action<number> => ({
  type: 'Set overview month',
  payload: month,
  reducer: (state) => set(state, ['overview', 'month'], month),
})
