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

export const uploadToFirebase = (txs: Transaction[], tags: Tag[]): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Upload transactions and tags to firestone')
  const data = [...tags, ...txs]

  const coll = firebase.firestore().collection('transactions')
  const uploads = chunk(data, 500).map((ch) => {
    const batch = firebase.firestore().batch()
    ch.forEach((tx) => {
      const ref = coll.doc(tx.id)
      batch.set(ref, tx)
    })

    return batch.commit()
  })

  return Promise.all(uploads)
}
