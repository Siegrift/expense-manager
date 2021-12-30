// By default using NODE_ENV is enough, but there is an option to overwrite it using ENVIRONMENT
// NOTE: The ENVIRONMENT only impacts which credentials are loaded and not how applications works.
const getEnvironment = () => process.env.ENVIRONMENT || process.env.NODE_ENV

const parseEnvironmentVariablesAndGetError = () => {
  switch (getEnvironment()) {
    case 'development':
      return parseCredentials('.env-dev').error
    // For production env variables see: https://vercel.com/siegrift/expense-manager-pwa/settings/general
    // They will already be available as env variables by Vercel.
    case 'production':
      return null
    default:
      return new Error(`The environment variable is invalid. It has value: ${ENVIRONMENT}`)
  }
}

const parseCredentials = (path) =>
  require('dotenv').config({
    path,
  })

console.info(`Environment: ${getEnvironment()}`)
let error = parseEnvironmentVariablesAndGetError()
if (error) {
  throw new Error(`Unable to parse credentials. Reason: ${error.message}`)
}
