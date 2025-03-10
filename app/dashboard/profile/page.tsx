"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { Upload } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    displayName: user?.displayName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Basic validation
    if (!formData.name || !formData.displayName || !formData.email) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    const success = await updateProfile(formData)

    if (success) {
      setSuccess(true)
    } else {
      setError("Failed to update profile")
    }

    setIsLoading(false)
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-red-400 mt-1">Manage your personal information</p>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md">{error}</div>}

      {success && (
        <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-2 rounded-md">
          Profile updated successfully
        </div>
      )}

      <div className="bg-red-950/20 border border-red-900 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-300 mb-2">Logo:</h2>
          <div className="flex items-center space-x-4">
            <div
              className="w-32 h-32 border-2 border-dashed border-red-500/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
              onClick={handleLogoClick}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-red-400">
                  <Upload className="mx-auto h-8 w-8 mb-1" />
                  <span className="text-sm">Choose File</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        updateProfile({ avatar: event.target.result as string })
                      }
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-950"
              onClick={handleLogoClick}
            >
              Upload The Logo
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-red-300 mb-1">
              First name:
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-red-300 mb-1">
              Display Name:
            </label>
            <Input
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-red-300 mb-1">
              Phone:
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-red-300 mb-1">
              Email:
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-red-950/10 border border-red-900/50 rounded-lg p-4 text-red-400 text-sm">
        <p className="font-semibold">Mentor ID: {user?.mentorId}</p>
        <p className="mt-1">Your mentor ID is automatically assigned during registration and cannot be changed.</p>
      </div>
    </div>
  )
}

