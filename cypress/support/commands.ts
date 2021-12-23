import { attachCustomCommands } from 'cypress-firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDnQSlVfpwJot94RtJoS0TRdadhD3bP2Io',
  authDomain: 'expense-manager---staging.firebaseapp.com',
  projectId: 'expense-manager---staging',
  storageBucket: 'expense-manager---staging.appspot.com',
  messagingSenderId: '238037046881',
  appId: '1:238037046881:web:3112342690c3da9829fc20',
}
firebase.initializeApp(firebaseConfig)

attachCustomCommands(
  { Cypress, cy, firebase },
  {
    commandNames: {
      login: 'cypressFirebaseLogin',
    },
  }
)

Cypress.Commands.add('login', () => {
  return cy.cypressFirebaseLogin(Cypress.env('testUid'))
})

Cypress.Commands.add('logCurrentFirebaseUser', (): any => {
  const user = firebase.auth().currentUser
  console.log('Current user', user)

  cy.log(JSON.stringify(user))
})

Cypress.Commands.add('dataCy', (value): any => {
  cy.get(`[data-cy=${value}]`)
})
