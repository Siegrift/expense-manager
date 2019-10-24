import { omit, set, update } from '@siegrift/tsfunct'

import { State } from '../state'

import firebase from './firebase'
import { convertTimestampsToDates } from './util'

export type QueryReducer = (
  state: State,
  payload: firebase.firestore.QuerySnapshot,
) => State

export interface FirestoneQuery {
  type: string
  createFirestoneQuery: () => firebase.firestore.Query
  reducer: QueryReducer
}

const createQueryReducer = (
  stateProp: keyof Pick<State, 'transactions' | 'tags'>,
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

const allTransactionsQuery: FirestoneQuery = {
  type: 'All transactions query',
  createFirestoneQuery: () => {
    const q = firebase.firestore().collection('transactions')
    console.log(q.path)
    return q
  },
  reducer: createQueryReducer('transactions'),
}

const allTags: FirestoneQuery = {
  type: 'All tags query',
  createFirestoneQuery: () => firebase.firestore().collection('tags'),
  reducer: createQueryReducer('tags'),
}

export const getQueries = (): FirestoneQuery[] => {
  return [allTransactionsQuery, allTags]
}
