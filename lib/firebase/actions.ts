import { set } from '@siegrift/tsfunct'
import { firestore, User } from 'firebase'

import { Action } from '../redux/types'

import { Query } from './queries'

export const firestoneChangeAction = (
  query: Query,
  payload: firestore.QuerySnapshot,
): Action<firestore.QuerySnapshot> => ({
  type: 'Firestore query change: ' + query.type,
  payload,
  reducer: (state) => query.reducer(state, payload),
})

export const authChangeAction = (user: User | null): Action<User | null> => ({
  type: 'Auth change',
  payload: user,
  reducer: (state) => set(state, ['isSigned'], !!user),
})
