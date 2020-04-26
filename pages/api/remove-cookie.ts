import { applyMiddleware } from '../../lib/server/middleware'

const removeCookiesHandler = (req, res) => {
  // Destroy the session.
  // https://github.com/expressjs/cookie-session#destroying-a-session
  req.session = null
  res.status(200).json({ status: true })
}

export default applyMiddleware(removeCookiesHandler)
