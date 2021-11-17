// Firebase App (the core Firebase SDK) is always required and must be listed before other firebase imports
import firebase from 'firebase/app'
import { Store } from 'redux'
// NOTE: Import all Firebase products that the project uses
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import { createErrorNotification, setSnackbarNotification } from '../shared/actions'

import { authChangeAction } from './actions'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

export const initializeFirebase = async (store: Store) => {
  // firebase can be initialized only once, so this crashes on hot-reload update
  const shouldInitialize = !firebase.apps.length
  if (shouldInitialize) firebase.initializeApp(firebaseConfig)

  let persistedUser = firebase.auth().currentUser
  if (persistedUser) {
    store.dispatch(authChangeAction(persistedUser ? 'loggedIn' : 'loggedOut', persistedUser) as any)
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (persistedUser) persistedUser = null
    else {
      store.dispatch(authChangeAction(user ? 'loggedIn' : 'loggedOut', user) as any)
    }
  })

  // persistance only works in browsers
  if (shouldInitialize && typeof window !== 'undefined') {
    await firebase
      .firestore()
      .enablePersistence({ synchronizeTabs: true })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          store.dispatch(
            setSnackbarNotification(
              createErrorNotification('Expense manager is opened on mutliple tabs. Local persistance is disabled!')
            )
          )
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          store.dispatch(
            setSnackbarNotification(
              createErrorNotification('Underlying platform (browser) does not support persistance')
            )
          )
        }
      })
  }
}

export const getFirebase = () => {
  return firebase
}

export const getStorageRef = (...path: string[]) => {
  let ref = getFirebase().storage().ref()
  path.forEach((p) => {
    ref = ref.child(p)
  })

  return ref
}
