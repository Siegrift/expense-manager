import { pick } from '@siegrift/tsfunct'
import { v4 as uuid } from 'uuid'

import { uploadToFirebase } from '../actions'
import { Thunk } from '../redux/types'
import { setAppError } from '../shared/actions'
import { NO_USER_ID_ERROR } from '../shared/constants'
import { currentUserIdSel } from '../shared/selectors'

import { AddTransaction } from './state'

export const addTransaction = (addTx: AddTransaction): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Add transaction')

  const userId = currentUserIdSel(getState())
  if (!userId) {
    // this shouldn't happen. We optimistically show the user the add tx form
    // and by the time he fills it there should be enough time for firebase to load.
    dispatch(setAppError(NO_USER_ID_ERROR))
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
    }

    // TODO: handle network error
    await dispatch(uploadToFirebase([tx], Object.values(addTx.newTags)))
  }
}
