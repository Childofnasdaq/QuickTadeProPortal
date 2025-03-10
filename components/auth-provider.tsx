"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { generateMentorId } from "@/lib/utils"
import type { User } from "@/lib/types"

// Update the AuthContext type to match the new signup return type
type AuthContextType = {
  user: User | null
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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // IMPORTANT: Remove the redirection logic from here - this was causing the immediate redirects
  // We'll only handle redirects in specific components or actions

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      // Case insensitive email check for login
      const foundUser = storedUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))

        // Also store auth token to prevent being kicked out
        localStorage.setItem("auth_token", Date.now().toString())

        setIsLoading(false)

        // Redirect to dashboard after successful login
        router.push("/dashboard")
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (userData: Omit<User, "id" | "mentorId"> & { password: string }) => {
    setIsLoading(true)
    try {
      // Get existing users
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if email already exists - case insensitive check
      const emailExists = storedUsers.some((u: any) => u.email.toLowerCase() === userData.email.toLowerCase())

      if (emailExists) {
        setIsLoading(false)
        return { success: false, error: "Email already exists" }
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        mentorId: generateMentorId(),
        email: userData.email.toLowerCase(), // Store email in lowercase
      }

      storedUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(storedUsers))

      setIsLoading(false)

      // Don't automatically log in after signup - redirect to login page instead
      router.push("/login")

      return { success: true, error: null }
    } catch (error) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return { success: false, error: "Registration failed" }
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return false

    try {
      const updatedUser = { ...user, ...userData }

      // Update in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Update in users array
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = storedUsers.map((u: any) => (u.id === user.id ? { ...u, ...userData } : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update state
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
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

