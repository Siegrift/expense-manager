import { set } from '@siegrift/tsfunct'
import { firestore } from 'firebase'
import debounce from 'lodash/debounce'

import { Action, Thunk } from '../redux/types'
import { SignInStatus } from '../state'

import { getQueries, FirestoneQuery } from './firestoneQueries'

export const firestoneChangeAction = (
  query: FirestoneQuery,
  payload: firestore.QuerySnapshot,
  isInitial: boolean = false,
): Action<firestore.QuerySnapshot> => ({
  type: `${isInitial ? 'Initial firestore' : 'Firestore'} query change: ${
    query.type
  }`,
  payload,
  reducer: (state) => query.reducer(state, payload),
})

const changeSignInStatus = (status: SignInStatus): Action<SignInStatus> => ({
  type: 'Change sign in status',
  payload: status,
  reducer: (state) => set(state, ['signInStatus'], status),
})

export const authChangeAction = (status: SignInStatus): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log(`Auth changed: ${status}`)
  if (status === 'loggedIn') {
    await dispatch(initializeFirestore())
  }
  dispatch(changeSignInStatus(status))
}

const FIRESTONE_STATE_UPDATE_DEBOUNCE_TIME = 500

export const initializeFirestore = (): Thunk => (dispatch) => {
  // TODO: solve how to dispatch state change to avoid inconsistencies
  // https://stackoverflow.com/questions/57982742/how-to-use-firebase-onsnapshot-and-maintain-consistency
  // For now just debounce the value for a short time and wait for initial data loading

  const initialQueries: Array<Promise<unknown>> = []
  getQueries().forEach((query) => {
    const q = query.createFirestoneQuery()
    initialQueries.push(
      q
        .get({
          source: 'cache',
        })
        .then((snapshot) =>
          dispatch(firestoneChangeAction(query, snapshot, true)),
        ),
    )
    q.onSnapshot((change) => {
      debounce(() => {
        dispatch(firestoneChangeAction(query, change))
      }, FIRESTONE_STATE_UPDATE_DEBOUNCE_TIME)()
    })
  })

  return Promise.all(initialQueries)
}
