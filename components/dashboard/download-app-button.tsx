"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
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

  const handleYocoPayment = () => {
    setPaymentDialogOpen(false)
    router.push("/yoco-payment")
  }

  const handleCreditCardPayment = () => {
    setPaymentDialogOpen(false)
    router.push("/payment")
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
            <DialogDescription className="text-red-300">Purchase the app for R1100</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Button className="bg-[#0F1A4F] hover:bg-[#1a2a6c] text-white font-bold" onClick={handleYocoPayment}>
                Pay with Yoco
              </Button>

              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold"
                onClick={handleCreditCardPayment}
              >
                Pay with Credit Card
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

