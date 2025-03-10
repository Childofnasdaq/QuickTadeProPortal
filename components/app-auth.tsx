"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { handleAppAuthentication, isRunningInApp } from "@/lib/app-integration"
import { validateLicenseKey } from "@/lib/license-service"

export function AppAuth() {
  const [mentorId, setMentorId] = useState("")
  const [licenseKey, setLicenseKey] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  // Check if already authenticated in app
  useEffect(() => {
    const storedMentorId = localStorage.getItem("app_mentor_id")
    const storedLicenseKey = localStorage.getItem("app_license_key")

    if (storedMentorId && storedLicenseKey) {
      setMentorId(storedMentorId)
      setLicenseKey(storedLicenseKey)

      // Validate stored credentials
      validateCredentials(storedMentorId, storedLicenseKey)
    }
  }, [])

  const validateCredentials = async (id: string, key: string) => {
    setIsLoading(true)
    setError("")

    try {
      // Validate license key against mentor ID
      const licenseInfo = await validateLicenseKey(key, id)

      if (licenseInfo.isValid) {
        // Handle successful authentication
        handleAppAuthentication(id, key)
        setIsSuccess(true)

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setError("Invalid license key or mentor ID")
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validateCredentials(mentorId, licenseKey)
  }

  // Only show this component if running in the app
  if (!isRunningInApp() && process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border border-red-500 bg-black text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-500">QUICKTRADE PRO</CardTitle>
          <p className="text-gray-400">Enter your credentials to access the trading portal</p>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center">
              <div className="mb-4 text-green-500">✓ Authentication successful</div>
              <p className="text-gray-300">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-md bg-red-900/30 border border-red-500 p-3 text-red-200">{error}</div>}

              <div className="space-y-2">
                <Input
                  id="mentorId"
                  placeholder="Mentor ID"
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="licenseKey"
                  placeholder="License Key"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Authenticate"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

