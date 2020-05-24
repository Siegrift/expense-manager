import Router from 'next/router'
import { Store } from 'redux'

import { authChangeAction } from './actions'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

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

  firebase.auth().onAuthStateChanged(async (user) => {
    store.dispatch(authChangeAction(user ? 'loggedIn' : 'loggedOut') as any)
    if (user) {
      user.getIdToken().then(async (token) => {
        await fetch('/api/set-cookie', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ token }),
        })

        if (Router.pathname === '/login') Router.push('/add')
      })
    } else {
      await fetch('/api/remove-cookie', {
        method: 'POST',
        credentials: 'same-origin',
      })

      Router.push('/login')
    }
  })
}

export const getFirebase = () => {
  if (firebaseInstance == null) {
    throw new Error('Firebase has not been initialized yet')
  }
  return firebaseInstance
}
