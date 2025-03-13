"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { LayoutDashboard, KeyRound, BarChart3, Settings, LogOut, Menu, X, Gift } from "lucide-react"
import { useState, useEffect } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  useEffect(() => {
    // Reset avatar error when user changes
    if (user) {
      setAvatarError(false)
    }
  }, [user])

  const routes = [
    {
      icon: LayoutDashboard,
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      icon: KeyRound,
      href: "/dashboard/generate-key",
      label: "Generate Key",
    },
    {
      icon: BarChart3,
      href: "/dashboard/key-stats",
      label: "Key Stats",
    },
    {
      icon: Settings,
      href: "/dashboard/manage-eas",
      label: "Manage EAs",
    },
    {
      icon: Gift,
      href: "/dashboard/rewards",
      label: "Rewards",
    },
    {
      icon: Settings,
      href: "/dashboard/profile",
      label: "Profile",
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-red-950 text-white md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar for mobile (overlay) */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="fixed inset-y-0 left-0 w-64 bg-black border-r border-red-900 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {user?.avatar && !avatarError ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-3"
                  onError={() => setAvatarError(true)}
                />
              ) : null}
              <h1 className="text-xl font-bold text-red-500 neon-text">QUICKTRADE PRO</h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-red-400">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-x-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 rounded-md p-3 transition-colors",
                  pathname === route.href && "bg-red-950/50 text-red-200",
                )}
              >
                <route.icon size={20} />
                <span>{route.label}</span>
              </Link>
            ))}

            <button
              onClick={logout}
              className="flex items-center gap-x-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 rounded-md p-3 transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop (permanent) */}
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <div className="h-full border-r border-red-900 bg-black flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-x-3 mb-8">
              {user?.avatar && !avatarError ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                  onError={() => setAvatarError(true)}
                />
              ) : null}
              <h1 className="text-xl font-bold text-red-500 neon-text">QUICKTRADE PRO</h1>
            </div>

            <nav className="space-y-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-x-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 rounded-md p-3 transition-colors",
                    pathname === route.href && "bg-red-950/50 text-red-200",
                  )}
                >
                  <route.icon size={20} />
                  <span>{route.label}</span>
                </Link>
              ))}

              <button
                onClick={logout}
                className="flex items-center gap-x-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 rounded-md p-3 transition-colors w-full"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

