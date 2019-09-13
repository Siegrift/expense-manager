import { firestore } from 'firebase/app'

import { State } from '../state'

import { lastTenEntries } from './queryReducers'

export type QueryReducer = (
  state: State,
  payload: firestore.QuerySnapshot,
) => State

export interface Query {
  type: string
  firestoneQuery: firestore.Query
  reducer: QueryReducer
}

export const getQueries = (): Query[] => {
  return [
    {
      type: 'Last 10 messages',
      firestoneQuery: firestore()
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(12),
      reducer: lastTenEntries,
    },
  ]
}
