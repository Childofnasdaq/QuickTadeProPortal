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

