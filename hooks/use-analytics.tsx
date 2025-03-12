"use client"

import { useEffect, useState } from "react"
import { initializeAnalytics } from "@/lib/firebase"

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    // Only initialize analytics on the client side
    const analyticsInstance = initializeAnalytics()
    setAnalytics(analyticsInstance)
  }, [])

  return analytics
}

