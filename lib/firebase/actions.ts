import { fpSet, pipe, set } from '@siegrift/tsfunct'
import { addDays, isBefore, parse } from 'date-fns'
import { batch } from 'react-redux'

import { addRepeatingTxs } from '../actions'
import { getFirebase } from '../firebase/firebase'
import { uploadBackup } from '../profile/backupActions'
import {
  listFirestoreFilesForUser,
  BACKUP_FILENAME_FORMAT,
  AUTO_BACKUP_PERIOD_DAYS,
  createFirestoreFilename,
} from '../profile/backupCommons'
import { getInitialState as getInitialProfileState } from '../profile/state'
import { Action, Thunk } from '../redux/types'
import { withErrorHandler } from '../shared/actions'
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
): Thunk => async (dispatch, _getState, { logger }) => {
  logger.log(`Auth changed: ${status}`)

  if (status === 'loggedIn') {
    dispatch(applyInitialState(user!))
    await dispatch(initializeFirestore(user!))
  }
  // this must be last, used to indicate when firestore has finished loading
  dispatch(changeSignInStatus(status, user))
}

/**
 * Applies initial such that this state exists even when the app is opened
 * for the first time.
 */
const applyInitialState = (user: firebase.User): Action => ({
  type: 'Apply initial state',
  reducer: (state) => {
    const profileState = getInitialProfileState(user)
    return set(state, ['profile', profileState.id], profileState)
  },
})

export const initializeFirestore = (user: firebase.User): Thunk => async (
  dispatch,
) => {
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
  withErrorHandler(
    'Unexpected error. Failed to add repeating transactions.',
    dispatch,
    async () => {
      if (navigator.onLine) {
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
      }
    },
  )

  // try to backup data
  try {
    const data = await listFirestoreFilesForUser(user.uid)

    // if there is any error, just throw. We want to show the same error.
    if (!data || typeof data === 'string') {
      throw new Error('Loading firestore files failed')
    }

    if (!data[0]) {
      await dispatch(uploadBackup(createFirestoreFilename(), user.uid))
    } else {
      const now = new Date()
      const latest = parse(data[0], BACKUP_FILENAME_FORMAT, now)
      if (isBefore(addDays(latest, AUTO_BACKUP_PERIOD_DAYS), now)) {
        await dispatch(uploadBackup(createFirestoreFilename(), user.uid))
      }
    }
  } catch {}

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
