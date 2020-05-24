import { removeFromFirebase, uploadToFirebase } from '../actions'
import { Tag, Transaction } from '../addTransaction/state'
import { ObjectOf } from '../types'
import { Action, Thunk } from '../redux/types'
import { set } from '@siegrift/tsfunct'
import { TransactionSearch } from '../state'
import { sortedTransactionsSel } from './selectors'
import Router from 'next/router'
import { clamp } from 'lodash'

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

export const changeTxSearchQuery = (
  query: TransactionSearch,
): Action<TransactionSearch> => ({
  type: 'Change search query',
  payload: query,
  reducer: (state) => set(state, ['transactionSearch'], query),
})

export const setCursor = (newCursor: number): Action<number> => ({
  type: 'Set cursor',
  payload: newCursor,
  reducer: (state) => set(state, ['cursor'], newCursor),
})

export const keyPressAction = (e: KeyboardEvent): Thunk<void> => (
  dispatch,
  getState,
  { logger },
) => {
  const key = e.key.toUpperCase()
  logger.log('Transaction list keyboard press: ' + key)

  const cursor = getState().cursor
  const txs = sortedTransactionsSel(getState())
  switch (key) {
    case 'ARROWUP':
      if (cursor > 0) dispatch(setCursor(cursor - 1))
      break
    case 'ARROWDOWN':
      if (cursor + 1 < txs.length) dispatch(setCursor(cursor + 1))
      break
    case 'E':
      Router.push('/transactions/[id]', `/transactions/${txs[cursor].id}`)
      break
    case 'D':
      dispatch(removeTx(txs[cursor].id))
      break
  }
}
