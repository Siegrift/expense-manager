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
