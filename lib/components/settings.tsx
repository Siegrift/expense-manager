import * as firebase from 'firebase/app'

import Navigation from './navigation'

function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut()
}

const Settings = () => {
  return (
    <>
      <Navigation />
      settings
      <button onClick={signOut}>google sign out</button>
    </>
  )
}

export default Settings
