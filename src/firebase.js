import { initializeApp } from 'firebase/app'
import { getDatabase }   from 'firebase/database'
import { getAuth }       from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBrSYX0BtzJYmwsLJxXUAPswv7fsCF9Lgk",
  authDomain: "wedding-inv-53462.firebaseapp.com",
  databaseURL: "https://wedding-inv-53462-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wedding-inv-53462",
  storageBucket: "wedding-inv-53462.firebasestorage.app",
  messagingSenderId: "717696596163",
  appId: "1:717696596163:web:7318f9201469acc65cca76"
}

const app = initializeApp(firebaseConfig)
export const db   = getDatabase(app)
export const auth = getAuth(app)