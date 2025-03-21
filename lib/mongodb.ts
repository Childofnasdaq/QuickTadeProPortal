import { MongoClient } from "mongodb"

// Replace the existing URI with the correct one
const uri =
  "mongodb+srv://childofnasdaq:Godfirst078@cluster0.a5kt9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Add connection options with proper timeout and retry settings
const options = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 60000,
  maxPoolSize: 10,
  minPoolSize: 5,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient>

// Create a global MongoDB client
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("Failed to connect to MongoDB (global promise):", err)
      throw err
    })
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch((err) => {
    console.error("Failed to connect to MongoDB (production):", err)
    throw err
  })
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be safely reused across multiple
// functions.
export default clientPromise

// Enhance the connectToDatabase function with better error handling and logging
export async function connectToDatabase() {
  try {
    console.log("Attempting to connect to MongoDB...")
    const client = await clientPromise
    console.log("MongoDB client connection successful")

    // Use a fixed database name
    const dbName = "quicktradepro"
    console.log(`Using database: ${dbName}`)

    const db = client.db(dbName)
    console.log("Database connection established")

    // Test the connection by running a simple command
    const result = await db.command({ ping: 1 })
    console.log("MongoDB connection test result:", result)

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)

    // Try to provide more specific error information
    let errorMessage = "Unknown MongoDB connection error"
    if (error instanceof Error) {
      errorMessage = error.message

      // Check for common MongoDB connection errors
      if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("ETIMEDOUT")) {
        errorMessage = "Could not reach MongoDB server. Please check your network connection and MongoDB host."
      } else if (errorMessage.includes("Authentication failed")) {
        errorMessage = "MongoDB authentication failed. Please check your username and password."
      } else if (errorMessage.includes("not authorized")) {
        errorMessage = "Not authorized to access this MongoDB database. Please check your permissions."
      }
    }

    throw new Error(`MongoDB connection failed: ${errorMessage}`)
  }
}

// Enhance the initializeDatabase function
export async function initializeDatabase() {
  try {
    console.log("Initializing database collections...")
    const { db } = await connectToDatabase()

    // Get list of collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)
    console.log("Existing collections:", collectionNames)

    // Create users collection if it doesn't exist
    if (!collectionNames.includes("users")) {
      console.log("Creating users collection...")
      await db.createCollection("users")
      // Create an index on email for faster lookups and to enforce uniqueness
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
      console.log("Created users collection with email index")
    }

    // Create eas collection if it doesn't exist
    if (!collectionNames.includes("eas")) {
      console.log("Creating eas collection...")
      await db.createCollection("eas")
      console.log("Created eas collection")
    }

    // Create licenseKeys collection if it doesn't exist
    if (!collectionNames.includes("licenseKeys")) {
      console.log("Creating licenseKeys collection...")
      await db.createCollection("licenseKeys")
      console.log("Created licenseKeys collection")
    }

    console.log("Database initialization complete")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}

export async function generateId(): Promise<string> {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

