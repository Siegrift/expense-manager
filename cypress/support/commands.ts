import { attachCustomCommands } from 'cypress-firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAFgtVKyy1iSHdE_44ijLyCQYW_KLEjbS0',
  authDomain: 'expense-manager-dev-59ddb.firebaseapp.com',
  projectId: 'expense-manager-dev-59ddb',
  storageBucket: 'expense-manager-dev-59ddb.appspot.com',
  messagingSenderId: '1006392817344',
  appId: '1:1006392817344:web:80409f3801b21248e2df25',
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
