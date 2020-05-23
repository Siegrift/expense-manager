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

attachCustomCommands({ Cypress, cy, firebase })
