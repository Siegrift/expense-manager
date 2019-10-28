import { removeFromFirebase, uploadToFirebase } from '../actions'
import { Tag, Transaction } from '../addTransaction/state'
import { Thunk } from '../redux/types'
import { ObjectOf } from '../types'

export const saveTxEdit = (
  id: string,
  newTags: ObjectOf<Tag>,
  editedFields: Partial<Transaction>,
): Thunk => async (dispatch, getState, { logger }) => {
  logger.log('Save edited transaction')
  // TODO: what to do with tags that are not in any expense (deleted by edit)
  const tx = { ...getState().transactions[id], ...editedFields }
  await dispatch(uploadToFirebase([tx], Object.values(newTags)))
}

export const removeTx = (txId: string): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Remove transaction')
  // TODO: what to do with tags that are not in any expense (deleted by edit)
  await dispatch(removeFromFirebase([txId], []))
}
