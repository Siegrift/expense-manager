import { set } from '@siegrift/tsfunct'
import { firestore } from 'firebase/app'
import { chunk } from 'lodash'

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

  const coll = firestore().collection('transactions')
  const uploads = chunk(txs, 500).map((ch) => {
    const batch = firestore().batch()
    ch.forEach((tx) => {
      const ref = coll.doc(tx.id)
      batch.set(ref, tx)
    })

    return batch.commit()
  })

  return Promise.all(uploads)
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
  const uploads = chunk(Object.values(tags), 500).map((ch) => {
    const batch = firestore().batch()
    ch.forEach((tag) => {
      const ref = coll.doc(tag.id)
      batch.set(ref, tag)
    })

    return batch.commit()
  })

  return Promise.all(uploads)
}
