/// <reference types="cypress" />

import { createTransactions } from './common'

describe('Transaction list', () => {
  it('shows edit transaction tooltip', () => {
    cy.login()
    createTransactions()

    cy.visit('/transactions')
    cy.dataCy('edit-icon').trigger('mouseover')
    cy.contains('(E)dit transaction')
  })
})
