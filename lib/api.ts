import type { User, EA, LicenseKey, Stats } from "./types"
import {
  createUserAction,
  authenticateUserAction,
  updateUserProfileAction,
  getEAsAction,
  addEAAction,
  deleteEAAction,
  getLicenseKeysAction,
  generateNewLicenseKeyAction,
  deleteLicenseKeyAction,
  deactivateLicenseKeyAction,
  getStatsAction,
} from "./actions"

// Constants for localStorage
const LOCAL_STORAGE_USER_KEY = "quicktradepro_user"
const LOCAL_STORAGE_REGISTERED_USERS = "quicktradepro_registered_users"

// Helper function to generate a unique ID (client-side version)
function generateClientId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// USER MANAGEMENT
export async function createUser(
  userData: Omit<User, "id" | "mentorId" | "approved" | "isAdmin"> & { password: string },
): Promise<{ success: boolean; user: User | null; error: string | null }> {
  try {
    console.log(`API: Creating user: ${userData.email}`)
    const result = await createUserAction(userData)

    if (result.error) {
      console.error("User creation error:", result.error)
      return { success: false, user: null, error: result.error }
    }

    // Store the user in localStorage for fallback authentication
    try {
      const savedUsers = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS) || "[]"
      const users = JSON.parse(savedUsers)
      const userWithPassword = { ...result.user, password: userData.password }

      // Check if user already exists
      const existingIndex = users.findIndex((u: User) => u.email.toLowerCase() === userData.email.toLowerCase())

      if (existingIndex >= 0) {
        // Update existing user
        users[existingIndex] = userWithPassword
      } else {
        // Add new user
        users.push(userWithPassword)
      }

      localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS, JSON.stringify(users))
      console.log(`API: Saved user to localStorage for fallback: ${userData.email}`)
    } catch (e) {
      console.error("Error saving to localStorage:", e)
    }

    return { success: true, user: result.user, error: null }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    console.log(`API: Attempting to authenticate user: ${email}`)

    // First try server authentication
    const user = await authenticateUserAction(email, password)

    if (user) {
      console.log(`API: Server authentication successful for: ${email}`)
      return user
    }

    // If server auth fails, try localStorage as fallback
    console.log(`API: Server authentication failed, trying localStorage fallback`)
    try {
      const savedUsers = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS)
      if (savedUsers) {
        const users = JSON.parse(savedUsers)
        const localUser = users.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        )

        if (localUser) {
          console.log(`API: Found user in localStorage: ${email}`)
          return localUser
        } else {
          console.log(`API: User not found in localStorage or password mismatch: ${email}`)
        }
      }
    } catch (e) {
      console.error("Error checking localStorage:", e)
    }

    console.log(`API: Authentication failed for: ${email}`)
    return null
  } catch (error) {
    console.error("API: Authentication error:", error)
    return null
  }
}

export async function updateUserProfile(userId: string, userData: Partial<User>): Promise<boolean> {
  try {
    console.log(`API: Updating profile for user ID: ${userId}`)
    const success = await updateUserProfileAction(userId, userData)
    console.log(`API: Profile update result: ${success}`)

    // If server update fails, update localStorage as fallback
    if (!success) {
      try {
        console.log(`API: Server update failed, updating localStorage`)
        const currentUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
        if (currentUser) {
          const user = JSON.parse(currentUser)
          const updatedUser = { ...user, ...userData }
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser))

          // Also update in registered users
          const savedUsers = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS)
          if (savedUsers) {
            const users = JSON.parse(savedUsers)
            const userIndex = users.findIndex((u: any) => u.id === userId)
            if (userIndex >= 0) {
              users[userIndex] = { ...users[userIndex], ...userData }
              localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS, JSON.stringify(users))
            }
          }

          console.log(`API: Updated user in localStorage`)
          return true
        }
      } catch (e) {
        console.error("Error updating localStorage:", e)
      }
    }

    return success
  } catch (error) {
    console.error("Update profile error:", error)
    return false
  }
}

// EA MANAGEMENT
export async function getEAs(userId: string): Promise<EA[]> {
  try {
    return await getEAsAction(userId)
  } catch (error) {
    console.error("Error fetching EAs:", error)
    return []
  }
}

export async function addEA(userId: string, name: string): Promise<EA | null> {
  try {
    return await addEAAction(userId, name)
  } catch (error) {
    console.error("Error adding EA:", error)
    return null
  }
}

export async function deleteEA(userId: string, eaId: string): Promise<boolean> {
  try {
    return await deleteEAAction(userId, eaId)
  } catch (error) {
    console.error("Error deleting EA:", error)
    return false
  }
}

// LICENSE KEY MANAGEMENT
export async function getLicenseKeys(userId: string): Promise<LicenseKey[]> {
  try {
    return await getLicenseKeysAction(userId)
  } catch (error) {
    console.error("Error fetching license keys:", error)
    return []
  }
}

export async function generateNewLicenseKey(
  userId: string,
  username: string,
  eaId: string,
  plan: string,
): Promise<LicenseKey | null> {
  try {
    return await generateNewLicenseKeyAction(userId, username, eaId, plan)
  } catch (error) {
    console.error("Error generating license key:", error)
    return null
  }
}

export async function deleteLicenseKey(userId: string, keyId: string): Promise<boolean> {
  try {
    return await deleteLicenseKeyAction(userId, keyId)
  } catch (error) {
    console.error("Error deleting license key:", error)
    return false
  }
}

export async function deactivateLicenseKey(userId: string, keyId: string): Promise<boolean> {
  try {
    return await deactivateLicenseKeyAction(userId, keyId)
  } catch (error) {
    console.error("Error deactivating license key:", error)
    return false
  }
}

// STATISTICS
export async function getStats(userId: string): Promise<Stats> {
  try {
    return await getStatsAction(userId)
  } catch (error) {
    console.error("Error getting stats:", error)
    return {
      totalEAs: 0,
      totalLicenses: 0,
      activeSubscriptions: 0,
      maxLicenses: 10000,
    }
  }
}

// For server-side payment processing (would be used in a real implementation)
export async function processYocoPayment(token: string, amount: number, description: string) {
  try {
    // This would be a server-side API route in a real implementation
    // Using the secret key to process the payment
    // For now, we'll simulate a successful payment
    return {
      success: true,
      transactionId: "sim_" + generateClientId(),
      message: "Payment processed successfully",
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    return {
      success: false,
      message: "Payment processing failed",
    }
  }
}

