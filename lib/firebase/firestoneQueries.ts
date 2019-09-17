import { omit, set, update } from '@siegrift/tsfunct'
import { firestore } from 'firebase/app'

import { Tag, Transaction } from '../addTransaction/state'
import { State } from '../state'

export type QueryReducer = (
  state: State,
  payload: firestore.QuerySnapshot,
) => State

export interface FirestoneQuery {
  type: string
  createFirestoneQuery: () => firestore.Query
  reducer: QueryReducer
}

const lastTenMessages: FirestoneQuery = {
  type: 'Last 10 messages',
  createFirestoneQuery: () =>
    firestore()
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(12),
  reducer: (state, payload) => {
    return update(state, ['messages'], (msgs) => {
      let newMess = msgs
      payload.docChanges().forEach((c) => {
        if (c.type === 'removed') {
          newMess = omit(newMess, [c.doc.id])
        } else if (c.type === 'added') {
          newMess = { ...newMess, [c.doc.id]: c.doc.data() }
        } else {
          newMess = update(newMess, [c.doc.id], () => c.doc.data())
        }
      })
      return newMess
    })
  },
}

const allTransactionsQuery: FirestoneQuery = {
  type: 'All transactions query',
  createFirestoneQuery: () => firestore().collection('transactions'),
  reducer: (state, payload) => {
    return update(state, ['transactions'], (txs) => {
      let newTxs = txs
      payload.docChanges().forEach((c) => {
        if (c.type === 'removed') {
          newTxs = omit(newTxs, [c.doc.id])
        } else if (c.type === 'added') {
          newTxs = { ...newTxs, [c.doc.id]: c.doc.data() as Transaction }
        } else {
          newTxs = set(newTxs, [c.doc.id], c.doc.data() as Transaction)
        }
      })
      return newTxs
    })
  },
}

const allTags: FirestoneQuery = {
  type: 'All tags query',
  createFirestoneQuery: () => firestore().collection('tags'),
  reducer: (state, payload) => {
    return update(state, ['availableTags'], (tags) => {
      let newTags = tags
      payload.docChanges().forEach((c) => {
        if (c.type === 'removed') {
          newTags = omit(newTags, [c.doc.id])
        } else if (c.type === 'added') {
          newTags = { ...newTags, [c.doc.id]: c.doc.data() as Tag }
        } else {
          newTags = set(newTags, [c.doc.id], c.doc.data() as Tag)
        }
      })
      return newTags
    })
  },
}

export const getQueries = (): FirestoneQuery[] => {
  return [lastTenMessages, allTransactionsQuery, allTags]
}
