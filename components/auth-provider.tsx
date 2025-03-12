"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { generateMentorId } from "@/lib/utils"
import type { User } from "@/lib/types"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signup: (
    userData: Omit<User, "id" | "mentorId" | "approved" | "isAdmin"> & { password: string },
  ) => Promise<{ success: boolean; error: string | null }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Use localStorage as a fallback when Firestore permissions are denied
const saveUserToLocalStorage = (user: User) => {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const existingUserIndex = users.findIndex((u: any) => u.id === user.id)

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user
    } else {
      users.push(user)
    }

    localStorage.setItem("users", JSON.stringify(users))
    return true
  } catch (error) {
    console.error("Error saving user to localStorage:", error)
    return false
  }
}

const getUserFromLocalStorage = (userId: string) => {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.find((u: any) => u.id === userId) || null
  } catch (error) {
    console.error("Error getting user from localStorage:", error)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Set persistence to LOCAL (persists even when browser is closed)
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
      } catch (error) {
        console.error("Error setting persistence:", error)
      }
    }

    setupPersistence()
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Try to get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            setUser(userData)

            // Also save to localStorage for cross-browser consistency
            saveUserToLocalStorage(userData)
          } else {
            // If not in Firestore, try localStorage
            const localUser = getUserFromLocalStorage(firebaseUser.uid)

            if (localUser) {
              setUser(localUser)

              // Try to save to Firestore for cross-browser consistency
              try {
                await setDoc(doc(db, "users", firebaseUser.uid), localUser)
              } catch (error) {
                console.error("Error saving local user to Firestore:", error)
              }
            } else {
              // If user exists in Firebase Auth but not in Firestore or localStorage
              // Create a basic user record
              const newUser: User = {
                id: firebaseUser.uid,
                mentorId: generateMentorId(),
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
                phone: "",
                approved: true,
                isAdmin: false,
                createdAt: new Date(),
              }

              try {
                await setDoc(doc(db, "users", firebaseUser.uid), newUser)
              } catch (error) {
                console.error("Error creating new user in Firestore:", error)
              }

              saveUserToLocalStorage(newUser)
              setUser(newUser)
            }
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error)

          // If Firestore permission denied, try localStorage
          if (error.code === "permission-denied") {
            const localUser = getUserFromLocalStorage(firebaseUser.uid)

            if (localUser) {
              setUser(localUser)
            } else {
              // Create a basic user record in localStorage
              const newUser: User = {
                id: firebaseUser.uid,
                mentorId: generateMentorId(),
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
                phone: "",
                approved: true,
                isAdmin: false,
                createdAt: new Date(),
              }

              saveUserToLocalStorage(newUser)
              setUser(newUser)
            }
          } else {
            await signOut(auth)
            setUser(null)
          }
        }
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Handle routing based on auth state
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ["/", "/login", "/signup", "/forgot-password"]
      const isPublicPath = publicPaths.includes(pathname)

      if (!user && !isPublicPath) {
        router.push("/login")
      } else if (user && isPublicPath && pathname !== "/forgot-password" && pathname !== "/") {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const signup = async (userData: Omit<User, "id" | "mentorId" | "approved" | "isAdmin"> & { password: string }) => {
    setIsLoading(true)
    try {
      // Check if email already exists in localStorage first
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const existingLocalUser = localUsers.find((u: any) => u.email.toLowerCase() === userData.email.toLowerCase())

      if (existingLocalUser) {
        setIsLoading(false)
        return { success: false, error: "Email already exists" }
      }

      try {
        // Try to check if email exists in Firestore
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("email", "==", userData.email.toLowerCase()))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          setIsLoading(false)
          return { success: false, error: "Email already exists" }
        }
      } catch (error: any) {
        // If permission denied, continue with local storage approach
        if (error.code !== "permission-denied") {
          throw error
        }
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const firebaseUser = userCredential.user

      // Generate mentor ID
      const mentorId = generateMentorId()

      // Create user object - set approved to true by default
      const newUser: User = {
        id: firebaseUser.uid,
        mentorId,
        email: userData.email.toLowerCase(),
        name: userData.name,
        displayName: userData.displayName,
        phone: userData.phone || "",
        approved: true, // Auto-approve users
        isAdmin: false,
        createdAt: new Date(),
      }

      try {
        // Try to save to Firestore
        await setDoc(doc(db, "users", firebaseUser.uid), newUser)
      } catch (error: any) {
        // If permission denied, save to localStorage instead
        if (error.code === "permission-denied") {
          saveUserToLocalStorage(newUser)
        } else {
          throw error
        }
      }

      // No need to sign out after registration - let them stay logged in
      setUser(newUser)
      setIsLoading(false)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Signup error:", error)
      setIsLoading(false)

      // Provide more specific error messages based on Firebase error codes
      if (error.code === "auth/email-already-in-use") {
        return { success: false, error: "Email is already in use" }
      } else if (error.code === "auth/invalid-email") {
        return { success: false, error: "Invalid email format" }
      } else if (error.code === "auth/weak-password") {
        return { success: false, error: "Password is too weak" }
      } else if (error.code === "permission-denied") {
        return { success: false, error: "Permission denied. Please contact the administrator." }
      } else {
        return { success: false, error: error.message || "Registration failed" }
      }
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      try {
        // Try to get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data() as User

          // Auto-approve the user if they're not already approved
          if (!userData.approved) {
            userData.approved = true
            try {
              await updateDoc(doc(db, "users", firebaseUser.uid), { approved: true })
            } catch (error) {
              console.error("Error updating approval status:", error)
            }
          }

          setUser(userData)
          // Save to localStorage for cross-browser consistency
          saveUserToLocalStorage(userData)
          setIsLoading(false)
          return { success: true, error: null }
        }
      } catch (error: any) {
        // If permission denied, try localStorage
        if (error.code === "permission-denied") {
          const localUser = getUserFromLocalStorage(firebaseUser.uid)

          if (localUser) {
            // Auto-approve the user if they're not already approved
            if (!localUser.approved) {
              localUser.approved = true
              saveUserToLocalStorage(localUser)
            }

            setUser(localUser)
            setIsLoading(false)
            return { success: true, error: null }
          }
        } else {
          throw error
        }
      }

      // If we get here, user exists in Auth but not in Firestore or localStorage
      // Create a new user record
      const newUser: User = {
        id: firebaseUser.uid,
        mentorId: generateMentorId(),
        email: email.toLowerCase(),
        name: firebaseUser.displayName || email.split("@")[0],
        displayName: firebaseUser.displayName || email.split("@")[0],
        phone: "",
        approved: true,
        isAdmin: false,
        createdAt: new Date(),
      }

      try {
        await setDoc(doc(db, "users", firebaseUser.uid), newUser)
      } catch (error) {
        console.error("Error creating user in Firestore:", error)
      }

      saveUserToLocalStorage(newUser)
      setUser(newUser)
      setIsLoading(false)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Login error:", error)
      setIsLoading(false)

      // Provide more specific error messages based on Firebase error codes
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        return { success: false, error: "Invalid email or password" }
      } else if (error.code === "auth/too-many-requests") {
        return { success: false, error: "Too many failed login attempts. Please try again later." }
      } else if (error.code === "auth/user-disabled") {
        return { success: false, error: "This account has been disabled." }
      } else if (error.code === "permission-denied") {
        return { success: false, error: "Permission denied. Please contact the administrator." }
      } else {
        return { success: false, error: "Login failed. Please try again." }
      }
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return false

    try {
      // If avatar is included, check its size
      if (userData.avatar) {
        // Check if the avatar is too large (over 900KB)
        const base64Length = userData.avatar.length - (userData.avatar.indexOf(",") + 1)
        const sizeInBytes = (base64Length * 3) / 4

        if (sizeInBytes > 900000) {
          console.error("Avatar image is too large:", sizeInBytes, "bytes")
          return false
        }
      }

      // Create updated user object
      const updatedUser = { ...user, ...userData }

      // Update in Firestore
      try {
        const userRef = doc(db, "users", user.id)
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp(),
        })
      } catch (error: any) {
        console.error("Error updating in Firestore:", error)
        // If permission denied, only update in localStorage
        if (error.code !== "permission-denied") {
          throw error
        }
      }

      // Always update in localStorage for cross-browser consistency
      saveUserToLocalStorage(updatedUser)

      // Update display name in Firebase Auth if provided
      if (userData.displayName && auth.currentUser) {
        try {
          await updateFirebaseProfile(auth.currentUser, {
            displayName: userData.displayName,
          })
        } catch (error) {
          console.error("Error updating Firebase profile:", error)
        }
      }

      // Update local state
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
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

