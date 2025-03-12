"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import type { EA, LicenseKey, Stats } from "@/lib/types"
import { generateLicenseKey, calculateExpiryDate } from "@/lib/utils"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

type DataContextType = {
  eas: EA[]
  licenseKeys: LicenseKey[]
  stats: Stats
  addEA: (name: string) => Promise<EA | null>
  deleteEA: (id: string) => Promise<boolean>
  generateKey: (username: string, eaId: string, plan: string) => Promise<LicenseKey | null>
  deleteLicenseKey: (id: string) => Promise<boolean>
  deactivateLicenseKey: (id: string) => Promise<boolean>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_STATS: Stats = {
  totalLicenses: 0,
  activeSubscriptions: 0,
  totalEAs: 0,
  maxLicenses: 10000,
}

// Helper functions for localStorage
const saveEAsToLocalStorage = (eas: EA[]) => {
  try {
    localStorage.setItem("eas", JSON.stringify(eas))
    return true
  } catch (error) {
    console.error("Error saving EAs to localStorage:", error)
    return false
  }
}

const saveLicenseKeysToLocalStorage = (licenseKeys: LicenseKey[]) => {
  try {
    localStorage.setItem("licenseKeys", JSON.stringify(licenseKeys))
    return true
  } catch (error) {
    console.error("Error saving license keys to localStorage:", error)
    return false
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [eas, setEAs] = useState<EA[]>([])
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>([])
  const [stats, setStats] = useState<Stats>(INITIAL_STATS)

  // Load data from localStorage and Firestore
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        let loadedEAs: EA[] = []
        let loadedLicenseKeys: LicenseKey[] = []

        try {
          // Try to load from Firestore first
          const easRef = collection(db, "eas")
          const easQuery = query(easRef, where("createdBy", "==", user.id))
          const easSnapshot = await getDocs(easQuery)

          loadedEAs = easSnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
              }) as EA,
          )

          const keysRef = collection(db, "licenseKeys")
          const keysQuery = query(keysRef, where("createdBy", "==", user.id))
          const keysSnapshot = await getDocs(keysQuery)

          loadedLicenseKeys = keysSnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                expiryDate: doc.data().expiryDate?.toDate() || new Date(),
              }) as LicenseKey,
          )
        } catch (error) {
          console.error("Error loading from Firestore:", error)

          // Fall back to localStorage
          const storedEAs = JSON.parse(localStorage.getItem("eas") || "[]")
          const storedLicenseKeys = JSON.parse(localStorage.getItem("licenseKeys") || "[]")

          // Filter data to only show items created by the current user
          loadedEAs = storedEAs.filter((ea: any) => ea.createdBy === user.id)
          loadedLicenseKeys = storedLicenseKeys.filter((key: any) => key.createdBy === user.id)

          // Convert string dates to Date objects
          loadedEAs = loadedEAs.map((ea: any) => ({
            ...ea,
            createdAt: new Date(ea.createdAt),
          }))

          loadedLicenseKeys = loadedLicenseKeys.map((key: any) => ({
            ...key,
            createdAt: new Date(key.createdAt),
            expiryDate: new Date(key.expiryDate),
          }))
        }

        setEAs(loadedEAs)
        setLicenseKeys(loadedLicenseKeys)

        // Update stats
        updateStats(loadedEAs, loadedLicenseKeys)
      }

      loadData()
    }
  }, [user])

  // Update stats whenever EAs or licenseKeys change
  const updateStats = (currentEAs: EA[], currentLicenseKeys: LicenseKey[]) => {
    const activeKeys = currentLicenseKeys.filter((key) => key.status === "active")

    setStats({
      totalLicenses: currentLicenseKeys.length,
      activeSubscriptions: activeKeys.length,
      totalEAs: currentEAs.length,
      maxLicenses: 10000,
    })
  }

  // Add a new EA
  const addEA = async (name: string): Promise<EA | null> => {
    if (!user) return null

    try {
      const newEA: EA = {
        id: Date.now().toString(),
        name,
        createdAt: new Date(),
        createdBy: user.id,
      }

      // Try to save to Firestore
      try {
        const docRef = await addDoc(collection(db, "eas"), {
          ...newEA,
          createdAt: serverTimestamp(),
        })
        newEA.id = docRef.id
      } catch (error) {
        console.error("Error adding EA to Firestore:", error)
        // Continue with localStorage only
      }

      const updatedEAs = [...eas, newEA]
      setEAs(updatedEAs)

      // Save to localStorage
      saveEAsToLocalStorage([...eas, newEA])

      // Update stats
      updateStats(updatedEAs, licenseKeys)

      return newEA
    } catch (error) {
      console.error("Add EA error:", error)
      return null
    }
  }

  // Delete an EA
  const deleteEA = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      // Check if EA is in use by any license key
      const isInUse = licenseKeys.some((key) => key.eaId === id)
      if (isInUse) {
        return false
      }

      // Try to delete from Firestore
      try {
        await deleteDoc(doc(db, "eas", id))
      } catch (error) {
        console.error("Error deleting EA from Firestore:", error)
        // Continue with localStorage only
      }

      const updatedEAs = eas.filter((ea) => ea.id !== id)
      setEAs(updatedEAs)

      // Save to localStorage
      saveEAsToLocalStorage(updatedEAs)

      // Update stats
      updateStats(updatedEAs, licenseKeys)

      return true
    } catch (error) {
      console.error("Delete EA error:", error)
      return false
    }
  }

  // Generate a new license key
  const generateKey = async (username: string, eaId: string, plan: string): Promise<LicenseKey | null> => {
    if (!user) return null

    try {
      // Find the EA
      const ea = eas.find((ea) => ea.id === eaId)
      if (!ea) return null

      // Check if we've reached the maximum number of licenses
      if (licenseKeys.length >= stats.maxLicenses) {
        return null
      }

      const key = generateLicenseKey()
      const createdAt = new Date()
      const expiryDate = calculateExpiryDate(plan, createdAt)

      const newLicenseKey: LicenseKey = {
        id: Date.now().toString(),
        key,
        username,
        eaId,
        eaName: ea.name,
        plan,
        status: "active",
        createdAt,
        expiryDate,
        createdBy: user.id,
      }

      // Try to save to Firestore
      try {
        const docRef = await addDoc(collection(db, "licenseKeys"), {
          ...newLicenseKey,
          createdAt: serverTimestamp(),
          expiryDate,
        })
        newLicenseKey.id = docRef.id
      } catch (error) {
        console.error("Error adding license key to Firestore:", error)
        // Continue with localStorage only
      }

      const updatedLicenseKeys = [...licenseKeys, newLicenseKey]
      setLicenseKeys(updatedLicenseKeys)

      // Save to localStorage
      saveLicenseKeysToLocalStorage(updatedLicenseKeys)

      // Update stats
      updateStats(eas, updatedLicenseKeys)

      return newLicenseKey
    } catch (error) {
      console.error("Generate key error:", error)
      return null
    }
  }

  // Delete a license key
  const deleteLicenseKey = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      // Try to delete from Firestore
      try {
        await deleteDoc(doc(db, "licenseKeys", id))
      } catch (error) {
        console.error("Error deleting license key from Firestore:", error)
        // Continue with localStorage only
      }

      const updatedLicenseKeys = licenseKeys.filter((key) => key.id !== id)
      setLicenseKeys(updatedLicenseKeys)

      // Save to localStorage
      saveLicenseKeysToLocalStorage(updatedLicenseKeys)

      // Update stats
      updateStats(eas, updatedLicenseKeys)

      return true
    } catch (error) {
      console.error("Delete license key error:", error)
      return false
    }
  }

  // Deactivate a license key
  const deactivateLicenseKey = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      // Try to update in Firestore
      try {
        await updateDoc(doc(db, "licenseKeys", id), {
          status: "inactive",
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        console.error("Error updating license key in Firestore:", error)
        // Continue with localStorage only
      }

      const updatedLicenseKeys = licenseKeys.map((key) =>
        key.id === id ? { ...key, status: "inactive" as const } : key,
      )

      setLicenseKeys(updatedLicenseKeys)

      // Save to localStorage
      saveLicenseKeysToLocalStorage(updatedLicenseKeys)

      // Update stats
      updateStats(eas, updatedLicenseKeys)

      return true
    } catch (error) {
      console.error("Deactivate license key error:", error)
      return false
    }
  }

  return (
    <DataContext.Provider
      value={{
        eas,
        licenseKeys,
        stats,
        addEA,
        deleteEA,
        generateKey,
        deleteLicenseKey,
        deactivateLicenseKey,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

