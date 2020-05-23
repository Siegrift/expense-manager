import { getFirebase } from '../firebase/firebase'

export async function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  const firebase = getFirebase()
  const provider = new firebase.auth.GoogleAuthProvider()
  await firebase.auth().signInWithPopup(provider)
}

export const convertTimestampsToDates = (value: any): any => {
  if (value instanceof getFirebase().firestore.Timestamp) {
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

export const getCurrentUserId = () => getFirebase().auth().currentUser!.uid
