"use client"

import { useAuth } from "@/components/auth-provider"
import { useData } from "@/components/data-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats } = useData()
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const date = new Date()
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    )
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-red-400">Today ({currentDate})</div>
      </div>

      <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4 text-red-200">
        Welcome back, {user?.displayName}! Your Mentor ID is {user?.mentorId}.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-600/20 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-200 text-sm font-medium">Total EAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-100">{stats.totalEAs}</div>
            <p className="text-blue-300 text-sm mt-1">Expert Advisors</p>
          </CardContent>
        </Card>

        <Card className="bg-green-600/20 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-200 text-sm font-medium">Total Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-100">{stats.totalLicenses}</div>
            <p className="text-green-300 text-sm mt-1">License keys generated</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-600/20 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-200 text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-100">{stats.activeSubscriptions}</div>
            <p className="text-purple-300 text-sm mt-1">Active license keys</p>
          </CardContent>
        </Card>

        <Card className="bg-red-600/20 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-200 text-sm font-medium">Maximum Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-100">{stats.maxLicenses}</div>
            <p className="text-red-300 text-sm mt-1">License limit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

