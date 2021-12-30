/* eslint-disable @typescript-eslint/no-unused-vars */

// this file cannot contain any imports/exports and is automatically picked up by TS.
// https://github.com/cypress-io/cypress/issues/1065#issuecomment-351769720
//
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    dataCy(value: string): Chainable<Element>
    firebaseLogin(): Chainable<void>
    logCurrentFirebaseUser(): Chainable<void>
  }
}
