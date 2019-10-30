import { set } from '@siegrift/tsfunct'
import { chunk } from 'lodash'

import { Tag, Transaction } from './addTransaction/state'
import firebase from './firebase/firebase'
import { Action, Thunk } from './redux/types'
import { ScreenTitle } from './state'

type CollectionType = 'tags' | 'transactions'
type Entry<C extends CollectionType, T> = { coll: C; data: T }

export const setCurrentScreen = (screen: ScreenTitle): Action<ScreenTitle> => ({
  type: 'Set current screen',
  payload: screen,
  reducer: (state) => set(state, ['currentScreen'], screen),
})

const MAX_WRITES_IN_BATCH = 500

const privateUpload = (
  entries: Array<Entry<'tags', Tag> | Entry<'transactions', Transaction>>,
) => {
  const colls = {
    tags: firebase.firestore().collection('tags'),
    transactions: firebase.firestore().collection('transactions'),
  }

  return chunk(entries, MAX_WRITES_IN_BATCH).map((ch) => {
    const batch = firebase.firestore().batch()
    ch.forEach(({ data, coll }) => {
      const ref = colls[coll].doc(data.id)
      batch.set(ref, data)
    })

    return batch.commit()
  })
}

const privateRemove = (
  entries: Array<Entry<'tags', string> | Entry<'transactions', string>>,
) => {
  const colls = {
    tags: firebase.firestore().collection('tags'),
    transactions: firebase.firestore().collection('transactions'),
  }

  return chunk(entries, MAX_WRITES_IN_BATCH).map((ch) => {
    const batch = firebase.firestore().batch()
    ch.forEach(({ data, coll }) => {
      const ref = colls[coll].doc(data)
      batch.delete(ref)
    })

    return batch.commit()
  })
}

export const uploadToFirebase = (
  txs: Transaction[],
  tags: Tag[],
): Thunk => async (dispatch, getState, { logger }) => {
  logger.log('Upload transactions and tags to firestone')
  // NOTE: do not wait for this promise because it will never resolve when offline
  // see: https://www.youtube.com/watch?v=XrltP8bOHT0&feature=youtu.be&t=673
  // FIXME: why typescript infers coll as string type and not 'tags'???
  privateUpload([
    ...tags.map((t): Entry<'tags', Tag> => ({ coll: 'tags', data: t })),
    ...txs.map(
      (t): Entry<'transactions', Transaction> => ({
        coll: 'transactions',
        data: t,
      }),
    ),
  ])
  return Promise.resolve()
}

export const removeFromFirebase = (
  txIds: string[],
  tagIds: string[],
): Thunk => async (dispatch, getState, { logger }) => {
  logger.log('Remove transactions and tags from firestone')
  // NOTE: do not wait for this promise because it will never resolve when offline
  // see: https://www.youtube.com/watch?v=XrltP8bOHT0&feature=youtu.be&t=673
  privateRemove([
    ...tagIds.map((t): Entry<'tags', string> => ({ coll: 'tags', data: t })),
    ...txIds.map(
      (t): Entry<'transactions', string> => ({ coll: 'transactions', data: t }),
    ),
  ])
  return Promise.resolve()
}
