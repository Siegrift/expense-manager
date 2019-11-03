import { omit } from '@siegrift/tsfunct'
import uuid from 'uuid/v4'

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
    ...omit(addTx, ['newTags', 'tagInputValue', 'useCurrentTime']),
    amount: Number.parseFloat(addTx.amount),
    dateTime: addTx.useCurrentTime ? new Date() : addTx.dateTime!,
    uid: getCurrentUserId(),
  }

  await dispatch(
    uploadToFirebase([tx], Object.values(getState().addTransaction.newTags)),
  )
}
