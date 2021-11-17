const { NODE_ENV } = process.env
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.')
}

// for production env variables see: https://vercel.com/siegrift/expense-manager-pwa/settings/general
if (NODE_ENV === 'development') {
  const { error } = require('dotenv').config({
    path: '.env-dev',
  })

  if (error) {
    throw Error('Dotenv configuration was NOT parsed correctly! Error: ' + error.message)
  }
}
