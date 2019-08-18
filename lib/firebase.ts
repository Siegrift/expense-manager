// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBSskq5HfVggNz65zJoJaieWxkBCzxqHcM',
  authDomain: 'expense-manager-pwa.firebaseapp.com',
  databaseURL: 'https://expense-manager-pwa.firebaseio.com',
  projectId: 'expense-manager-pwa',
  storageBucket: 'expense-manager-pwa.appspot.com',
  messagingSenderId: '163758023183',
  appId: '1:163758023183:web:522028afd5102881',
}

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}
