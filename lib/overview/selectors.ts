import {
  startOfDay,
  isWithinInterval,
  subDays,
  differenceInCalendarDays,
  startOfMonth,
  endOfMonth,
  parse,
  endOfDay,
  format,
} from 'date-fns'
import { sortedUniq } from 'lodash'
import { createSelector } from 'reselect'

import { Transaction } from '../addTransaction/state'
import { mainCurrencySel } from '../shared/selectors'
import { formatMoney, isValidDate } from '../shared/utils'
import { OverviewPeriod, State } from '../state'
import { sortedTransactionsSel } from '../transactions/selectors'
import { DateRange } from '../types'

const OVERVIEW_MONTH_FORMAT = 'MMMM yyyy'

export const overviewPeriodSel = (state: State) => state.overview.period
export const customDateRangeSel = (state: State) =>
  state.overview.customDateRange
export const monthSel = (state: State) => state.overview.month

export const overviewMonthsSel = createSelector(
  sortedTransactionsSel,
  (txs) => {
    const mapped = txs.map(({ dateTime }: Transaction) =>
      format(dateTime, OVERVIEW_MONTH_FORMAT),
    )

    return sortedUniq(mapped)
  },
)

const monthDateRangeSel = createSelector(
  overviewMonthsSel,
  monthSel,
  (options, month): DateRange | null => {
    // if there are no transactions there won't be any option
    if (!options[month]) return null

    const date = parse(options[month], OVERVIEW_MONTH_FORMAT, new Date())
    return { start: startOfMonth(date), end: endOfMonth(date) }
  },
)

export const dateRangeSel = createSelector(
  overviewPeriodSel,
  monthDateRangeSel,
  customDateRangeSel,
  (period, monthRange, dateRange) => {
    const now = new Date()
    const endOfToday = endOfDay(now)
    const invalidCustomRange =
      !isValidDate(dateRange[0]) || !isValidDate(dateRange[1])

    const totalDays: {
      [k in OverviewPeriod]: DateRange
    } = {
      '7days': { end: endOfToday, start: subDays(startOfDay(now), 7 - 1) },
      '30days': { end: endOfToday, start: subDays(startOfDay(now), 30 - 1) },
      month: monthRange ?? { start: now, end: now },
      custom: {
        start: invalidCustomRange ? now : dateRange[0]!,
        end: invalidCustomRange ? now : dateRange[1]!,
      },
    }

    return totalDays[period]
  },
)

export const overviewTransactionsSel = createSelector(
  dateRangeSel,
  sortedTransactionsSel,
  (range, txs) => {
    return txs.filter((tx) => isWithinInterval(tx.dateTime, range))
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
    }
  },
)
