/// <reference types="cypress" />

// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import firebase from 'firebase/app'

Cypress.Commands.add('dataCy', (value) => {
  cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('currentUser', (value) => {
  console.log('xxx', firebase.auth().currentUser)
})
