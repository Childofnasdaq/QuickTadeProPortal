"use client"

import type React from "react"
import { useEffect } from "react"

// Import the app integration utilities
import { isRunningInApp, sendToApp } from "@/lib/app-integration"

const MainApp: React.FC = () => {
  useEffect(() => {
    // Check if running in mobile app
    if (isRunningInApp()) {
      // Notify app that web interface is ready
      sendToApp("web_ready", { timestamp: Date.now() })

      // Set app-specific configurations
      document.documentElement.classList.add("app-mode")
    }
  }, [])

  return (
    <div>
      <h1>Main App</h1>
      <p>This is the main application component.</p>
    </div>
  )
}

export default MainApp

