import { set } from '@siegrift/tsfunct'
import Router from 'next/router'

import { removeFromFirebase, uploadToFirebase } from '../actions'
import { Tag, Transaction } from '../addTransaction/state'
import { Action, Thunk } from '../redux/types'
import {
  createSuccessNotification,
  setSnackbarNotification,
} from '../shared/actions'
import { TransactionSearch } from '../state'
import { ObjectOf } from '../types'

import { applySearchOnTransactions } from './selectors'

export const saveTxEdit = (
  id: string,
  newTags: ObjectOf<Tag>,
  editedFields: Partial<Transaction>,
): Thunk => async (dispatch, getState, { logger }) => {
  logger.log('Save edited transaction')
  // TODO: what to do with tags that are not in any expense (deleted by edit)
  const tx = { ...getState().transactions[id], ...editedFields }
  await dispatch(uploadToFirebase({ txs: [tx], tags: Object.values(newTags) }))
  dispatch(
    setSnackbarNotification(
      createSuccessNotification('Transaction edit successful'),
    ),
  )
}

export const removeTx = (txId: string): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Remove transaction')
  // TODO: what to do with tags that are not in any expense (deleted by edit)
  await dispatch(removeFromFirebase([txId], []))
  dispatch(
    setSnackbarNotification(
      createSuccessNotification('Transaction successfully removed'),
    ),
  )
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

export const setConfirmTxDeleteDialogOpen = (open: boolean): Action => ({
  type: `${open ? 'Open' : 'Close'} confirm delete tx dialog`,
  reducer: (state) => set(state, ['confirmTxDeleteDialogOpen'], open),
})

export const keyPressAction = (e: KeyboardEvent): Thunk<void> => (
  dispatch,
  getState,
  { logger },
) => {
  const key = e.key.toUpperCase()
  // TODO: log this if the keypress is actionable
  logger.log('Transaction list keyboard press: ' + key)

  const cursor = getState().cursor
  const txs = applySearchOnTransactions(getState())
  if (!txs[cursor]) return

  switch (key) {
    case 'ARROWUP':
      if (cursor > 0) {
        Router.replace(`/transactions`, `/transactions#${txs[cursor - 1].id}`)
      }
      break
    case 'ARROWDOWN':
      if (cursor + 1 < txs.length) {
        Router.replace(`/transactions`, `/transactions#${txs[cursor + 1].id}`)
      }
      break
    case 'E':
      Router.push(`/transactions/details?id=${txs[cursor].id}`)
      break
    case 'D':
      dispatch(setConfirmTxDeleteDialogOpen(true))
      break
  }
}
