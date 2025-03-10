// License service to handle license key validation and generation

export type LicenseInfo = {
  key: string
  mentorId: string
  isValid: boolean
  expiresAt?: Date
  features?: string[]
  maxEAs?: number
}

// Validate a license key against the mentor ID
export async function validateLicenseKey(key: string, mentorId: string): Promise<LicenseInfo> {
  try {
    // In a real implementation, this would make an API call to validate the license
    // For demo purposes, we'll simulate the validation

    // Check if the key format is valid (simple check for demo)
    if (!key.match(/^QTP-\d{4}-\d{4}-\d{4}$/)) {
      return {
        key,
        mentorId,
        isValid: false,
      }
    }

    // Check if the key is associated with the mentor ID
    // In a real implementation, this would check against a database
    const keyParts = key.split("-")
    const mentorPart = keyParts[1]

    if (mentorPart !== mentorId.substring(0, 4)) {
      return {
        key,
        mentorId,
        isValid: false,
      }
    }

    // If we get here, the key is valid
    return {
      key,
      mentorId,
      isValid: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      features: ["license_generation", "ea_management", "analytics"],
      maxEAs: 10,
    }
  } catch (error) {
    console.error("License validation error:", error)
    return {
      key,
      mentorId,
      isValid: false,
    }
  }
}

// Generate a new license key for a mentor
export function generateLicenseKey(mentorId: string): string {
  // Extract first 4 digits of mentor ID or pad with zeros
  const mentorPart = mentorId.padStart(4, "0").substring(0, 4)

  // Generate random parts for the rest of the key
  const randomPart1 = Math.floor(1000 + Math.random() * 9000)
  const randomPart2 = Math.floor(1000 + Math.random() * 9000)

  // Format the key
  return `QTP-${mentorPart}-${randomPart1}-${randomPart2}`
}

