"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { generateMentorId } from "@/lib/utils"
import type { User } from "@/lib/types"

// Define the auth context type
type AuthContextType = {
  user: User | null
  firebaseUser: FirebaseUser | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (
    userData: Omit<User, "id" | "mentorId"> & { password: string },
  ) => Promise<{ success: boolean; error: string | null }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setFirebaseUser(authUser)

      if (authUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", authUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            setUser({
              id: authUser.uid,
              email: authUser.email || "",
              name: userData.name || "",
              displayName: userData.displayName || "",
              phone: userData.phone || "",
              mentorId: userData.mentorId,
              avatar: userData.avatar,
            })
          } else {
            // If user document doesn't exist in Firestore yet
            setUser({
              id: authUser.uid,
              email: authUser.email || "",
              name: authUser.displayName || "",
              displayName: authUser.displayName || "",
              phone: "",
              mentorId: generateMentorId(),
              avatar: "",
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // User is automatically set by the auth state listener
      setIsLoading(false)
      router.push("/dashboard")
      return true
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (userData: Omit<User, "id" | "mentorId"> & { password: string }) => {
    setIsLoading(true)
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const firebaseUser = userCredential.user

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: userData.displayName,
      })

      // Generate mentor ID
      const mentorId = generateMentorId()

      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        id: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        displayName: userData.displayName,
        phone: userData.phone || "",
        mentorId: mentorId,
        avatar: userData.avatar || "",
        createdAt: serverTimestamp(),
      })

      // User is automatically set by the auth state listener
      setIsLoading(false)
      router.push("/login")

      return { success: true, error: null }
    } catch (error: any) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return { success: false, error: error.message || "Registration failed" }
    }
  }

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!firebaseUser || !user) return false

    try {
      // Update display name in Firebase Auth if provided
      if (userData.displayName) {
        await updateProfile(firebaseUser, {
          displayName: userData.displayName,
        })
      }

      // Update user document in Firestore
      const userRef = doc(db, "users", firebaseUser.uid)
      await setDoc(
        userRef,
        {
          ...userData,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      // Update local state
      setUser({ ...user, ...userData })

      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null)
        router.push("/")
      })
      .catch((error) => {
        console.error("Logout error:", error)
      })
  }

  // Handle server-side rendering and client-side hydration
  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        firebaseUser: mounted ? firebaseUser : null,
        login,
        signup,
        logout,
        updateProfile: updateUserProfile,
        isLoading: !mounted || isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

