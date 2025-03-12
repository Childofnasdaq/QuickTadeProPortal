"use client"

import type React from "react"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateUserProfile,
  type User,
} from "firebase/auth"
import { doc, setDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

interface UserData {
  mentorId: string
  fullName: string
  displayName: string
  email: string
  phone?: string
  role: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: any) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
  login: async () => false,
  signup: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Subscribe to user document in Firestore
        const userDocRef = doc(db, "users", user.uid)
        const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data() as UserData)
          }
        })

        return () => unsubscribeDoc()
      } else {
        setUserData(null)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Signup function
  const signup = async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      // Generate mentor ID
      const mentorId = Math.floor(1000 + Math.random() * 9000).toString()

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const newUser = userCredential.user

      // Update profile
      await updateUserProfile(newUser, {
        displayName: data.displayName || data.name,
      })

      // Create user document in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: data.email,
        fullName: data.name,
        displayName: data.displayName,
        phone: data.phone || "",
        mentorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: "user",
        isActive: true,
      })

      return { success: true }
    } catch (error: any) {
      console.error("Signup error:", error)
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Update profile function
  const updateProfile = async (data: any): Promise<boolean> => {
    if (!user) return false

    try {
      // Update Firestore document
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })

      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

