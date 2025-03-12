"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signup } from "@/lib/auth-service"

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signup(formData)
      // Redirect to login page immediately after successful signup
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl overflow-hidden bg-black border border-red-500 glow-border">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
              alt="Logo"
              width={80}
              height={80}
            />
          </div>

          <h1 className="text-2xl font-bold text-red-500 text-center mb-2 neon-text">Sign Up</h1>
          <p className="text-red-400 text-center mb-6">Create your QuickTrade Pro account</p>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
              required
            />

            <Input
              name="displayName"
              placeholder="Display name, e.g. Today Forex Trader"
              value={formData.displayName}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
              required
            />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
              required
            />

            <Input
              name="phone"
              placeholder="Contact number"
              value={formData.phone}
              onChange={handleChange}
              className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
              required
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-black/50 border-red-500/50 focus:border-red-500 text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/login" className="text-red-400 hover:text-red-300 text-sm">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

