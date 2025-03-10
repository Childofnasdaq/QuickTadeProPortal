import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { DataProvider } from "@/components/data-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QUICKTRADE PRO",
  description: "Professional Trading License Management Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'