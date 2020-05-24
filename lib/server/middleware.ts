import '../../load-env'
import cookieSession from 'cookie-session'
import compose from 'lodash/fp/compose'

// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
// https://github.com/expressjs/cookie-session#extending-the-session-expiration
const cookieSessionRefreshHandler = (next: any) => (req: any, res: any) => {
  if (req.session) {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  }
  next(req, res)
}

export const addSession = (req: any, res: any) => {
  const sessionSecrets = [
    process.env.SESSION_SECRET_CURRENT!,
    process.env.SESSION_SECRET_PREVIOUS!,
  ]

  const includeSession = cookieSession({
    // https://github.com/expressjs/cookie-session#cookie-options
    keys: sessionSecrets,
    maxAge: 365 * 24 * 60 * 60 * 1000, // year
    httpOnly: true,
    overwrite: true,
  })
  includeSession(req, res, () => null)
}

export const cookieSessionHandler = (next: any) => (req: any, res: any) => {
  addSession(req, res)
  return next(req, res)
}

export const applyMiddleware = (handler: any) =>
  compose(cookieSessionHandler, cookieSessionRefreshHandler)(handler)
