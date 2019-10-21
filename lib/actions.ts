import { set } from '@siegrift/tsfunct'
import { firestore } from 'firebase/app'

import { Tag, Transaction } from './addTransaction/state'
import { Action, Thunk } from './redux/types'
import { ScreenTitle } from './state'
import { ObjectOf } from './types'

export const setCurrentScreen = (screen: ScreenTitle): Action<ScreenTitle> => ({
  type: 'Set current screen',
  payload: screen,
  reducer: (state) => set(state, ['currentScreen'], screen),
})

export const uploadTransactions = (txs: Transaction[]): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Upload multiple transactions to firestone')
  return Promise.all(txs.map((tx) => dispatch(uploadTransaction(tx))))
}

export const uploadTransaction = (tx: Transaction): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Upload transaction to firestone')

  return firestore()
    .collection('transactions')
    .doc(tx.id)
    .set(tx)
    .catch((error) => {
      // TODO: handle errors
      console.error('Error writing new message to Firebase Database', error)
    })
}

export const uploadTags = (tags: ObjectOf<Tag>): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Upload tags to firestone')

  const coll = firestore().collection('tags')
  const uploads = Object.values(tags).map((tag) =>
    coll
      .doc(tag.id)
      .set(tag)
      .catch((error) => {
        // TODO: handle errors
        console.error('Error writing new message to Firebase Database', error)
      }),
  )

  return Promise.all(uploads)
}
