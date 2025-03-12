import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function getPlanDisplayName(plan: string): string {
  const planMap: Record<string, string> = {
    "3days": "3 Days",
    "5days": "5 Days",
    "30days": "30 Days",
    "3months": "3 Months",
    "6months": "6 Months",
    "1year": "1 Year",
    lifetime: "Lifetime",
  }

  return planMap[plan] || plan
}

export function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let key = ""

  // Generate 5 groups of 5 characters separated by hyphens
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if (i < 4) key += "-"
  }

  return key
}

export function calculateExpiryDate(plan: string, startDate: Date): Date {
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
      // Set to a far future date for "lifetime" (e.g., 100 years)
      expiryDate.setFullYear(expiryDate.getFullYear() + 100)
      break
    default:
      // Default to 30 days if plan is not recognized
      expiryDate.setDate(expiryDate.getDate() + 30)
  }

  return expiryDate
}

// Generate a unique mentor ID (6-digit number)
export function generateMentorId(): number {
  // Generate a random 6-digit number between 100000 and 999999
  return Math.floor(100000 + Math.random() * 900000)
}

