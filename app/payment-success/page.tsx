"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const downloadLink =
    "https://upload.app/api/download?sha256=275f56f6d7e81e1cc65cfbddedd48cd679b0a85f11a357d52f6019993cd3a0d8&download_id=upload_57735465-aa8e-4ead-bb5f-0eedcd365961&token=9ffa97510e06f02d5a9e639824dadddc67e1cde1"

  // Redirect to dashboard after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 15000)

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
          <p className="text-green-300 mb-6">Thank you for your purchase of QuickTradePro App (R1100).</p>

          {/* Download Button */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-300 mb-2">Download Your App</h2>
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              <a href={downloadLink} download>
                <Download className="h-5 w-5" />
                Download QuickTradePro App
              </a>
            </Button>
            <p className="text-green-200 text-sm mt-2">Click the button above to download the app immediately.</p>
          </div>

          <p className="text-red-300 mb-6">You will be redirected to the dashboard in a few seconds...</p>

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

