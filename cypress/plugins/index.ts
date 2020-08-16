// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const admin = require('firebase-admin')
const cypressFirebasePlugin = require('cypress-firebase').plugin

module.exports = (on, config) => {
  return cypressFirebasePlugin(on, config, admin)
}
