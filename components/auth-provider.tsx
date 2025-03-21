"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/lib/types"
import { createUser, authenticateUser, updateUserProfile } from "@/lib/api"

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

const LOCAL_STORAGE_USER_KEY = "quicktradepro_user"
const LOCAL_STORAGE_REGISTERED_USERS = "quicktradepro_registered_users"

// Helper function to store user in localStorage
const saveUserToLocalStorage = (user: User) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user))
    return true
  } catch (error) {
    console.error("Error saving user to localStorage:", error)
    return false
  }
}

// Helper function to get user from localStorage
const getUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error("Error getting user from localStorage:", error)
    return null
  }
}

// Helper function to save registered user for fallback
const saveRegisteredUser = (user: User & { password: string }) => {
  try {
    const existingUsers = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS)
    const users = existingUsers ? JSON.parse(existingUsers) : []

    // Check if user already exists
    const existingIndex = users.findIndex((u: User) => u.email.toLowerCase() === user.email.toLowerCase())

    if (existingIndex >= 0) {
      // Update existing user
      users[existingIndex] = user
    } else {
      // Add new user
      users.push(user)
    }

    localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS, JSON.stringify(users))
    console.log(`Saved registered user to localStorage: ${user.email}`)
    return true
  } catch (error) {
    console.error("Error saving registered user to localStorage:", error)
    return false
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is already logged in via localStorage
  useEffect(() => {
    const loadUser = () => {
      const savedUser = getUserFromLocalStorage()
      if (savedUser) {
        setUser(savedUser)
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  // Handle routing based on auth state
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = [
        "/",
        "/login",
        "/signup",
        "/forgot-password",
        "/payment",
        "/yoco-payment",
        "/payment-success",
        "/payment-cancel",
        "/terms",
        "/privacy",
      ]
      const isPublicPath =
        publicPaths.includes(pathname) || pathname.startsWith("/yoco-payment") || pathname.startsWith("/payment")

      if (!user && !isPublicPath) {
        router.push("/login")
      } else if (user && isPublicPath && !pathname.startsWith("/forgot-password") && pathname !== "/") {
        // Don't redirect from payment pages
        if (!pathname.includes("payment") && !pathname.includes("privacy") && !pathname.includes("terms")) {
          router.push("/dashboard")
        }
      }
    }
  }, [user, isLoading, pathname, router])

  const signup = async (userData: Omit<User, "id" | "mentorId" | "approved" | "isAdmin"> & { password: string }) => {
    setIsLoading(true)
    try {
      console.log(`Signing up user: ${userData.email}`)
      const result = await createUser(userData)

      if (!result.success || !result.user) {
        console.error("MongoDB user creation failed:", result.error)

        // Fallback to local user creation
        console.log("Attempting local user creation as fallback")

        // Generate a local user
        const localUser: User & { password: string } = {
          id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          mentorId: generateMentorId(),
          email: userData.email.toLowerCase(),
          name: userData.name,
          displayName: userData.displayName,
          phone: userData.phone || "",
          approved: true,
          isAdmin: false,
          password: userData.password,
          createdAt: new Date(),
        }

        // Save the local user for both current session and future fallback
        saveUserToLocalStorage(localUser)
        saveRegisteredUser(localUser)
        setUser(localUser)

        setIsLoading(false)
        return { success: true, error: null }
      }

      // Save user to localStorage and state
      const userWithPassword = { ...result.user, password: userData.password }
      saveUserToLocalStorage(userWithPassword)
      saveRegisteredUser(userWithPassword)
      setUser(userWithPassword)

      setIsLoading(false)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return { success: false, error: error.message || "Registration failed" }
    }
  }

  // Enhance the login function with better error handling and debugging
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log(`Attempting to login user: ${email}`)
      const authenticatedUser = await authenticateUser(email, password)

      if (!authenticatedUser) {
        console.log(`Login failed for user: ${email}`)

        // Try fallback to localStorage
        try {
          const registeredUsers = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS)
          if (registeredUsers) {
            const users = JSON.parse(registeredUsers)
            const localUser = users.find(
              (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
            )

            if (localUser) {
              console.log(`Found user in localStorage fallback: ${email}`)
              saveUserToLocalStorage(localUser)
              setUser(localUser)
              setIsLoading(false)
              return { success: true, error: null }
            } else {
              console.log(`User not found in localStorage fallback or password mismatch: ${email}`)
            }
          }
        } catch (e) {
          console.error("Error checking localStorage fallback:", e)
        }

        setIsLoading(false)
        return { success: false, error: "Invalid email or password" }
      }

      // Save user to localStorage and state
      console.log(`Login successful for user: ${email}`)
      saveUserToLocalStorage(authenticatedUser)
      setUser(authenticatedUser)

      setIsLoading(false)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Login error:", error)
      setIsLoading(false)
      return { success: false, error: error.message || "Login failed" }
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return false

    try {
      const success = await updateUserProfile(user.id, userData)

      if (success) {
        // Update local user data
        const updatedUser = { ...user, ...userData }
        saveUserToLocalStorage(updatedUser)

        // Also update in registered users if it exists
        try {
          const registeredUsers = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS)
          if (registeredUsers) {
            const users = JSON.parse(registeredUsers)
            const userIndex = users.findIndex((u: any) => u.id === user.id)
            if (userIndex >= 0) {
              users[userIndex] = { ...users[userIndex], ...userData }
              localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS, JSON.stringify(users))
            }
          }
        } catch (e) {
          console.error("Error updating registered user:", e)
        }

        setUser(updatedUser)
        return true
      }

      return false
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      // Clear user from localStorage and state
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
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

// Fix the generateMentorId function at the bottom of the file
function generateMentorId(): number {
  // Generate a random 6-digit number for the mentor ID
  return Math.floor(100000 + Math.random() * 900000)
}

