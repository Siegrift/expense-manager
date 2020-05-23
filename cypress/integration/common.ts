/// <reference types="cypress" />

export const login = () => {
  cy.setCookie('express:sess.sig', Cypress.env('sessionSig'))
  cy.setCookie('express:sess', Cypress.env('session'))
}
