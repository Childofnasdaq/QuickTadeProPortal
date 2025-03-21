"use server"

import { MongoClient } from "mongodb"

// The MongoDB connection string
const uri =
  "mongodb+srv://childofnasdaq:Godfirst078@cluster0.a5kt9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

export async function testMongoDBConnection() {
  console.log("Starting MongoDB connection test...")

  let client: MongoClient | null = null
  try {
    console.log("Creating MongoDB client with URI:", uri)
    client = new MongoClient(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 60000,
    })

    console.log("Attempting to connect to MongoDB...")
    await client.connect()
    console.log("MongoDB connection successful!")

    // Test database access
    const dbName = "quicktradepro"
    console.log(`Accessing database: ${dbName}`)
    const db = client.db(dbName)

    // Test a simple command
    console.log("Testing database with ping command...")
    const pingResult = await db.command({ ping: 1 })
    console.log("Ping result:", pingResult)

    // List collections
    console.log("Listing collections...")
    const collections = await db.listCollections().toArray()
    console.log(
      "Collections:",
      collections.map((c) => c.name),
    )

    // Check if users collection exists and try to count documents
    if (collections.some((c) => c.name === "users")) {
      console.log("Counting users...")
      const userCount = await db.collection("users").countDocuments()
      console.log(`Found ${userCount} users in the database`)

      // Try to get one user
      if (userCount > 0) {
        const sampleUser = await db.collection("users").findOne({}, { projection: { password: 0 } })
        console.log("Sample user (without password):", sampleUser)
      }
    }

    return {
      success: true,
      message: "MongoDB connection test successful",
      details: {
        collections: collections.map((c) => c.name),
      },
    }
  } catch (error) {
    console.error("MongoDB connection test failed:", error)
    return {
      success: false,
      message: "MongoDB connection test failed",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }
  } finally {
    if (client) {
      console.log("Closing MongoDB connection...")
      await client.close()
      console.log("MongoDB connection closed")
    }
  }
}

