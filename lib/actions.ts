import { set } from '@siegrift/tsfunct'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import addWeeks from 'date-fns/addWeeks'
import addYears from 'date-fns/addYears'
import isBefore from 'date-fns/isBefore'
import chunk from 'lodash/chunk'
import uuid from 'uuid/v4'

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

export const uploadToFirebase = (txs: Transaction[], tags: Tag[]): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Upload transactions and tags to firestone')
  // NOTE: do not wait for this promise because it will never resolve when offline
  // see: https://www.youtube.com/watch?v=XrltP8bOHT0&feature=youtu.be&t=673
  privateUpload([
    ...tags.map((t) => ({ coll: 'tags', data: t } as const)),
    ...txs.map(
      (t) =>
        ({
          coll: 'transactions',
          data: t,
        } as const),
    ),
  ])
  return Promise.resolve()
}

export const removeFromFirebase = (
  txIds: string[],
  tagIds: string[],
): Thunk => (dispatch, getState, { logger }) => {
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

const setRepeatingTxsAsInactive = (inactive: Transaction[]) => {
  const txs = firebase.firestore().collection('transactions')
  chunk(inactive, MAX_WRITES_IN_BATCH).map((c) => {
    const batch = firebase.firestore().batch()
    c.forEach((tx) => {
      const ref = txs.doc(tx.id)
      batch.update(ref, { repeating: 'inactive' } as Partial<Transaction>)
    })

    batch.commit()
  })
}

export const addRepeatingTxs = (): Thunk => (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Add repeating transactions')

  const added: Transaction[] = []
  const inactive: Transaction[] = []
  const now = new Date()

  Object.values(getState().transactions).forEach((tx) => {
    const repeatTx = (stepFn: typeof addYears) => {
      let i = 1
      let lastActiveCreatedTx: Transaction | null = null

      while (true) {
        const newDate = stepFn(tx.dateTime, i)
        if (isBefore(newDate, now)) {
          const newTx: Transaction = {
            ...tx,
            id: uuid(),
            transactionType: 'repeated',
            dateTime: newDate,
          }

          added.push(newTx)
          if (lastActiveCreatedTx === null) {
            inactive.push(tx)
          } else {
            lastActiveCreatedTx.repeating = 'inactive'
          }
          lastActiveCreatedTx = newTx
          i++
        } else {
          break
        }
      }
    }

    switch (tx.repeating) {
      case 'inactive':
      case 'none':
        return
      case 'annually':
        repeatTx(addYears)
        return
      case 'monthly':
        repeatTx(addMonths)
        return
      case 'weekly':
        repeatTx(addWeeks)
      case 'daily':
        repeatTx(addDays)
        return
      default:
        throw new Error(`Unknown repeating mode ${tx.repeating}`)
    }
  })

  dispatch(uploadToFirebase(added, []))
  setRepeatingTxsAsInactive(inactive)
  return Promise.resolve()
}
