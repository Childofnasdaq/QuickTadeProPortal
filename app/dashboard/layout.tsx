"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useAuth } from "@/components/auth-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Protect dashboard routes
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Show loading or render dashboard
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-black text-red-500">Loading...</div>
  }

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="h-full relative bg-black">
      <Sidebar />
      <div className="md:pl-64 min-h-screen">
        <Header />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}

