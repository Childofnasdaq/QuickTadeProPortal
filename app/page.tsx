"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Star, ExternalLink, Clock } from "lucide-react"
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa"
import { LiveChat } from "@/components/live-chat"
import { FaTelegram } from "react-icons/fa6"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Professional Trader",
    content:
      "QUICKTRADE PRO has revolutionized how I manage my trading licenses. The automated system is incredibly efficient.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "EA Developer",
    content: "As someone who develops EAs, this platform makes license management a breeze. Highly recommended!",
    rating: 5,
  },
  {
    name: "David Smith",
    role: "Trading Mentor",
    content: "The best platform for managing trading licenses. The dashboard is intuitive and feature-rich.",
    rating: 5,
  },
]

export default function LandingPage() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const downloadLink =
    "https://upload.app/api/download?sha256=275f56f6d7e81e1cc65cfbddedd48cd679b0a85f11a357d52f6019993cd3a0d8&download_id=upload_57735465-aa8e-4ead-bb5f-0eedcd365961&token=9ffa97510e06f02d5a9e639824dadddc67e1cde1"

  const handleDownloadButtonClick = () => {
    setPaymentDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-black/50 z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
                alt="QUICKTRADE PRO Logo"
                width={150}
                height={150}
                className="mx-auto lg:mx-0 mb-8"
              />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-red-500 neon-text">QUICKTRADE PRO</h1>
              <p className="text-xl md:text-2xl mb-8 text-red-200">Professional Trading License Management Platform</p>

              {/* Special Offer Banner */}
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 inline-block">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-300 font-medium">Special Offer: R1100 until April 25, 2025</span>
                </div>
                <p className="text-red-400 text-sm mt-1">Price increases to R2000 after this date</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Updated button container with max-width */}
                <div className="max-w-sm mx-auto lg:mx-0 flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50"
                    onClick={handleDownloadButtonClick}
                  >
                    Download App ($60 / R1100)
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-red-500 rounded-lg blur opacity-30"></div>
                  <div className="relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2025-01-29%2021-33-00%20High%20Res%20Screenshot-bor37gSEwwRVMaqmOsJVL1kIoDXC0j.png"
                      alt="Mobile App Preview"
                      width={300}
                      height={600}
                      className="rounded-lg shadow-2xl mx-auto"
                    />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-red-500 rounded-lg blur opacity-30"></div>
                  <div className="relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20250310_091541.jpg-6tpKBBgnidCten0sIX8nXgJpSJAUWm.jpeg"
                      alt="Dashboard Preview"
                      width={600}
                      height={300}
                      className="rounded-lg shadow-2xl mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Broker Section - Updated with JP Markets logo */}
      <div className="py-12 bg-gradient-to-r from-black to-red-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/80 border border-red-500/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500 neon-text mb-4">Recommended Broker</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full md:w-1/3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JPMarkets_Logo%20%281%29-tXthEasNDofncDipbmkM49uxL3ckzo.png"
                  alt="JP Markets Logo"
                  width={300}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="w-full md:w-2/3 text-left">
                <h3 className="text-xl font-semibold text-red-400 mb-2">JP MARKETS</h3>
                <p className="text-gray-300 mb-4">
                  We recommend JP MARKETS as our preferred broker for forex trading. They offer competitive spreads,
                  fast execution, and a reliable trading platform that works seamlessly with our EAs.
                </p>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                  <a
                    href="https://dashboard.jpmarkets.co.za/live_signup?brd=1&sidc=4BECE3A1-F0E1-4AF7-BE81-C02F97FA3D59"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Account with JP MARKETS <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
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
              <Button asChild className="bg-[#0F1A4F] hover:bg-[#1a2a6c] text-white font-bold">
                <Link href="/yoco-payment">Pay with Yoco</Link>
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

      {/* Dashboard Preview Section */}
      <div className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-500 neon-text">Powerful Dashboard</h2>
          <div className="relative">
            <div className="absolute -inset-1 bg-red-500 rounded-lg blur opacity-30"></div>
            <div className="relative bg-black/80 border border-red-500/30 rounded-lg p-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20250310_091541.jpg-6tpKBBgnidCten0sIX8nXgJpSJAUWm.jpeg"
                alt="Dashboard Interface"
                width={1200}
                height={600}
                className="rounded-lg shadow-2xl"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-red-400 mb-2">Total Licenses</h3>
                  <p className="text-gray-300">Track all your EA licenses in one place</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-red-400 mb-2">Active Subscriptions</h3>
                  <p className="text-gray-300">Monitor current active EA users</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-red-400 mb-2">EA Management</h3>
                  <p className="text-gray-300">Manage all your EAs efficiently</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-red-400 mb-2">License Generation</h3>
                  <p className="text-gray-300">Generate up to 10,000 licenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-black to-red-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-500 neon-text">Why Choose QUICKTRADE PRO?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black/50 border-red-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Easy License Management</h3>
                <p className="text-gray-300">Generate and manage EA licenses with just a few clicks.</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-red-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Real-time Tracking</h3>
                <p className="text-gray-300">Monitor all your licenses and EAs in real-time.</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-red-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Secure Platform</h3>
                <p className="text-gray-300">Advanced security measures to protect your data.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-500 neon-text">Trusted by Traders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/50 border-red-500/30">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-red-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold text-red-400">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gradient-to-t from-black to-red-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-500 neon-text">Get in Touch</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
            <a
              href="https://wa.me/27695347219"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-black/50 border border-red-500/30 hover:border-red-500 transition-colors"
            >
              <FaWhatsapp className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-400">WhatsApp</p>
                <p className="text-sm text-gray-400">+27 695 347 219</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500 ml-auto" />
            </a>

            <a
              href="https://instagram.com/CHILD_OF_NASDAQ_OFFICIAL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-black/50 border border-red-500/30 hover:border-red-500 transition-colors"
            >
              <FaInstagram className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-400">Instagram</p>
                <p className="text-sm text-gray-400">@CHILD_OF_NASDAQ_OFFICIAL</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500 ml-auto" />
            </a>

            <a
              href="https://www.facebook.com/share/169smrWNJX/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-black/50 border border-red-500/30 hover:border-red-500 transition-colors"
            >
              <FaFacebook className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-400">Facebook</p>
                <p className="text-sm text-gray-400">@QUICK PRO</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500 ml-auto" />
            </a>

            <a
              href="https://tiktok.com/@QUICKTRADEPRO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-black/50 border border-red-500/30 hover:border-red-500 transition-colors"
            >
              <FaTiktok className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-400">TikTok</p>
                <p className="text-sm text-gray-400">@QUICKTRADEPRO</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500 ml-auto" />
            </a>

            <a
              href="https://t.me/quicktradeproreportscammers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-black/50 border border-red-500/30 hover:border-red-500 transition-colors"
            >
              <FaTelegram className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-400">Telegram</p>
                <p className="text-sm text-gray-400">Community</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500 ml-auto" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
            alt="QUICKTRADE PRO Logo"
            width={40}
            height={40}
            className="mx-auto mb-4"
          />
          <p className="text-gray-400">© 2025 QUICKTRADE PRO. All rights reserved.</p>

          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://wa.me/27695347219"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/CHILD_OF_NASDAQ_OFFICIAL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/share/169smrWNJX/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://tiktok.com/@QUICKTRADEPRO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              <FaTiktok className="w-5 h-5" />
            </a>
            <a
              href="https://t.me/quicktradeproreportscammers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              <FaTelegram className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-4">
            <Link href="/terms" className="text-red-400 hover:text-red-300 text-sm mx-2">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-red-400 hover:text-red-300 text-sm mx-2">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>

      {/* Live Chat */}
      <LiveChat />
    </div>
  )
}

