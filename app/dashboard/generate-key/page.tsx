"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useData } from "@/components/data-provider"
import { getPlanDisplayName } from "@/lib/utils"

export default function GenerateKeyPage() {
  const { eas, generateKey } = useData()
  const [username, setUsername] = useState("")
  const [selectedEA, setSelectedEA] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [error, setError] = useState("")

  const plans = [
    { id: "3days", name: "3 Days" },
    { id: "5days", name: "5 Days" },
    { id: "30days", name: "30 Days" },
    { id: "3months", name: "3 Months" },
    { id: "6months", name: "6 Months" },
    { id: "1year", name: "1 Year" },
    { id: "lifetime", name: "Lifetime" },
  ]

  const calculateExpiryDate = (plan: string, startDate: Date): Date => {
    const expiryDate = new Date(startDate)

    switch (plan) {
      case "3days":
        expiryDate.setDate(expiryDate.getDate() + 3)
        break
      case "5days":
        expiryDate.setDate(expiryDate.getDate() + 5)
        break
      case "30days":
        expiryDate.setDate(expiryDate.getDate() + 30)
        break
      case "3months":
        expiryDate.setMonth(expiryDate.getMonth() + 3)
        break
      case "6months":
        expiryDate.setMonth(expiryDate.getMonth() + 6)
        break
      case "1year":
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        break
      default:
        break
    }

    return expiryDate
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username) {
      setError("Please enter a username")
      return
    }

    if (!selectedEA) {
      setError("Please select an EA")
      return
    }

    if (!selectedPlan) {
      setError("Please select a plan")
      return
    }

    if (!confirmed) {
      setError("Please confirm the action")
      return
    }

    setIsLoading(true)

    const result = await generateKey(username, selectedEA, selectedPlan)

    if (result) {
      setGeneratedKey(result.key)
    } else {
      setError("Failed to generate key. You may have reached the maximum number of licenses.")
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Generate License Key</h1>
        <p className="text-red-400 mt-1">Enter the user details and the EA you want to authorize to the user</p>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md">{error}</div>}

      {generatedKey ? (
        <div className="bg-red-950/20 border border-red-500 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-300 mb-4">License Key Generated</h2>
          <div className="bg-black p-4 rounded-md mb-4">
            <p className="text-2xl font-mono text-red-500 tracking-wider">{generatedKey}</p>
          </div>
          <p className="text-red-300 mb-6">
            This is a license key for <span className="font-semibold">{username}</span> to use{" "}
            <span className="font-semibold">{eas.find((ea) => ea.id === selectedEA)?.name}</span> with a{" "}
            <span className="font-semibold">{getPlanDisplayName(selectedPlan)}</span> plan
          </p>

          {/* MT4/MT5 Scripts Section */}
          <div className="mt-8 mb-6">
            <h3 className="text-lg font-semibold text-red-300 mb-4">EA Script Files</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* MT4 Script File */}
              <div className="bg-black/80 border border-red-500/50 rounded-lg overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-400 mr-3"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <div>
                      <p className="text-red-200 font-medium">{eas.find((ea) => ea.id === selectedEA)?.name}.mq4</p>
                      <p className="text-red-400 text-xs">MT4 Script File</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-950 opacity-70 cursor-not-allowed"
                    disabled={true}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Download</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </Button>
                </div>
                <div className="bg-red-900/20 px-4 py-2 text-xs text-red-300">
                  <span>
                    License: {generatedKey} • Expires:{" "}
                    {selectedPlan === "lifetime"
                      ? "Never"
                      : new Date(calculateExpiryDate(selectedPlan, new Date())).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* MT5 Script File */}
              <div className="bg-black/80 border border-red-500/50 rounded-lg overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-400 mr-3"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <div>
                      <p className="text-red-200 font-medium">{eas.find((ea) => ea.id === selectedEA)?.name}.mq5</p>
                      <p className="text-red-400 text-xs">MT5 Script File</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-950 opacity-70 cursor-not-allowed"
                    disabled={true}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Download</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </Button>
                </div>
                <div className="bg-red-900/20 px-4 py-2 text-xs text-red-300">
                  <span>
                    License: {generatedKey} • Expires:{" "}
                    {selectedPlan === "lifetime"
                      ? "Never"
                      : new Date(calculateExpiryDate(selectedPlan, new Date())).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-950"
              onClick={() => {
                navigator.clipboard.writeText(generatedKey)
              }}
            >
              Copy Key
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                setGeneratedKey(null)
                setUsername("")
                setSelectedEA("")
                setSelectedPlan("")
                setConfirmed(false)
              }}
            >
              Generate Another
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <Input
              placeholder="User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
            />
          </div>

          <div>
            <Select value={selectedEA} onValueChange={setSelectedEA}>
              <SelectTrigger className="bg-black/50 border-red-500/50 focus:border-red-500 text-white">
                <SelectValue placeholder="Select an EA" />
              </SelectTrigger>
              <SelectContent className="bg-black border-red-500">
                {eas.length > 0 ? (
                  eas.map((ea) => (
                    <SelectItem key={ea.id} value={ea.id}>
                      {ea.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-ea" disabled>
                    No EAs available. Create one first.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="bg-black/50 border-red-500/50 focus:border-red-500 text-white">
                <SelectValue placeholder="Select a Plan" />
              </SelectTrigger>
              <SelectContent className="bg-black border-red-500">
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              className="border-red-500 data-[state=checked]:bg-red-500"
            />
            <label htmlFor="confirm" className="text-red-300 text-sm">
              I confirm
            </label>
          </div>

          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={!username || !selectedEA || !selectedPlan || !confirmed || isLoading || eas.length === 0}
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </form>
      )}
    </div>
  )
}

