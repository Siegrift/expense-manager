import { set } from '@siegrift/tsfunct'

import firebase from '../firebase/firebase'
import { Action, Thunk } from '../redux/types'
import { SignInStatus } from '../state'

import { getQueries, FirestoneQuery } from './firestoneQueries'

export const firestoneChangeAction = (
  query: FirestoneQuery,
  payload: firebase.firestore.QuerySnapshot,
  isInitial: boolean = false,
): Action<firebase.firestore.QuerySnapshot> => ({
  type: `${isInitial ? 'Initial firestore' : 'Firestore'} query change: ${
    query.type
  }`,
  payload,
  reducer: (state) => {
    return query.reducer(state, payload)
  },
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

export const initializeFirestore = (): Thunk => async (dispatch) => {
  let actions: Array<Parameters<typeof firestoneChangeAction>> = []
  firebase.firestore().onSnapshotsInSync(() => {
    actions.forEach((a) => dispatch(firestoneChangeAction(a[0], a[1])))
    actions = []
  })

  const initialQueries: Array<Promise<unknown>> = getQueries().map((query) => {
    return query
      .createFirestoneQuery()
      .get({
        source: 'cache',
      })
      .then((snapshot) => dispatch(firestoneChangeAction(query, snapshot, true)))
  })

  await Promise.all(initialQueries)
  getQueries().forEach((q) => {
    q.createFirestoneQuery().onSnapshot((change) => {
      actions.push([q, change])
    })
  })
}
