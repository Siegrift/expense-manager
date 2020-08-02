import { fpSet, pipe } from '@siegrift/tsfunct'
import { batch } from 'react-redux'

import { addRepeatingTxs } from '../actions'
import { getFirebase } from '../firebase/firebase'
import { Action, Thunk } from '../redux/types'
import { setAppError } from '../shared/actions'
import { SignInStatus, State } from '../state'

import { FirestoneQuery, getQueries } from './firestoneQueries'

export const firestoneChangeAction = (
  query: FirestoneQuery,
  payload: firebase.firestore.QuerySnapshot,
  isInitial = false,
): Action<firebase.firestore.QuerySnapshot> => ({
  type: `${isInitial ? 'Initial firestore' : 'Firestore'} query change: ${
    query.type
  }`,
  payload,
  reducer: (state) => {
    return query.reducer(state, payload)
  },
})

const changeSignInStatus = (
  status: SignInStatus,
  user: firebase.User | null,
): Action<SignInStatus> => ({
  type: 'Change sign in status and set user',
  payload: status,
  reducer: (state) =>
    pipe(
      fpSet<State>()(['signInStatus'], status),
      fpSet<State>()(['user'], user),
    )(state),
})

export const authChangeAction = (
  status: SignInStatus,
  user: firebase.User | null,
): Thunk => async (dispatch, getState, { logger }) => {
  logger.log(`Auth changed: ${status}`)

  dispatch(changeSignInStatus(status, user))
  if (status === 'loggedIn') {
    await dispatch(initializeFirestore())
  }
}

export const initializeFirestore = (): Thunk => async (dispatch) => {
  const queries = getQueries()
  const initialQueries = queries.map((query) => {
    return query.createFirestoneQuery().get({
      source: 'cache',
    })
  })

  // load data from cache
  const initialQueriesData = await Promise.all(initialQueries)
  batch(() => {
    initialQueriesData.forEach((data, i) =>
      dispatch(firestoneChangeAction(queries[i], data, true)),
    )
  })

  // try to add repeating transactions
  try {
    const freshQueriesData = await Promise.all(
      queries.map((query) => {
        return query.createFirestoneQuery().get({
          source: 'server',
        })
      }),
    )
    batch(() => {
      freshQueriesData.forEach((data, i) =>
        dispatch(firestoneChangeAction(queries[i], data)),
      )
      dispatch(addRepeatingTxs())
    })
  } catch (error) {
    dispatch(
      setAppError('Unexpected error. Failed to add repeating transactions.'),
    )
  }

  let actions: Array<Parameters<typeof firestoneChangeAction>> = []
  getFirebase()
    .firestore()
    .onSnapshotsInSync(() => {
      // https://react-redux.js.org/api/batch
      // treat the redux updates as one atomic operation and forbid rendering between the updates
      // (which can render transaction with tag that hasn't been loaded yet)
      batch(() => {
        actions.forEach((a) => dispatch(firestoneChangeAction(a[0], a[1])))
        actions = []
      })
    })

  queries.forEach((q) => {
    q.createFirestoneQuery().onSnapshot((change) => {
      actions.push([q, change])
    })
  })
}
