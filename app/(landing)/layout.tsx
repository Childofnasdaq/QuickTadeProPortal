"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LiveChat } from "@/components/live-chat"
import { useAuth } from "@/components/auth-provider"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen">
      {children}
      <LiveChat />
    </div>
  )
}

