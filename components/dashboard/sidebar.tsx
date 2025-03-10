"use client"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { LayoutDashboard, Key, Users, BarChart, LogOut, Menu, X, User } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      icon: LayoutDashboard,
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      icon: Key,
      href: "/dashboard/generate-key",
      label: "Generate key",
    },
    {
      icon: Users,
      href: "/dashboard/manage-eas",
      label: "Manage EAs",
    },
    {
      icon: BarChart,
      href: "/dashboard/key-stats",
      label: "Key Stats",
    },
    {
      icon: User,
      href: "/dashboard/profile",
      label: "Profile",
    },
  ]

  // Function to handle navigation
  const handleNavigation = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

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
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <button onClick={() => setIsOpen(false)} className="text-red-400">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-6">
            {routes.map((route) => (
              <button
                key={route.href}
                onClick={() => handleNavigation(route.href)}
                className={cn(
                  "flex w-full items-center gap-x-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 rounded-md p-3 transition-colors text-left",
                  pathname === route.href && "bg-red-950/50 text-red-200",
                )}
              >
                <route.icon size={20} />
                <span>{route.label}</span>
              </button>
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
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <h1 className="text-xl font-bold text-red-500 neon-text">QUICKTRADE PRO</h1>
            </div>

            <nav className="space-y-6">
              {routes.map((route) => (
                <button
                  key={route.href}
                  onClick={() => handleNavigation(route.href)}
                  className={cn(
                    "flex w-full items-center gap-x-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 rounded-md p-3 transition-colors text-left",
                    pathname === route.href && "bg-red-950/50 text-red-200",
                  )}
                >
                  <route.icon size={20} />
                  <span>{route.label}</span>
                </button>
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

