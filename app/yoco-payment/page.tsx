"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Script from "next/script"

export default function YocoPaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [sdkLoaded, setSdkLoaded] = useState(false)

  // Initialize Yoco SDK when component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && sdkLoaded) {
      setIsLoading(false)
    }
  }, [sdkLoaded])

  const handlePayment = () => {
    if (typeof window === "undefined" || !window.YocoSDK) {
      setError("Payment system is not available. Please try again later.")
      return
    }

    setIsProcessing(true)
    setError("")

    // Initialize the Yoco SDK with your public key
    const yoco = new window.YocoSDK({
      publicKey: "pk_live_4d1ec9c3lW1VJvZ21724",
    })

    // Create a new payment
    yoco.showPopup({
      amountInCents: 110000, // R1100 in cents
      currency: "ZAR",
      name: "QUICKTRADE PRO",
      description: "Trading Platform License",
      callback: (result) => {
        // This function gets called after the popup is closed
        if (result.error) {
          setError(result.error.message)
          setIsProcessing(false)
        } else {
          // Card successfully tokenized
          // In a real implementation, you would send this token to your server
          // to complete the payment using the secret key
          console.log("Card successfully tokenized:", result.id)

          // For demo purposes, we'll simulate a successful payment
          setTimeout(() => {
            router.push("/payment-success")
          }, 1000)
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Script
        src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js"
        onLoad={() => setSdkLoaded(true)}
        onError={() => {
          setError("Failed to load payment system. Please try again later.")
          setIsLoading(false)
        }}
      />

      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center mb-8 justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
            alt="QUICKTRADE PRO Logo"
            width={80}
            height={80}
            className="mr-2"
          />
          <span className="text-xl font-bold text-red-500 neon-text">QUICKTRADE PRO</span>
        </Link>

        <Card className="bg-black border border-red-500 glow-border">
          <CardHeader>
            <CardTitle className="text-2xl text-red-500 neon-text">Yoco Payment</CardTitle>
            <CardDescription className="text-red-300">
              Complete your purchase of QUICKTRADE PRO for R1100
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
                <p className="text-red-300">Loading payment system...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4">
                    {error}
                  </div>
                )}

                <div className="bg-black/80 border border-red-500/30 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-red-300">Product:</span>
                    <span className="text-white">QUICKTRADE PRO License</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-red-300">Price:</span>
                    <span className="text-white font-bold">R1100.00</span>
                  </div>
                </div>

                <div className="text-center text-red-300 text-sm">
                  <p>You will be redirected to Yoco's secure payment page to complete your purchase.</p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-[#0F1A4F] hover:bg-[#1a2a6c] text-white font-bold py-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay with Yoco"
                  )}
                </Button>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-red-900/30 pt-4">
            <div className="text-center text-red-400 text-sm">
              <p>By completing this purchase, you agree to our</p>
              <div className="flex justify-center space-x-2">
                <Link href="/terms" className="text-red-300 hover:text-red-200 underline">
                  Terms of Service
                </Link>
                <span>and</span>
                <Link href="/privacy" className="text-red-300 hover:text-red-200 underline">
                  Privacy Policy
                </Link>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-950"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

