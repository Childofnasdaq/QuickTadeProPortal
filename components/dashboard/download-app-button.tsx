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
import Link from "next/link"

export function DownloadAppButton() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

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
            <DialogDescription className="text-red-300">Purchase the app for $60 USD</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Button asChild className="bg-[#0b2e82] hover:bg-[#0a2971] text-white font-bold">
                <a
                  href="https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=27246195&item_name=QUICKTRADE+PRO&amount=60&return_url=https://childofnasdaqofficial.co.za/payment-success&cancel_url=https://childofnasdaqofficial.co.za/payment-cancel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pay with PayFast
                </a>
              </Button>

              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold"
                onClick={() => setPaymentDialogOpen(false)}
              >
                <Link href="/payment">Pay with Credit Card</Link>
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

