"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import type { EA, LicenseKey, Stats } from "@/lib/types"
import {
  getEAs,
  getLicenseKeys,
  getStats,
  addEA,
  deleteEA,
  generateNewLicenseKey,
  deleteLicenseKey,
  deactivateLicenseKey,
} from "@/lib/api"

type DataContextType = {
  eas: EA[]
  licenseKeys: LicenseKey[]
  stats: Stats
  addEA: (name: string) => Promise<EA | null>
  deleteEA: (id: string) => Promise<boolean>
  generateKey: (username: string, eaId: string, plan: string) => Promise<LicenseKey | null>
  deleteLicenseKey: (id: string) => Promise<boolean>
  deactivateLicenseKey: (id: string) => Promise<boolean>
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_STATS: Stats = {
  totalLicenses: 0,
  activeSubscriptions: 0,
  totalEAs: 0,
  maxLicenses: 10000,
}

// Helper functions for localStorage as fallback
const saveDataToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
    return false
  }
}

const getDataFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return null
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [eas, setEAs] = useState<EA[]>([])
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>([])
  const [stats, setStats] = useState<Stats>(INITIAL_STATS)

  // Load data from MongoDB
  useEffect(() => {
    if (user) {
      loadAllData()
    }
  }, [user])

  const loadAllData = async () => {
    if (!user) return

    try {
      // Load data from MongoDB via server actions
      const [easData, licenseKeysData, statsData] = await Promise.all([
        getEAs(user.id),
        getLicenseKeys(user.id),
        getStats(user.id),
      ])

      // Update state with fetched data
      setEAs(easData)
      setLicenseKeys(licenseKeysData)
      setStats(statsData)

      // Save to localStorage as backup
      saveDataToLocalStorage(`eas_${user.id}`, easData)
      saveDataToLocalStorage(`licenseKeys_${user.id}`, licenseKeysData)
    } catch (error) {
      console.error("Error loading data:", error)

      // Fallback to localStorage if MongoDB fetch fails
      const storedEAs = getDataFromLocalStorage(`eas_${user.id}`) || []
      const storedLicenseKeys = getDataFromLocalStorage(`licenseKeys_${user.id}`) || []

      setEAs(storedEAs)
      setLicenseKeys(storedLicenseKeys)

      // Calculate stats from localStorage data
      const activeKeys = storedLicenseKeys.filter((key: LicenseKey) => key.status === "active")
      setStats({
        totalLicenses: storedLicenseKeys.length,
        activeSubscriptions: activeKeys.length,
        totalEAs: storedEAs.length,
        maxLicenses: 10000,
      })
    }
  }

  // Function to manually refresh data
  const refreshData = async () => {
    await loadAllData()
  }

  // Add a new EA
  const handleAddEA = async (name: string): Promise<EA | null> => {
    if (!user) return null

    try {
      const newEA = await addEA(user.id, name)

      if (newEA) {
        // Update local state
        const updatedEAs = [...eas, newEA]
        setEAs(updatedEAs)

        // Update localStorage backup
        saveDataToLocalStorage(`eas_${user.id}`, updatedEAs)

        // Refresh stats
        const statsData = await getStats(user.id)
        setStats(statsData)

        return newEA
      }

      return null
    } catch (error) {
      console.error("Add EA error:", error)
      return null
    }
  }

  // Delete an EA
  const handleDeleteEA = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      const success = await deleteEA(user.id, id)

      if (success) {
        // Update local state
        const updatedEAs = eas.filter((ea) => ea.id !== id)
        setEAs(updatedEAs)

        // Update localStorage backup
        saveDataToLocalStorage(`eas_${user.id}`, updatedEAs)

        // Refresh stats
        const statsData = await getStats(user.id)
        setStats(statsData)

        return true
      }

      return false
    } catch (error) {
      console.error("Delete EA error:", error)
      return false
    }
  }

  // Generate a new license key
  const handleGenerateKey = async (username: string, eaId: string, plan: string): Promise<LicenseKey | null> => {
    if (!user) return null

    try {
      const newKey = await generateNewLicenseKey(user.id, username, eaId, plan)

      if (newKey) {
        // Update local state
        const updatedKeys = [...licenseKeys, newKey]
        setLicenseKeys(updatedKeys)

        // Update localStorage backup
        saveDataToLocalStorage(`licenseKeys_${user.id}`, updatedKeys)

        // Refresh stats
        const statsData = await getStats(user.id)
        setStats(statsData)

        return newKey
      }

      return null
    } catch (error) {
      console.error("Generate key error:", error)
      return null
    }
  }

  // Delete a license key
  const handleDeleteLicenseKey = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      const success = await deleteLicenseKey(user.id, id)

      if (success) {
        // Update local state
        const updatedKeys = licenseKeys.filter((key) => key.id !== id)
        setLicenseKeys(updatedKeys)

        // Update localStorage backup
        saveDataToLocalStorage(`licenseKeys_${user.id}`, updatedKeys)

        // Refresh stats
        const statsData = await getStats(user.id)
        setStats(statsData)

        return true
      }

      return false
    } catch (error) {
      console.error("Delete license key error:", error)
      return false
    }
  }

  // Deactivate a license key
  const handleDeactivateLicenseKey = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      const success = await deactivateLicenseKey(user.id, id)

      if (success) {
        // Update local state
        const updatedKeys = licenseKeys.map((key) => (key.id === id ? { ...key, status: "inactive" as const } : key))
        setLicenseKeys(updatedKeys)

        // Update localStorage backup
        saveDataToLocalStorage(`licenseKeys_${user.id}`, updatedKeys)

        // Refresh stats
        const statsData = await getStats(user.id)
        setStats(statsData)

        return true
      }

      return false
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
        addEA: handleAddEA,
        deleteEA: handleDeleteEA,
        generateKey: handleGenerateKey,
        deleteLicenseKey: handleDeleteLicenseKey,
        deactivateLicenseKey: handleDeactivateLicenseKey,
        refreshData,
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

