/// <reference types="cypress" />

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
// @ts-ignore
import { attachCustomCommands } from 'cypress-firebase'

const fbConfig = {
  apiKey: 'AIzaSyAFgtVKyy1iSHdE_44ijLyCQYW_KLEjbS0',
  authDomain: 'expense-manager-dev-59ddb.firebaseapp.com',
  databaseURL: 'https://expense-manager-dev-59ddb.firebaseio.com',
  projectId: 'expense-manager-dev-59ddb',
  storageBucket: 'expense-manager-dev-59ddb.appspot.com',
  messagingSenderId: '1006392817344',
  appId: '1:1006392817344:web:80409f3801b21248e2df25',
}
firebase.initializeApp(fbConfig)

attachCustomCommands(
  { Cypress, cy, firebase },
  {
    commandNames: {
      login: 'cypressFirebaseLogin',
    },
  },
)

// We can't use fixed cookies, because firebase token is quickly invalidated and you need to
// refresh it. That's why we use firebase admin to sign in with existing user and then use
// firebase to generate a fresh token. We then save this cookie by calling /api/set-cookie.
//
// https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
Cypress.Commands.add('login', () => {
  return cy
    .cypressFirebaseLogin(Cypress.env('testUid'))
    .then(() => firebase.auth().currentUser!.getIdToken(true))
    .then((token) => {
      return fetch('/api/set-cookie', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ token }),
      })
    })
})
