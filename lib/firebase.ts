import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// Import getAnalytics but don't use it immediately
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE54BfEl0Qx7jqDnXeFPwy0nrDabAmi7U",
  authDomain: "quicktradepro-fbed4.firebaseapp.com",
  projectId: "quicktradepro-fbed4",
  storageBucket: "quicktradepro-fbed4.firebasestorage.app",
  messagingSenderId: "443810193511",
  appId: "1:443810193511:web:85c860d4b61ecd64cff4c2",
  measurementId: "G-EF3W2RMNRQ"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Create a function to initialize analytics only on client side
const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    try {
      return getAnalytics(app);
    } catch (error) {
      console.error("Analytics failed to initialize:", error);
      return null;
    }

