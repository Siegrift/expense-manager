import { set } from '@siegrift/tsfunct'
import { difference } from 'lodash'
import Router from 'next/router'

import { removeFromFirebase, uploadToFirebase } from '../actions'
import { Tag, Transaction } from '../addTransaction/state'
import { getStorageRef } from '../firebase/firebase'
import { Action, Thunk } from '../redux/types'
import {
  createSuccessNotification,
  setSnackbarNotification,
  withErrorHandler,
} from '../shared/actions'
import { currentUserIdSel } from '../shared/selectors'
import { TransactionSearch } from '../state'
import { ObjectOf } from '../types'

import { applySearchOnTransactions } from './selectors'

export const saveTxEdit = (
  newTags: ObjectOf<Tag>,
  newFiles: File[],
  editedFields: Omit<Transaction, 'uid'>,
): Thunk => async (dispatch, getState, { logger }) => {
  logger.log('Save edited transaction')

  const userId = currentUserIdSel(getState())!
  const originalTx = getState().transactions[editedFields.id]
  // TODO: what to do with tags that are not in any expense (deleted by edit)
  const tx = { ...originalTx, ...editedFields }
  const storageRef = getStorageRef(userId, 'files', originalTx.id)
  let success: boolean | undefined

  // remove user selected uploaded files from storage
  success = await withErrorHandler(
    'Failed to remove attached files',
    dispatch,
    async () => {
      const toRemove = difference(
        originalTx.attachedFiles!,
        editedFields.attachedFiles!,
      )

      const promises = toRemove.map((filename) =>
        storageRef.child(filename).delete(),
      )
      await Promise.all(promises)
      return true
    },
  )

  // upload files chosen by the user
  if (success) {
    success = await withErrorHandler(
      'Failed to upload new attached files',
      dispatch,
      async () => {
        const fileUploads = newFiles.map(async (file) =>
          // TODO: handle duplicate filenames
          storageRef.child(file.name).put(file),
        )
        await Promise.all(fileUploads)
        return true
      },
    )
  }

  if (success) {
    success = await withErrorHandler(
      'Failed to upload edited transaction',
      dispatch,
      async () => {
        await dispatch(
          uploadToFirebase({ txs: [tx], tags: Object.values(newTags) }),
        )
        return true
      },
    )
  }

  if (success) {
    dispatch(
      setSnackbarNotification(
        createSuccessNotification('Transaction edit successful'),
      ),
    )
  }
}

export const removeTx = (txId: string): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Remove transaction')

  const userId = currentUserIdSel(getState())!
  const tx = getState().transactions[txId]
  const storageRef = getStorageRef(userId, 'files', txId)

  let success = await withErrorHandler(
    'Failed to remove attached files',
    dispatch,
    async () => {
      const promises = tx.attachedFiles?.map((filename) =>
        storageRef.child(filename).delete(),
      )

      await Promise.all(promises ?? [])
      return true
    },
  )

  if (success) {
    success = await withErrorHandler(
      'Failed to remove transaction data',
      dispatch,
      async () => {
        // TODO: what to do with tags that are not in any expense (deleted by edit)
        await dispatch(removeFromFirebase([txId], []))
        return true
      },
    )
  }

  if (success) {
    dispatch(
      setSnackbarNotification(
        createSuccessNotification('Transaction successfully removed'),
      ),
    )
  }
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
  const cursor = getState().cursor
  const txs = applySearchOnTransactions(getState())
  if (!txs[cursor]) return

  const actions = {
    ARROWUP: () => {
      if (cursor > 0) {
        Router.replace(`/transactions`, `/transactions#${txs[cursor - 1].id}`)
      }
    },
    ARROWDOWN: () => {
      if (cursor + 1 < txs.length) {
        Router.replace(`/transactions`, `/transactions#${txs[cursor + 1].id}`)
      }
    },
    E: () => Router.push(`/transactions/details?id=${txs[cursor].id}`),
    D: () => dispatch(setConfirmTxDeleteDialogOpen(true)),
  }

  if (!actions.hasOwnProperty(key)) return

  // only log this if the keypress is actionable to reduce spam
  logger.log('Transaction list action for key: ' + key)

  // trigger the action
  actions[key]()
}
