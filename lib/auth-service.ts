import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

// Types
export interface SignupData {
  email: string
  password: string
  fullName: string
  mentorId?: string
}

export interface LoginData {
  email: string
  password: string
}

// Signup function
export const signup = async (data: SignupData): Promise<User> => {
  try {
    // Create user with email and password
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)

    const user = userCredential.user

    // Update profile with full name
    await updateProfile(user, {
      displayName: data.fullName,
    })

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: data.email,
      fullName: data.fullName,
      mentorId: data.mentorId || generateMentorId(), // Generate if not provided
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role: "user",
      isActive: true,
    })

    return user
  } catch (error: any) {
    console.error("Error signing up:", error)
    throw new Error(error.message || "Failed to sign up")
  }
}

// Login function
export const login = async (data: LoginData): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, data.email, data.password)

    return userCredential.user
  } catch (error: any) {
    console.error("Error logging in:", error)
    throw new Error(error.message || "Failed to log in")
  }
}

// Logout function
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error("Error logging out:", error)
    throw new Error(error.message || "Failed to log out")
  }
}

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    console.error("Error resetting password:", error)
    throw new Error(error.message || "Failed to reset password")
  }
}

// Get current user data from Firestore
export const getCurrentUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error: any) {
    console.error("Error getting user data:", error)
    throw new Error(error.message || "Failed to get user data")
  }
}

// Helper function to generate a mentor ID
const generateMentorId = (): string => {
  const prefix = "QTP"
  const randomDigits = Math.floor(10000 + Math.random() * 90000) // 5-digit number
  return `${prefix}${randomDigits}`
}

