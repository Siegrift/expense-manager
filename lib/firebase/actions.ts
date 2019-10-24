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
    console.log('initialized')
  }
  dispatch(changeSignInStatus(status))
}

export const initializeFirestore = (): Thunk => (dispatch) => {
  const initialQueries: Array<Promise<unknown>> = []
  let actions: Array<Parameters<typeof firestoneChangeAction>> = []

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
    firebase.firestore().onSnapshotsInSync(() => {
      actions.forEach((a) => dispatch(firestoneChangeAction(a[0], a[1])))
      actions = []
    })
    q.onSnapshot((change) => {
      actions.push([query, change])
    })
  })

  return Promise.all(initialQueries)
}
