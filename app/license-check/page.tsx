"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, XCircle, Search } from "lucide-react"
import { getLicenseStatus } from "@/lib/utils"

export default function LicenseCheckPage() {
  const [licenseKey, setLicenseKey] = useState("")
  const [status, setStatus] = useState<"active" | "used" | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState("")

  const handleCheck = () => {
    // Reset states
    setError("")
    setStatus(null)

    // Validate license key format (XXXX-XXXX-XXXX-XXXX)
    const licenseKeyRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    if (!licenseKeyRegex.test(licenseKey)) {
      setError("Invalid license key format. Please use the format: XXXX-XXXX-XXXX-XXXX")
      return
    }

    setIsChecking(true)

    // Simulate API call to check license status
    setTimeout(() => {
      try {
        const result = getLicenseStatus(licenseKey)
        setStatus(result)
      } catch (err) {
        setError("Failed to check license status. Please try again.")
      } finally {
        setIsChecking(false)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black border border-red-500">
        <CardHeader>
          <CardTitle className="text-2xl text-red-500">License Key Checker</CardTitle>
          <CardDescription className="text-red-300">
            Check if your QuickTradePro license key is active or used
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="license-key" className="text-red-300 text-sm">
              Enter your license key
            </label>
            <div className="flex space-x-2">
              <Input
                id="license-key"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
              />
              <Button
                onClick={handleCheck}
                disabled={isChecking || !licenseKey}
                className="bg-red-500 hover:bg-red-600"
              >
                {isChecking ? "Checking..." : "Check"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-md">
              <XCircle className="h-5 w-5 inline-block mr-2" />
              {error}
            </div>
          )}

          {status && (
            <div
              className={`p-4 rounded-md flex items-center ${
                status === "active"
                  ? "bg-green-900/30 border border-green-500 text-green-200"
                  : "bg-yellow-900/30 border border-yellow-500 text-yellow-200"
              }`}
            >
              {status === "active" ? <CheckCircle className="h-6 w-6 mr-3" /> : <XCircle className="h-6 w-6 mr-3" />}
              <div>
                <p className="font-medium">{status === "active" ? "License is active" : "License has been used"}</p>
                <p className="text-sm opacity-80">
                  {status === "active"
                    ? "This license key is valid and ready to use."
                    : "This license key has already been activated."}
                </p>
              </div>
            </div>
          )}

          {!status && !error && (
            <div className="bg-black/50 border border-red-500/30 rounded-md p-4 text-center text-red-300">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Enter your license key and click "Check" to verify its status.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

