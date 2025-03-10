"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const success = await login(email, password)

      if (success) {
        setLoginSuccess(true)
        // Login function now handles the redirect
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-xl overflow-hidden bg-black border border-red-500 glow-border">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-red-500 neon-text">QUICKTRADE PRO</h1>
              <p className="text-red-400 mt-1">Admin Dashboard</p>
            </div>

            <h2 className="text-2xl font-semibold text-red-500 mb-6 neon-text">Sign In</h2>

            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4">{error}</div>
            )}

            {loginSuccess && (
              <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-2 rounded-md mb-4">
                Login successful! Redirecting to dashboard...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <Link href="/forgot-password" className="text-red-400 hover:text-red-300 text-sm block">
                Forgot password?
              </Link>
              <div className="text-red-400 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-red-300 hover:text-red-200 underline">
                  Sign Up
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

