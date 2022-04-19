import { pick } from '@siegrift/tsfunct'
import { v4 as uuid } from 'uuid'

import { uploadToFirebase } from '../actions'
import { getStorageRef } from '../firebase/firebase'
import { Thunk } from '../redux/types'
import {
  createErrorNotification,
  createSuccessNotification,
  setSnackbarNotification,
  withErrorHandler,
} from '../shared/actions'
import { NO_USER_ID_ERROR, UPLOADING_DATA_ERROR, USER_DATA_NOT_LOADED_ERROR } from '../shared/constants'
import { currentUserIdSel, exchangeRatesSel, mainCurrencySel } from '../shared/selectors'
import { computeExchangeRate } from '../shared/utils'

import { AddTransaction, AnyTransaction } from './state'

export const addTransaction =
  (addTx: AddTransaction): Thunk =>
  async (dispatch, getState, { logger }) => {
    logger.log('Add transaction')

    const userId = currentUserIdSel(getState())
    const exchangeRates = exchangeRatesSel(getState())
    const mainCurrency = mainCurrencySel(getState())

    if (!userId) {
      // this shouldn't happen. We optimistically show the user the add tx form
      // and by the time he fills it there should be enough time for firebase to load.
      dispatch(setSnackbarNotification(createErrorNotification(NO_USER_ID_ERROR)))
    } else if (exchangeRates === undefined || mainCurrency === undefined) {
      dispatch(setSnackbarNotification(createErrorNotification(USER_DATA_NOT_LOADED_ERROR)))
    } else {
      const id = uuid()

      const storageRef = getStorageRef(userId, 'files', id)
      const fileUploads = addTx.attachedFileObjects.map(async ({ file }) =>
        // TODO: handle duplicate filenames
        storageRef.child(file.name).put(file)
      )

      const base = {
        id,
        ...pick(addTx, ['tagIds', 'currency', 'note', 'repeating']),
        amount: Number.parseFloat(addTx.amount),
        dateTime: addTx.useCurrentTime ? new Date() : addTx.dateTime!,
        uid: userId,
        rate: computeExchangeRate(exchangeRates.rates, addTx.currency, mainCurrency),
        attachedFiles: addTx.attachedFileObjects.map(({ file }) => file.name),
      }

      let tx: AnyTransaction
      const { type } = addTx
      switch (type) {
        case 'transfer': {
          const fromTagId = addTx.fromTagId!
          const toTagId = addTx.toTagId!
          tx = { type, ...base, fromTagId, toTagId }
          break
        }
        case 'expense':
        case 'income': {
          tx = { type, ...base }
        }
      }

      await withErrorHandler(UPLOADING_DATA_ERROR, dispatch, async () => {
        await Promise.all(fileUploads)
        await dispatch(uploadToFirebase({ txs: [tx], tags: Object.values(addTx.newTags) }))
        dispatch(setSnackbarNotification(createSuccessNotification('Transaction added successfully')))
      })
    }
  }
