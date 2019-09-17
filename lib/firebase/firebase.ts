// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app'
// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'
import { Store } from 'redux'

import { authChangeAction, firestoneChangeAction } from './actions'
import { getQueries } from './queries'

const firebaseConfig = {
  apiKey: 'AIzaSyBSskq5HfVggNz65zJoJaieWxkBCzxqHcM',
  authDomain: 'expense-manager-pwa.firebaseapp.com',
  databaseURL: 'https://expense-manager-pwa.firebaseio.com',
  projectId: 'expense-manager-pwa',
  storageBucket: 'expense-manager-pwa.appspot.com',
  messagingSenderId: '163758023183',
  appId: '1:163758023183:web:522028afd5102881',
}

export const initializeFirebase = (store: Store) => {
  // firebase can be initialized only once, but crashes on hot update
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  getQueries().forEach((query) => {
    query.firestoneQuery.onSnapshot((change) => {
      store.dispatch(firestoneChangeAction(query, change))
    })
  })

  firebase.auth().onAuthStateChanged((user) => {
    store.dispatch(authChangeAction(user ? 'loggedIn' : 'loggedOut'))
  })
}
