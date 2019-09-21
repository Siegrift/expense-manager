import { omit, set, update } from '@siegrift/tsfunct'
import { firestore } from 'firebase/app'

import { State } from '../state'

import { convertTimestampsToDates } from './util'

export type QueryReducer = (
  state: State,
  payload: firestore.QuerySnapshot,
) => State

export interface FirestoneQuery {
  type: string
  createFirestoneQuery: () => firestore.Query
  reducer: QueryReducer
}

const createQueryReducer = (
  stateProp: keyof Pick<State, 'messages' | 'transactions' | 'tags'>,
): QueryReducer => (state, payload) => {
  return update(state, [stateProp], (statePart) => {
    let newStatePart = statePart
    payload.docChanges().forEach((c) => {
      if (c.type === 'removed') {
        newStatePart = omit(newStatePart, [c.doc.id])
      } else if (c.type === 'added') {
        newStatePart = {
          ...newStatePart,
          [c.doc.id]: convertTimestampsToDates(c.doc.data()),
        }
      } else {
        newStatePart = set(
          newStatePart,
          [c.doc.id],
          convertTimestampsToDates(c.doc.data()),
        )
      }
    })
    return newStatePart
  }) as State
}

const lastTenMessages: FirestoneQuery = {
  type: 'Last 10 messages',
  createFirestoneQuery: () =>
    firestore()
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(12),
  reducer: createQueryReducer('messages'),
}

const allTransactionsQuery: FirestoneQuery = {
  type: 'All transactions query',
  createFirestoneQuery: () => firestore().collection('transactions'),
  reducer: createQueryReducer('transactions'),
}

const allTags: FirestoneQuery = {
  type: 'All tags query',
  createFirestoneQuery: () => firestore().collection('tags'),
  reducer: createQueryReducer('tags'),
}

export const getQueries = (): FirestoneQuery[] => {
  return [lastTenMessages, allTransactionsQuery, allTags]
}
