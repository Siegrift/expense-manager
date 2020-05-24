import { pick } from '@siegrift/tsfunct'
import { v4 as uuid } from 'uuid'

import { uploadToFirebase } from '../actions'
import { getCurrentUserId } from '../firebase/util'
import { Thunk } from '../redux/types'

import { AddTransaction } from './state'

export const addTransaction = (addTx: AddTransaction): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Add transaction')

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
    uid: getCurrentUserId(),
  }

  await dispatch(uploadToFirebase([tx], Object.values(addTx.newTags)))
}
