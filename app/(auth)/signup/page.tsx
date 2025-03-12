"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function SignupPage() {
  const { signup, user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    email: "",
    phone: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!formData.name || !formData.displayName || !formData.email || !formData.password) {
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

    // Password validation (at least 6 characters)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      await signup(formData)

      // Show success message
      setSuccess(true)

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "Registration failed")
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="mt-4 text-red-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-xl overflow-hidden bg-black border border-red-500 glow-border">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-black to-red-950 p-8 flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
              alt="Logo"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-red-500 neon-text">QUICKTRADE PRO</h1>
              <p className="text-red-400 mt-1">New Account</p>
            </div>

            <h2 className="text-2xl font-semibold text-red-500 mb-6 neon-text">Sign Up</h2>

            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4">{error}</div>
            )}

            {success && (
              <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-2 rounded-md mb-4">
                Registration successful! Redirecting to login...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
              </div>

              <div>
                <Input
                  name="displayName"
                  placeholder="Display name, e.g. Today Forex Trader"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
              </div>

              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
              </div>

              <div>
                <Input
                  name="phone"
                  placeholder="Contact number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
              </div>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white pr-10"
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
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <Link href="/forgot-password" className="text-red-400 hover:text-red-300 text-sm block">
                Forgot password?
              </Link>
              <div className="text-red-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-red-300 hover:text-red-200 underline">
                  Sign In
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-red-400/70 space-x-4">
              <Link href="/terms" className="hover:text-red-300">
                Terms of use
              </Link>
              <Link href="/privacy" className="hover:text-red-300">
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

