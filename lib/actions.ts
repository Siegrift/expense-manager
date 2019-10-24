import { set } from '@siegrift/tsfunct'
import { chunk } from 'lodash'

import { Tag, Transaction } from './addTransaction/state'
import firebase from './firebase/firebase'
import { Action, Thunk } from './redux/types'
import { ScreenTitle } from './state'

export const setCurrentScreen = (screen: ScreenTitle): Action<ScreenTitle> => ({
  type: 'Set current screen',
  payload: screen,
  reducer: (state) => set(state, ['currentScreen'], screen),
})

const MAX_WRITES_IN_BATCH = 500

const privateUpload = (data: Array<Transaction | Tag>, collection: string) => {
  const coll = firebase.firestore().collection(collection)

  return chunk(data, MAX_WRITES_IN_BATCH).map((ch) => {
    const batch = firebase.firestore().batch()
    ch.forEach((tx) => {
      const ref = coll.doc(tx.id)
      batch.set(ref, tx)
    })

    return batch.commit()
  })
}

export const uploadToFirebase = (
  txs: Transaction[],
  tags: Tag[],
): Thunk => async (dispatch, getState, { logger }) => {
  logger.log('Upload transactions and tags to firestone')
  // NOTE: upload tags first to prevent transactions missing tags
  await privateUpload(tags, 'tags')
  await privateUpload(txs, 'transactions')
}
