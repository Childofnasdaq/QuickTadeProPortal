"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  const router = useRouter()

  // Redirect to home after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 10000)

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

        <div className="bg-black border border-red-500 rounded-lg p-8 shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-4">Payment Unsuccessful</h1>
          <p className="text-red-300 mb-6">
            Your payment for QUICKTRADE PRO was not successful. This could be due to insufficient funds, a declined
            card, or another payment issue. No charges have been made to your account.
          </p>
          <p className="text-gray-400 mb-8">You will be redirected to the home page in a few seconds...</p>

          <div className="flex flex-col gap-4">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/yoco-payment">Try Payment Again</Link>
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
