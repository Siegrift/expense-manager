// https://docs.cypress.io/guides/tooling/typescript-support.html#Types-for-custom-commands

// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    dataCy(value: string): Chainable<Element>
  }
}
