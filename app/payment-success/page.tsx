"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const router = useRouter()

  // Redirect to dashboard after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
            alt="QUICKTRADE PRO Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </Link>

        <div className="bg-black border border-green-500 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-green-400 mb-4">Payment Successful!</h1>
          <p className="text-green-300 mb-6">
            Thank you for your purchase of QuickTradePro App (R1100). Your download link has been sent to your email.
          </p>
          <p className="text-red-300 mb-8">You will be redirected to the dashboard in a few seconds...</p>

          <div className="flex flex-col gap-4">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/dashboard">Go to Dashboard Now</Link>
            </Button>

            <Button asChild variant="outline" className="border-red-500 text-red-400 hover:bg-red-950">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

