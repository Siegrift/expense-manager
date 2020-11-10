import {
  startOfDay,
  isWithinInterval,
  subDays,
  startOfWeek,
  differenceInCalendarDays,
  startOfMonth,
  endOfDay,
} from 'date-fns'
import { createSelector } from 'reselect'

import { mainCurrencySel } from '../shared/selectors'
import { formatMoney } from '../shared/utils'
import { OverviewPeriod, State } from '../state'
import { sortedTransactionsSel } from '../transactions/selectors'
import { DateRange } from '../types'

export const overviewPeriodSel = (state: State) => state.overviewPeriod

export const dateRangeSel = createSelector(overviewPeriodSel, (period) => {
  const now = new Date()
  const endOfToday = endOfDay(now)

  const totalDays: {
    [k in OverviewPeriod]: DateRange
  } = {
    week: { end: endOfToday, start: subDays(startOfDay(now), 7 - 1) },
    month: { end: endOfToday, start: subDays(startOfDay(now), 30 - 1) },
    wtd: {
      end: endOfToday,
      start: startOfWeek(now, { weekStartsOn: 1 /* Monday */ }),
    },
    mtd: { end: endOfToday, start: startOfMonth(now) },
  }

  return totalDays[period]
})

export const overviewTransactionsSel = createSelector(
  dateRangeSel,
  sortedTransactionsSel,
  ({ start, end }, txs) => {
    return txs.filter((tx) =>
      isWithinInterval(tx.dateTime, { start: start, end: end }),
    )
  },
)

export const txsInfoSel = createSelector(
  dateRangeSel,
  overviewTransactionsSel,
  mainCurrencySel,
  (dateRange, transactions, currency) => {
    const income = transactions
      .filter((t) => !t.isExpense)
      .reduce((sum, tx) => sum + tx.amount, 0)
    const expense = transactions
      .filter((t) => t.isExpense)
      .reduce((sum, tx) => sum + tx.amount, 0)

    if (!currency) return null
    return {
      income: formatMoney(income, currency),
      expense: formatMoney(expense, currency),
      relativeBalance: formatMoney(income - expense, currency),
      averagePerDay: formatMoney(
        (income - expense) /
          (differenceInCalendarDays(dateRange.end, dateRange.start) + 1),
        currency,
      ),
      totalTransactions: transactions.length,
      averagePerTransaction: formatMoney(
        transactions.length === 0
          ? 0
          : (income - expense) / transactions.length,
        currency,
      ),
    }
  },
)
