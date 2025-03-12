"use client"

import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Settings, LogOut } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  useEffect(() => {
    // Reset avatar error when user changes
    if (user) {
      setAvatarError(false)
    }
  }, [user])

  if (!user) return null

  return (
    <div className="flex items-center justify-end p-4 border-b border-red-900">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-950/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white overflow-hidden">
            {user.avatar && !avatarError ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.displayName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <User size={18} />
            )}
          </div>
          <span className="text-red-200 hidden sm:inline-block">{user.email}</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-black border border-red-900 rounded-md shadow-lg z-50">
            <div className="p-3 border-b border-red-900">
              <p className="text-red-200 font-medium">{user.displayName}</p>
              <p className="text-red-400 text-sm">Mentor ID: {user.mentorId}</p>
            </div>
            <div className="p-1">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-x-2 p-2 text-red-300 hover:bg-red-950/30 rounded-md"
                onClick={() => setShowDropdown(false)}
              >
                <Settings size={16} />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  setShowDropdown(false)
                  logout()
                }}
                className="flex items-center gap-x-2 p-2 text-red-300 hover:bg-red-950/30 rounded-md w-full text-left"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

