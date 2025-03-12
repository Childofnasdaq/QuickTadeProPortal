"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { useData } from "@/components/data-provider"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const { userData } = useAuth()
  const { stats } = useData()
  const today = formatDate(new Date())

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-red-400">Today ({today})</p>
      </div>

      {/* Status Message */}
      <Card className="mb-4 bg-[#1a0f0f] border-red-900/50">
        <CardContent className="p-3">
          <p className="text-green-400 text-sm">
            All systems are running smoothly! You have {stats?.activeSubscriptions || 0} active licenses. Your Mentor id
            is → {userData?.mentorId || "3222"}
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Licenses */}
        <Card className="bg-[#0a1929] border-blue-900/50">
          <CardContent className="p-4">
            <h2 className="text-4xl font-bold text-white mb-1">{stats?.totalLicenses || 0}</h2>
            <p className="text-blue-400 text-sm">All time EA users</p>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card className="bg-[#0a2918] border-green-900/50">
          <CardContent className="p-4">
            <h2 className="text-4xl font-bold text-white mb-1">{stats?.activeSubscriptions || 0}</h2>
            <p className="text-green-400 text-sm">Current Active EA Users</p>
          </CardContent>
        </Card>

        {/* Total EAs */}
        <Card className="bg-[#1a0f29] border-purple-900/50">
          <CardContent className="p-4">
            <h2 className="text-4xl font-bold text-white mb-1">{stats?.totalEAs || 0}</h2>
            <p className="text-purple-400 text-sm">All EAs you are Licensing</p>
          </CardContent>
        </Card>

        {/* Maximum Licenses */}
        <Card className="bg-[#290f0f] border-red-900/50">
          <CardContent className="p-4">
            <h2 className="text-4xl font-bold text-white mb-1">{stats?.maxLicenses || 10000}</h2>
            <p className="text-red-400 text-sm">Total licenses You can generate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

