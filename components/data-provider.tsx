"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore"

// Define types for our data
type EA = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  userId: string
  createdAt: number
}

type LicenseKey = {
  id: string
  key: string
  status: "active" | "inactive"
  userId: string
  eaId: string
  createdAt: number
  expiresAt: number
}

type Stats = {
  totalEAs: number
  activeEAs: number
  totalKeys: number
  activeKeys: number
}

type DataContextType = {
  eas: EA[]
  licenseKeys: LicenseKey[]
  stats: Stats
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  createEA: (name: string, description: string) => Promise<void>
  deleteEA: (id: string) => Promise<void>
  generateLicenseKey: (eaId: string, expiryDays: number) => Promise<string>
  deactivateLicenseKey: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [eas, setEAs] = useState<EA[]>([])
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>([])
  const [stats, setStats] = useState<Stats>({
    totalEAs: 0,
    activeEAs: 0,
    totalKeys: 0,
    activeKeys: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch all data
  const fetchData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch EAs
      const easQuery = query(collection(db, "eas"), where("userId", "==", user.uid))
      const easSnapshot = await getDocs(easQuery)
      const easData = easSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EA[]
      setEAs(easData)

      // Fetch License Keys
      const keysQuery = query(collection(db, "licenseKeys"), where("userId", "==", user.uid))
      const keysSnapshot = await getDocs(keysQuery)
      const keysData = keysSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LicenseKey[]
      setLicenseKeys(keysData)

      // Calculate stats
      setStats({
        totalEAs: easData.length,
        activeEAs: easData.filter((ea) => ea.status === "active").length,
        totalKeys: keysData.length,
        activeKeys: keysData.filter((key) => key.status === "active").length,
      })

      setLoading(false)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again.")
      setLoading(false)
    }
  }

  // Fetch data on initial load and when user changes
  useEffect(() => {
    fetchData()
  }, [user])

  // Function to create a new EA
  const createEA = async (name: string, description: string) => {
    if (!user) return

    try {
      const newEA = {
        name,
        description,
        status: "active" as const,
        userId: user.uid,
        createdAt: Date.now(),
      }

      const docRef = await addDoc(collection(db, "eas"), newEA)

      // Update local state
      setEAs((prev) => [...prev, { id: docRef.id, ...newEA }])

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalEAs: prev.totalEAs + 1,
        activeEAs: prev.activeEAs + 1,
      }))
    } catch (err) {
      console.error("Error creating EA:", err)
      setError("Failed to create EA. Please try again.")
    }
  }

  // Function to delete an EA
  const deleteEA = async (id: string) => {
    if (!user) return

    try {
      await deleteDoc(doc(db, "eas", id))

      // Update local state
      const deletedEA = eas.find((ea) => ea.id === id)
      setEAs((prev) => prev.filter((ea) => ea.id !== id))

      // Update stats
      if (deletedEA) {
        setStats((prev) => ({
          ...prev,
          totalEAs: prev.totalEAs - 1,
          activeEAs: deletedEA.status === "active" ? prev.activeEAs - 1 : prev.activeEAs,
        }))
      }
    } catch (err) {
      console.error("Error deleting EA:", err)
      setError("Failed to delete EA. Please try again.")
    }
  }

  // Function to generate a license key
  const generateLicenseKey = async (eaId: string, expiryDays: number) => {
    if (!user) return ""

    try {
      // Generate a random license key
      const key =
        `QT-${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase()

      const newKey = {
        key,
        status: "active" as const,
        userId: user.uid,
        eaId,
        createdAt: Date.now(),
        expiresAt: Date.now() + expiryDays * 24 * 60 * 60 * 1000,
      }

      const docRef = await addDoc(collection(db, "licenseKeys"), newKey)

      // Update local state
      setLicenseKeys((prev) => [...prev, { id: docRef.id, ...newKey }])

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalKeys: prev.totalKeys + 1,
        activeKeys: prev.activeKeys + 1,
      }))

      return key
    } catch (err) {
      console.error("Error generating license key:", err)
      setError("Failed to generate license key. Please try again.")
      return ""
    }
  }

  // Function to deactivate a license key
  const deactivateLicenseKey = async (id: string) => {
    if (!user) return

    try {
      await updateDoc(doc(db, "licenseKeys", id), {
        status: "inactive",
      })

      // Update local state
      setLicenseKeys((prev) => prev.map((key) => (key.id === id ? { ...key, status: "inactive" as const } : key)))

      // Update stats
      setStats((prev) => ({
        ...prev,
        activeKeys: prev.activeKeys - 1,
      }))
    } catch (err) {
      console.error("Error deactivating license key:", err)
      setError("Failed to deactivate license key. Please try again.")
    }
  }

  // Create a memoized value for the context
  const value = {
    eas,
    licenseKeys,
    stats,
    loading,
    error,
    refreshData: fetchData,
    createEA,
    deleteEA,
    generateLicenseKey,
    deactivateLicenseKey,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

