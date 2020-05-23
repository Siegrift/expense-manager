/// <reference types="cypress" />

// https://docs.cypress.io/guides/tooling/typescript-support.html#Types-for-custom-commands

// in cypress/support/index.d.ts
// load type definitions that come with Cypress module

declare namespace Cypress {
  interface Chainable {
    dataCy(value: string): Chainable<Element>
  }
}
