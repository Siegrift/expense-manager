// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

import { join } from 'path'

import { plugin as cypressFirebasePlugin } from 'cypress-firebase'
import dotenv from 'dotenv'
import admin from 'firebase-admin'

module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  on('task', {
    // Configuration needs to be loaded inside "plugins" otherwise __dirname doesn't work properly
    parseConfiguration() {
      const path = join(__dirname, '../../.env-dev')
      const result = dotenv.config({
        path,
      })

      if (result.error) {
        throw new Error(`Unable to parse config file on path: ${path}`)
      }

      return result.parsed!
    },
  })

  cypressFirebasePlugin(on, config, admin)
}
