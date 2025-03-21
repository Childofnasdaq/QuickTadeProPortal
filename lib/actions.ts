"use server"

import { connectToDatabase, generateId, initializeDatabase } from "./mongodb"
import type { User, EA, LicenseKey, Stats } from "./types"
import { generateMentorId, generateLicenseKey, calculateExpiryDate } from "./utils"

// Initialize the database when the server starts
initializeDatabase().catch((error) => {
  console.error("Failed to initialize database:", error)
})

// USER MANAGEMENT
// Enhance the createUserAction function with better error handling and logging
export async function createUserAction(
  userData: Omit<User, "id" | "mentorId" | "approved" | "isAdmin"> & { password: string },
): Promise<{ user: User | null; error: string | null }> {
  try {
    console.log("Connecting to MongoDB for user creation...")
    const { db } = await connectToDatabase()
    console.log("Connected to MongoDB successfully")

    // Check if user with this email already exists
    console.log(`Checking if email ${userData.email} already exists`)
    const existingUser = await db.collection("users").findOne({
      email: { $regex: new RegExp(`^${userData.email}$`, "i") },
    })

    if (existingUser) {
      console.log("Email already exists in database")
      return { user: null, error: "Email already exists" }
    }

    // Generate a unique ID
    const userId = await generateId()
    console.log(`Generated user ID: ${userId}`)

    // Create new user
    const newUser: User = {
      id: userId,
      mentorId: generateMentorId(),
      email: userData.email.toLowerCase(),
      name: userData.name,
      displayName: userData.displayName,
      phone: userData.phone || "",
      approved: true,
      isAdmin: false,
      password: userData.password, // In production, hash this password
      createdAt: new Date(),
    }

    console.log("Attempting to insert user into MongoDB...")
    // Insert the user into the database
    try {
      const result = await db.collection("users").insertOne(newUser)

      // Check if the insertion was successful
      if (!result.acknowledged) {
        console.error("MongoDB did not acknowledge the insertion")
        return { user: null, error: "Failed to insert user into database" }
      }

      console.log(`User created successfully with ID: ${userId}`)

      // Verify the user was actually inserted
      const insertedUser = await db.collection("users").findOne({ id: userId })
      if (!insertedUser) {
        console.error("User was not found in database after insertion")
        return { user: null, error: "User was not found in database after insertion" }
      }

      console.log(
        `Verified user in database: ${JSON.stringify({
          id: insertedUser.id,
          email: insertedUser.email,
          name: insertedUser.name,
        })}`,
      )

      return { user: newUser, error: null }
    } catch (dbError) {
      console.error("Database error during user insertion:", dbError)
      return { user: null, error: `Database error: ${dbError instanceof Error ? dbError.message : String(dbError)}` }
    }
  } catch (error) {
    console.error("Detailed error creating user:", error)
    // Return the specific error message for better debugging
    return {
      user: null,
      error: error instanceof Error ? error.message : "An unknown error occurred during user creation",
    }
  }
}

// Enhance the authenticateUserAction function with better debugging
export async function authenticateUserAction(email: string, password: string): Promise<User | null> {
  try {
    console.log(`Attempting to authenticate user: ${email}`)

    try {
      const { db } = await connectToDatabase()
      console.log("MongoDB connection successful for authentication")

      // Find user by email (case insensitive)
      console.log(`Searching for user with email: ${email}`)
      const user = await db.collection("users").findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      })

      if (!user) {
        console.log(`No user found with email: ${email}`)
        return null
      }

      console.log(
        `User found in MongoDB: ${JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          hasPassword: !!user.password,
        })}`,
      )

      // Check password match
      if (user.password !== password) {
        console.log(`Password mismatch for user: ${email}`)
        return null
      }

      console.log(`User authenticated successfully: ${email}`)
      return user as User
    } catch (dbError) {
      console.error("MongoDB error during authentication:", dbError)
      console.log("Authentication failed due to database error, returning null")
      return null
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function updateUserProfileAction(userId: string, userData: Partial<User>): Promise<boolean> {
  try {
    console.log(`Updating profile for user ID: ${userId}`)
    const { db } = await connectToDatabase()

    // Update user document
    const result = await db
      .collection("users")
      .updateOne({ id: userId }, { $set: { ...userData, updatedAt: new Date() } })

    console.log(
      `Update result: ${JSON.stringify({
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        acknowledged: result.acknowledged,
      })}`,
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Update profile error:", error)
    return false
  }
}

// EA MANAGEMENT
export async function getEAsAction(userId: string): Promise<EA[]> {
  try {
    const { db } = await connectToDatabase()

    const eas = await db.collection("eas").find({ createdBy: userId }).toArray()

    return eas as EA[]
  } catch (error) {
    console.error("Error fetching EAs:", error)
    return []
  }
}

export async function addEAAction(userId: string, name: string): Promise<EA | null> {
  try {
    const { db } = await connectToDatabase()

    const newEA: EA = {
      id: await generateId(),
      name,
      createdAt: new Date(),
      createdBy: userId,
    }

    await db.collection("eas").insertOne(newEA)
    return newEA
  } catch (error) {
    console.error("Error adding EA:", error)
    return null
  }
}

export async function deleteEAAction(userId: string, eaId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()

    // Check if EA is in use by any license keys
    const usedKey = await db.collection("licenseKeys").findOne({ eaId, createdBy: userId })
    if (usedKey) {
      return false
    }

    const result = await db.collection("eas").deleteOne({ id: eaId, createdBy: userId })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting EA:", error)
    return false
  }
}

// LICENSE KEY MANAGEMENT
export async function getLicenseKeysAction(userId: string): Promise<LicenseKey[]> {
  try {
    const { db } = await connectToDatabase()

    const keys = await db.collection("licenseKeys").find({ createdBy: userId }).toArray()

    return keys as LicenseKey[]
  } catch (error) {
    console.error("Error fetching license keys:", error)
    return []
  }
}

export async function generateNewLicenseKeyAction(
  userId: string,
  username: string,
  eaId: string,
  plan: string,
): Promise<LicenseKey | null> {
  try {
    const { db } = await connectToDatabase()

    // Find the EA
    const ea = await db.collection("eas").findOne({ id: eaId, createdBy: userId })
    if (!ea) {
      return null
    }

    // Generate the license key
    const key = generateLicenseKey()
    const createdAt = new Date()
    const expiryDate = calculateExpiryDate(plan, createdAt)

    const newLicenseKey: LicenseKey = {
      id: await generateId(),
      key,
      username,
      eaId,
      eaName: ea.name,
      plan,
      status: "active",
      createdAt,
      expiryDate,
      createdBy: userId,
    }

    await db.collection("licenseKeys").insertOne(newLicenseKey)
    return newLicenseKey
  } catch (error) {
    console.error("Error generating license key:", error)
    return null
  }
}

export async function deleteLicenseKeyAction(userId: string, keyId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("licenseKeys").deleteOne({ id: keyId, createdBy: userId })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting license key:", error)
    return false
  }
}

export async function deactivateLicenseKeyAction(userId: string, keyId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()

    const result = await db
      .collection("licenseKeys")
      .updateOne({ id: keyId, createdBy: userId }, { $set: { status: "inactive", updatedAt: new Date() } })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error deactivating license key:", error)
    return false
  }
}

// STATISTICS
export async function getStatsAction(userId: string): Promise<Stats> {
  try {
    const { db } = await connectToDatabase()

    const totalEAs = await db.collection("eas").countDocuments({ createdBy: userId })
    const totalLicenses = await db.collection("licenseKeys").countDocuments({ createdBy: userId })
    const activeSubscriptions = await db.collection("licenseKeys").countDocuments({
      createdBy: userId,
      status: "active",
    })

    return {
      totalEAs,
      totalLicenses,
      activeSubscriptions,
      maxLicenses: 10000,
    }
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

