"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Star } from "lucide-react"
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa"
import { LiveChat } from "@/components/live-chat"

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
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
                  asChild
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50"
                >
                  <a href="#" download>
                    Download App
                  </a>
                </Button>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
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
              href="https://facebook.com/QUICKPRO"
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
              href="https://facebook.com/QUICKPRO"
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
          </div>
        </div>
      </footer>

      {/* Live Chat */}
      <LiveChat />
    </div>
  )
}

