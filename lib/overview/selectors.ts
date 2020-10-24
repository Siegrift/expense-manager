import { startOfDay, isAfter, subDays } from 'date-fns'
import { createSelector } from 'reselect'

import { mainCurrencySel } from '../shared/selectors'
import { formatMoney } from '../shared/utils'
import { sortedTransactionsSel } from '../transactions/selectors'

const NUMBER_OF_DAYS = 7

export const overviewTransactionsSel = createSelector(
  sortedTransactionsSel,
  (txs) => {
    const startDate = subDays(startOfDay(new Date()), NUMBER_OF_DAYS)
    return txs.filter((tx) => isAfter(tx.dateTime, startDate))
  },
)

export const txsInfoSel = createSelector(
  overviewTransactionsSel,
  mainCurrencySel,
  (txs, currency) => {
    const income = txs
      .filter((t) => !t.isExpense)
      .reduce((sum, tx) => sum + tx.amount, 0)
    const expense = txs
      .filter((t) => t.isExpense)
      .reduce((sum, tx) => sum + tx.amount, 0)

    if (!currency) return null
    return {
      income: formatMoney(income, currency),
      expense: formatMoney(expense, currency),
      relativeBalance: formatMoney(income - expense, currency),
      average: formatMoney((income - expense) / NUMBER_OF_DAYS, currency),
    }
  },
)
