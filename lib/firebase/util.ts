import * as firebase from 'firebase/app'

export function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

export function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut()
}

export const convertTimestampsToDates = (value: any): any => {
  if (value instanceof firebase.firestore.Timestamp) {
    return value.toDate()
  } else if (Array.isArray(value)) {
    return value.map((v) => convertTimestampsToDates(v))
  } else if (typeof value === 'object') {
    return Object.keys(value).reduce(
      (acc, key) => ({ ...acc, [key]: convertTimestampsToDates(value[key]) }),
      {},
    )
  } else {
    return value
  }
}
