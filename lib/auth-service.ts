import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/firebase"
import type { User } from "firebase/auth"

// Update the SignupData interface
export interface SignupData {
  email: string
  password: string
  fullName: string
  displayName: string
  phone: string
}

// Update the signup function
export const signup = async (data: SignupData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
    const user = userCredential.user

    // Generate mentor ID
    const mentorId = Math.floor(1000 + Math.random() * 9000).toString()

    // Update profile
    await updateProfile(user, {
      displayName: data.displayName,
    })

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: data.email,
      fullName: data.fullName,
      displayName: data.displayName,
      phone: data.phone,
      mentorId,
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

