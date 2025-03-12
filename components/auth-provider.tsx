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
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import ClientOnly from "./client-only"

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: any) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
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
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      <ClientOnly>{children}</ClientOnly>
    </AuthContext.Provider>
  )
}

