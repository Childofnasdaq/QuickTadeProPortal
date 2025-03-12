"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface UserData {
  mentorId: string
  fullName: string
  email: string
  role: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  return <AuthContext.Provider value={{ user, userData, isLoading }}>{children}</AuthContext.Provider>
}

