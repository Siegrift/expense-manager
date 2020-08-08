import { pick } from '@siegrift/tsfunct'
import { v4 as uuid } from 'uuid'

import { uploadToFirebase } from '../actions'
import { Thunk } from '../redux/types'
import { setAppError } from '../shared/actions'
import {
  NO_USER_ID_ERROR,
  USER_DATA_NOT_LOADED_ERROR,
} from '../shared/constants'
import {
  currentUserIdSel,
  exchangeRatesSel,
  mainCurrencySel,
} from '../shared/selectors'
import { computeExchangeRate } from '../shared/utils'

import { AddTransaction } from './state'

export const addTransaction = (addTx: AddTransaction): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Add transaction')

  const userId = currentUserIdSel(getState())
  const exchangeRates = exchangeRatesSel(getState())
  const mainCurrency = mainCurrencySel(getState())

  if (!userId) {
    // this shouldn't happen. We optimistically show the user the add tx form
    // and by the time he fills it there should be enough time for firebase to load.
    dispatch(setAppError(NO_USER_ID_ERROR))
  } else if (exchangeRates === undefined || mainCurrency === undefined) {
    dispatch(setAppError(USER_DATA_NOT_LOADED_ERROR))
  } else {
    const id = uuid()

    const tx = {
      id,
      ...pick(addTx, [
        'transactionType',
        'tagIds',
        'currency',
        'isExpense',
        'note',
        'repeating',
      ]),
      amount: Number.parseFloat(addTx.amount),
      dateTime: addTx.useCurrentTime ? new Date() : addTx.dateTime!,
      uid: userId,
      rate: computeExchangeRate(
        exchangeRates.rates,
        addTx.currency,
        mainCurrency,
      ),
    }

    // TODO: handle network error
    await dispatch(
      uploadToFirebase({ txs: [tx], tags: Object.values(addTx.newTags) }),
    )
  }
}
