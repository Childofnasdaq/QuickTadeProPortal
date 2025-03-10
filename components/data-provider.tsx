"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import type { EA, LicenseKey, Stats } from "@/lib/types"
import { generateLicenseKey, calculateExpiryDate } from "@/lib/utils"

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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [eas, setEAs] = useState<EA[]>([])
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>([])
  const [stats, setStats] = useState<Stats>(INITIAL_STATS)

  // Load data from localStorage
  useEffect(() => {
    if (user) {
      try {
        const storedEAs = JSON.parse(localStorage.getItem("eas") || "[]")
        const storedLicenseKeys = JSON.parse(localStorage.getItem("licenseKeys") || "[]")

        // Filter data to only show items created by the current user
        const userEAs = storedEAs.filter((ea: any) => ea.createdBy === user.id)
        const userLicenseKeys = storedLicenseKeys.filter((key: any) => key.createdBy === user.id)

        // Convert string dates to Date objects
        const parsedEAs = userEAs.map((ea: any) => ({
          ...ea,
          createdAt: new Date(ea.createdAt),
        }))

        const parsedLicenseKeys = userLicenseKeys.map((key: any) => ({
          ...key,
          createdAt: new Date(key.createdAt),
          expiryDate: new Date(key.expiryDate),
        }))

        setEAs(parsedEAs)
        setLicenseKeys(parsedLicenseKeys)

        // Update stats
        updateStats(parsedEAs, parsedLicenseKeys)
      } catch (error) {
        console.error("Error loading data:", error)
        // Initialize with empty arrays if there's an error
        setEAs([])
        setLicenseKeys([])
        updateStats([], [])
      }
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

      // Get all EAs (including those from other users)
      const allEAs = JSON.parse(localStorage.getItem("eas") || "[]")
      const updatedAllEAs = [...allEAs, newEA]

      // Update local state with only user's EAs
      const updatedEAs = [...eas, newEA]
      setEAs(updatedEAs)

      // Save all EAs to localStorage
      localStorage.setItem("eas", JSON.stringify(updatedAllEAs))

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

      // Get all EAs (including those from other users)
      const allEAs = JSON.parse(localStorage.getItem("eas") || "[]")
      const updatedAllEAs = allEAs.filter((ea: any) => ea.id !== id)

      // Update local state with only user's EAs
      const updatedEAs = eas.filter((ea) => ea.id !== id)
      setEAs(updatedEAs)

      // Save all EAs to localStorage
      localStorage.setItem("eas", JSON.stringify(updatedAllEAs))

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

      // Get all license keys (including those from other users)
      const allLicenseKeys = JSON.parse(localStorage.getItem("licenseKeys") || "[]")
      const updatedAllLicenseKeys = [...allLicenseKeys, newLicenseKey]

      // Update local state with only user's license keys
      const updatedLicenseKeys = [...licenseKeys, newLicenseKey]
      setLicenseKeys(updatedLicenseKeys)

      // Save all license keys to localStorage
      localStorage.setItem("licenseKeys", JSON.stringify(updatedAllLicenseKeys))

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
      // Get all license keys (including those from other users)
      const allLicenseKeys = JSON.parse(localStorage.getItem("licenseKeys") || "[]")
      const updatedAllLicenseKeys = allLicenseKeys.filter((key: any) => key.id !== id)

      // Update local state with only user's license keys
      const updatedLicenseKeys = licenseKeys.filter((key) => key.id !== id)
      setLicenseKeys(updatedLicenseKeys)

      // Save all license keys to localStorage
      localStorage.setItem("licenseKeys", JSON.stringify(updatedAllLicenseKeys))

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
      // Get all license keys (including those from other users)
      const allLicenseKeys = JSON.parse(localStorage.getItem("licenseKeys") || "[]")

      // Update the status in all license keys
      const updatedAllLicenseKeys = allLicenseKeys.map((key: any) =>
        key.id === id ? { ...key, status: "inactive" } : key,
      )

      // Update local state with only user's license keys
      const updatedLicenseKeys = licenseKeys.map((key) =>
        key.id === id ? { ...key, status: "inactive" as const } : key,
      )
      setLicenseKeys(updatedLicenseKeys)

      // Save all license keys to localStorage
      localStorage.setItem("licenseKeys", JSON.stringify(updatedAllLicenseKeys))

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

