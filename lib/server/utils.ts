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

export const redirectToLoginIfNotSignedIn = (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.headers.cookie) {
    redirect(res, '/login')
    return false
  }

  return true
}
