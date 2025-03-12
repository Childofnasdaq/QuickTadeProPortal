import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

