import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE54BfEl0Qx7jqDnXeFPwy0nrDabAmi7U",
  authDomain: "quicktradepro-fbed4.firebaseapp.com",
  projectId: "quicktradepro-fbed4",
  storageBucket: "quicktradepro-fbed4.firebasestorage.app",
  messagingSenderId: "443810193511",
  appId: "1:443810193511:web:85c860d4b61ecd64cff4c2",
  measurementId: "G-EF3W2RMNRQ",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

// Initialize Analytics (only on client side)
let analytics = null
if (typeof window !== "undefined") {
  // We're on the client side
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.error("Analytics failed to initialize:", error)
  }
}

export { app, auth, db, analytics }

