import { Store } from 'redux'

import { authChangeAction } from './actions'

const firebaseDevConfig = {
  apiKey: 'AIzaSyAFgtVKyy1iSHdE_44ijLyCQYW_KLEjbS0',
  authDomain: 'expense-manager-dev-59ddb.firebaseapp.com',
  databaseURL: 'https://expense-manager-dev-59ddb.firebaseio.com',
  projectId: 'expense-manager-dev-59ddb',
  storageBucket: 'expense-manager-dev-59ddb.appspot.com',
  messagingSenderId: '1006392817344',
  appId: '1:1006392817344:web:80409f3801b21248e2df25',
}

const firebaseProdConfig = {
  apiKey: 'AIzaSyBSskq5HfVggNz65zJoJaieWxkBCzxqHcM',
  authDomain: 'expense-manager-pwa.firebaseapp.com',
  databaseURL: 'https://expense-manager-pwa.firebaseio.com',
  projectId: 'expense-manager-pwa',
  storageBucket: 'expense-manager-pwa.appspot.com',
  messagingSenderId: '163758023183',
  appId: '1:163758023183:web:522028afd5102881',
}

const firebaseConfig =
  process.env.NODE_ENV === 'development'
    ? firebaseDevConfig
    : firebaseProdConfig

let firebaseInstance: typeof import('firebase/app') | null = null

export const initializeFirebase = async (store: Store) => {
  if (firebaseInstance) {
    throw new Error('Firebase instance already initialized!')
  }

  // Firebase App (the core Firebase SDK) is always required and must be listed first
  const firebase = await import('firebase/app')
  // NOTE: Import all Firebase products that the project uses
  await import('firebase/auth')
  await import('firebase/firestore')
  await import('firebase/performance')

  firebaseInstance = firebase

  // firebase can be initialized only once, but crashes on hot update
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  // enable firebase performance
  firebase.performance()

  // persistance only works in browsers
  if (typeof window !== 'undefined') {
    await firebase
      .firestore()
      .enablePersistence({ synchronizeTabs: true })
      .catch((err) => {
        // TODO: handle errors
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          console.error(err)
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.error(err)
        }
      })
  }

  firebase.auth().onAuthStateChanged((user) => {
    store.dispatch(authChangeAction(user ? 'loggedIn' : 'loggedOut') as any)
  })
}

export const getFirebase = () => {
  if (firebaseInstance == null) {
    throw new Error('Firebase has not been initialized yet')
  }
  return firebaseInstance
}
