import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.AIzaSyDE54BfEl0Qx7jqDnXeFPwy0nrDabAmi7U,
  authDomain: process.env.quicktradepro-fbed4.firebaseapp.com,
  projectId: process.env.quicktradepro-fbed4,
  storageBucket: process.env.quicktradepro-fbed4.firebasestorage.app,
  messagingSenderId: process.env.443810193511,
  appId: process.env.1:443810193511:web:85c860d4b61ecd64cff4c2,
  measurementId: process.env.G-EF3W2RMNRQ,
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }

