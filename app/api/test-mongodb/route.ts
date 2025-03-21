import { NextResponse } from "next/server"
import { testMongoDBConnection } from "@/lib/mongodb-test"

export async function GET() {
  try {
    const result = await testMongoDBConnection()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in MongoDB test API route:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Error in MongoDB test API route",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

