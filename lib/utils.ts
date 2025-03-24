import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function generateMentorId(): number {
  // Generate a random 6-digit number for the mentor ID
  return Math.floor(100000 + Math.random() * 900000)
}

export function generateLicenseKey(): string {
  // Generate a license key in the format: XXXX-XXXX-XXXX-XXXX
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let key = ""

  // Generate 4 groups of 4 characters
  for (let group = 0; group < 4; group++) {
    for (let i = 0; i < 4; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    // Add hyphen between groups (except after the last group)
    if (group < 3) {
      key += "-"
    }
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
    default:
      break
  }

  return expiryDate
}

export function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case "3days":
      return "3 Days"
    case "5days":
      return "5 Days"
    case "30days":
      return "30 Days"
    case "3months":
      return "3 Months"
    case "6months":
      return "6 Months"
    case "1year":
      return "1 Year"
    case "lifetime":
      return "Lifetime"
    default:
      return "Unknown Plan"
  }
}

export function formatDate(date: Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLicenseStatus(licenseKey: string): "active" | "used" {
  // This is a placeholder function that would normally check against a database
  // For now, we'll just return a random status for demonstration
  return Math.random() > 0.5 ? "active" : "used"
}

