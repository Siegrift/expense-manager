import { omit, set, update } from '@siegrift/tsfunct'

import { State } from '../state'

import { getFirebase } from './firebase'
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
  stateProp: keyof Pick<State, 'transactions' | 'tags' | 'profile'>,
): QueryReducer => (state, payload) => {
  return update(state, [stateProp], (statePart) => {
    let newStatePart = statePart
    payload.docChanges().forEach((c) => {
      if (c.type === 'removed') {
        newStatePart = omit(newStatePart, [c.doc.id as any])
      } else if (c.type === 'added') {
        newStatePart = {
          ...newStatePart,
          [c.doc.id]: convertTimestampsToDates(c.doc.data()),
        }
      } else {
        newStatePart = set(
          newStatePart,
          [c.doc.id as any],
          convertTimestampsToDates(c.doc.data()),
        )
      }
    })
    return newStatePart as any
  })
}

const allTransactionsQuery: FirestoneQuery = {
  type: 'All transactions query',
  createFirestoneQuery: () => {
    const q = getFirebase()
      .firestore()
      .collection('transactions')
      .where('uid', '==', getFirebase().auth().currentUser!.uid)
    return q
  },
  reducer: createQueryReducer('transactions'),
}

const allTags: FirestoneQuery = {
  type: 'All tags query',
  createFirestoneQuery: () =>
    getFirebase()
      .firestore()
      .collection('tags')
      .where('uid', '==', getFirebase().auth().currentUser!.uid),
  reducer: createQueryReducer('tags'),
}

const profile: FirestoneQuery = {
  type: 'Profile query',
  createFirestoneQuery: () =>
    getFirebase()
      .firestore()
      .collection('profile')
      .where('uid', '==', getFirebase().auth().currentUser!.uid),
  reducer: createQueryReducer('profile'),
}

export const getQueries = (): FirestoneQuery[] => {
  return [allTransactionsQuery, allTags, profile]
}
