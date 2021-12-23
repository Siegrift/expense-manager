const parseEnvironmentVariablesOrGetError = () => {
  switch (process.env.ENVIRONMENT) {
    case 'development':
      return parseCredentials('.env-dev').error
    case 'staging':
      return parseCredentials('.env-staging').error
    // For production env variables see: https://vercel.com/siegrift/expense-manager-pwa/settings/general
    // They will already be available as env variables by Vercel.
    case 'production':
      return null
    default:
      return new Error('The ENVIRONMENT variable is invalid.')
  }
}

const parseCredentials = (path) =>
  require('dotenv').config({
    path,
  })

console.info(`Environment: ${process.env.ENVIRONMENT}`)
let error = parseEnvironmentVariablesOrGetError()
if (error) {
  throw new Error(`Unable to parse credentials. Reason: ${error.message}`)
}
