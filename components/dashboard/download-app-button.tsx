"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export function DownloadAppButton() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const router = useRouter()

  const downloadLink =
    "https://upload.app/api/download?sha256=275f56f6d7e81e1cc65cfbddedd48cd679b0a85f11a357d52f6019993cd3a0d8&download_id=upload_57735465-aa8e-4ead-bb5f-0eedcd365961&token=9ffa97510e06f02d5a9e639824dadddc67e1cde1"

  const handleYocoPayment = () => {
    setPaymentDialogOpen(false)
    router.push("/yoco-payment")
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setPaymentDialogOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full h-14 w-14 shadow-lg"
        >
          <Download className="h-6 w-6" />
        </Button>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-black border border-red-500 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500 text-xl">Download QUICKTRADE PRO</DialogTitle>
            <DialogDescription className="text-red-300">
              <span className="block mb-2">Purchase the app for R1100</span>
              <span className="text-yellow-400 text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Special offer until April 25, 2025 (R2000 after)
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Button className="bg-[#0F1A4F] hover:bg-[#1a2a6c] text-white font-bold" onClick={handleYocoPayment}>
                Pay with Yoco
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
              className="border-red-500 text-red-400"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

