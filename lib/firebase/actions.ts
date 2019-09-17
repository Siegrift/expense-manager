import { set } from '@siegrift/tsfunct'
import { firestore } from 'firebase'

import { Action } from '../redux/types'
import { SignInStatus } from '../state'

import { FirestoneQuery } from './firestoneQueries'

export const firestoneChangeAction = (
  query: FirestoneQuery,
  payload: firestore.QuerySnapshot,
): Action<firestore.QuerySnapshot> => ({
  type: 'Firestore query change: ' + query.type,
  payload,
  reducer: (state) => query.reducer(state, payload),
})

export const authChangeAction = (
  status: SignInStatus,
): Action<SignInStatus> => ({
  type: 'Auth change',
  payload: status,
  reducer: (state) => set(state, ['signInStatus'], status),
})
