export function generateMentorId(): number {
  // Generate a random 6-digit number for the mentor ID
  return Math.floor(100000 + Math.random() * 900000)
}

export function generateLicenseKey(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let key = ""

  for (let i = 0; i < 4; i++) {
    let segment = ""
    for (let j = 0; j < 4; j++) {
      segment += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    key += segment
    if (i < 3) {
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

export function getLicenseStatus(licenseKey: string): "active" | "used" | null {
  // Simulate checking the license status
  // In a real application, this would involve querying a database or external service

  // For demonstration purposes, we'll just return "active" if the key starts with "ACT"
  if (licenseKey.startsWith("ACT")) {
    return "active"
  } else if (licenseKey.startsWith("USED")) {
    return "used"
  }

  return null
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
      return plan
  }
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

export function cn(...inputs: any[]): string {
  return inputs.filter(Boolean).join(" ")
}

