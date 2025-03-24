import { NextResponse } from "next/server"

// IMPORTANT: Never expose this key in client-side code
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ success: false, error: "Payment token is required" }, { status: 400 })
    }

    // Process the payment with Yoco API
    const response = await fetch("https://online.yoco.com/v1/charges/", {
      method: "POST",
      headers: {
        "X-Auth-Secret-Key": YOCO_SECRET_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        amountInCents: 110000, // R1100
        currency: "ZAR",
        metadata: {
          productName: "QuickTradePro App",
          customerEmail: body.email || "customer@example.com",
        },
      }),
    })

    const result = await response.json()

    // Check for errors or declined status
    if (result.error) {
      console.error("Yoco payment error:", result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error.message || "Payment declined",
          status: "declined",
        },
        { status: 400 },
      )
    }

    // Check payment status
    if (result.status !== "successful") {
      return NextResponse.json(
        {
          success: false,
          error: `Payment ${result.status}`,
          status: result.status,
        },
        { status: 400 },
      )
    }

    // Payment successful
    return NextResponse.json({
      success: true,
      paymentId: result.id,
      status: result.status,
    })
  } catch (error) {
    console.error("Server error processing payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process payment",
        status: "error",
      },
      { status: 500 },
    )
  }
}

