import { IncomingMessage, ServerResponse } from 'http'
import * as admin from 'firebase-admin'

export const verifyIdToken = (token: string) => {
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!firebasePrivateKey)
    throw Error('No firebase private key! Check your .env vars')

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // https://stackoverflow.com/a/41044630/1332513
        privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      throw error
    })
}

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(301, { Location: path })
  res.end()
}

export const getSignInToken = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // If server-side, get AuthUserInfo from the session in the request.
  // Don't include server middleware in the client JS bundle. See:
  // https://arunoda.me/blog/ssr-and-server-only-modules
  const { addSession } = require('./middleware')
  addSession(req, res)

  try {
    // we are ussing cookie session middleware
    return await verifyIdToken((req as any).session.token)
  } catch (e) {
    console.log(e)
    return null
  }
}

export const redirectToLoginIfNotSignedIn = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const token = await getSignInToken(req, res)
  if (token === null) {
    redirect(res, '/login')
    return null
  }

  return token
}
