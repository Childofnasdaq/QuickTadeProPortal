/**
 * QuickTrade Pro App Integration
 * This file contains utilities for integrating with the Android/iOS mobile app
 */

// Check if running in mobile app webview
export function isRunningInApp(): boolean {
  if (typeof window === "undefined") return false

  // Check for app's user agent or custom parameters
  const userAgent = window.navigator.userAgent.toLowerCase()
  const urlParams = new URLSearchParams(window.location.search)

  return (
    userAgent.includes("quicktradepro-app") || urlParams.has("app-view") || localStorage.getItem("app_mode") === "true"
  )
}

// Send message to native app
export function sendToApp(action: string, data: any): void {
  if (typeof window === "undefined") return

  try {
    // For Android WebView communication
    if (window.QuickTradeApp && typeof window.QuickTradeApp.postMessage === "function") {
      window.QuickTradeApp.postMessage(JSON.stringify({ action, data }))
    }
    // For iOS WebView communication
    else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.quickTradeApp) {
      window.webkit.messageHandlers.quickTradeApp.postMessage(JSON.stringify({ action, data }))
    }
    // Fallback - post message to window for debugging
    else {
      window.postMessage({ source: "quicktrade-web", action, data }, "*")
    }
  } catch (error) {
    console.error("Error sending message to app:", error)
  }
}

// Receive message from native app
export function setupAppMessageListener(callback: (action: string, data: any) => void): () => void {
  if (typeof window === "undefined") return () => {}

  const messageHandler = (event: MessageEvent) => {
    // Validate message source for security
    if (event.data && event.data.source === "quicktrade-app") {
      callback(event.data.action, event.data.data)
    }
  }

  window.addEventListener("message", messageHandler)

  // Return cleanup function
  return () => window.removeEventListener("message", messageHandler)
}

// Handle app authentication
export function handleAppAuthentication(mentorId: string, licenseKey: string): void {
  // Store app credentials
  localStorage.setItem("app_mentor_id", mentorId)
  localStorage.setItem("app_license_key", licenseKey)
  localStorage.setItem("app_mode", "true")

  // Notify app of successful authentication
  sendToApp("auth_success", { mentorId, timestamp: Date.now() })
}

// Check if user has valid app credentials
export function hasValidAppCredentials(): boolean {
  if (typeof window === "undefined") return false

  const mentorId = localStorage.getItem("app_mentor_id")
  const licenseKey = localStorage.getItem("app_license_key")

  return !!mentorId && !!licenseKey
}

// Types for TypeScript integration with native app
declare global {
  interface Window {
    QuickTradeApp?: {
      postMessage: (message: string) => void
    }
    webkit?: {
      messageHandlers: {
        quickTradeApp: {
          postMessage: (message: any) => void
        }
      }
    }
  }
}

