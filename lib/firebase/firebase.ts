// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app'
// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'
import debounce from 'lodash/debounce'
import { Store } from 'redux'

import { authChangeAction, firestoneChangeAction } from './actions'
import { getQueries } from './firestoneQueries'

const firebaseConfig = {
  apiKey: 'AIzaSyBSskq5HfVggNz65zJoJaieWxkBCzxqHcM',
  authDomain: 'expense-manager-pwa.firebaseapp.com',
  databaseURL: 'https://expense-manager-pwa.firebaseio.com',
  projectId: 'expense-manager-pwa',
  storageBucket: 'expense-manager-pwa.appspot.com',
  messagingSenderId: '163758023183',
  appId: '1:163758023183:web:522028afd5102881',
}

const FIRESTONE_STATE_UPDATE_DEBOUNCE_TIME = 500

export const initializeFirebase = async (store: Store) => {
  // firebase can be initialized only once, but crashes on hot update
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  // persistance only works in browsers
  if (typeof window !== 'undefined') {
    await firebase
      .firestore()
      .enablePersistence()
      .catch((err) => {
        // TODO: handle errors
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          console.log(err)
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          console.log(err)
        }
      })
  }

  // TODO: solve how to dispatch state change to avoid inconsistencies
  // https://stackoverflow.com/questions/57982742/how-to-use-firebase-onsnapshot-and-maintain-consistency
  // For now just debounce the value for a short time and wait for initial data loading
  const initialQueries: Array<Promise<unknown>> = []
  getQueries().forEach((query) => {
    const q = query.createFirestoneQuery()
    initialQueries.push(
      q
        .get()
        .then((snapshot) =>
          store.dispatch(firestoneChangeAction(query, snapshot, true)),
        ),
    )
    q.onSnapshot((change) => {
      debounce(() => {
        store.dispatch(firestoneChangeAction(query, change))
      }, FIRESTONE_STATE_UPDATE_DEBOUNCE_TIME)()
    })
  })
  await Promise.all(initialQueries)

  firebase.auth().onAuthStateChanged((user) => {
    store.dispatch(authChangeAction(user ? 'loggedIn' : 'loggedOut'))
  })
}
