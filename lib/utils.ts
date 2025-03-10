import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random mentor ID between 1000 and 9999
export function generateMentorId(): number {
  return Math.floor(Math.random() * 9000) + 1000
}

// Generate a random license key
export function generateLicenseKey(): string {
  const segments = [generateRandomString(3), generateRandomString(3), generateRandomString(3), generateRandomString(3)]
  return segments.join("-")
}

function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Format date to DD-MMM-YYYY
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// Calculate expiry date based on plan
export function calculateExpiryDate(plan: string, startDate: Date = new Date()): Date {
  const expiryDate = new Date(startDate)

  switch (plan) {
    case "3days":
      expiryDate.setDate(expiryDate.getDate() + 3)
      break
    case "5days":
      expiryDate.setDate(expiryDate.getDate() + 5)
      break
    case "30days":
      expiryDate.setDate(expiryDate.getDate() + 30)
      break
    case "3months":
      expiryDate.setMonth(expiryDate.getMonth() + 3)
      break
    case "6months":
      expiryDate.setMonth(expiryDate.getMonth() + 6)
      break
    case "1year":
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      break
    case "lifetime":
      expiryDate.setFullYear(expiryDate.getFullYear() + 100) // Effectively lifetime
      break
    default:
      expiryDate.setMonth(expiryDate.getMonth() + 1) // Default to 1 month
  }

  return expiryDate
}

// Get plan display name
export function getPlanDisplayName(planId: string): string {
  const plans: Record<string, string> = {
    "3days": "3 Days",
    "5days": "5 Days",
    "30days": "30 Days",
    "3months": "3 Months",
    "6months": "6 Months",
    "1year": "1 Year",
    lifetime: "Lifetime",
  }

  return plans[planId] || planId
}

