"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
              alt="QUICKTRADE PRO Logo"
              width={60}
              height={60}
              className="mr-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-red-500 neon-text">Terms of Service</h1>
        </div>

        <div className="bg-black/80 border border-red-500/30 rounded-lg p-6 mb-8">
          <p className="text-red-300 mb-4">Last Updated: March 13, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">1. No Refund Policy</h2>
              <p className="text-gray-300 mb-3">
                QuickTrade Pro maintains a strict no-refund policy. By using our services, you acknowledge and agree
                that:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>All purchases, including license keys and account activations, are final and non-refundable</li>
                <li>No refunds will be issued for unused portion of services</li>
                <li>No refunds will be provided for any trading losses or dissatisfaction with trading results</li>
                <li>Subscription fees and activation costs cannot be refunded once the service has been activated</li>
                <li>In cases of technical issues, we will work to resolve the problem rather than issue refunds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">2. Risk Disclosure</h2>
              <p className="text-gray-300 mb-3">
                Forex trading involves substantial risk of loss and is not suitable for all investors. Users acknowledge
                that:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Past performance is not indicative of future results</li>
                <li>Trading forex involves significant risk of loss</li>
                <li>Copy trading results may vary between accounts</li>
                <li>Users are responsible for their own trading decisions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">3. License Usage</h2>
              <p className="text-gray-300 mb-3">
                When purchasing a license for our trading software, you agree to the following terms:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Each license is valid for use on a single trading account only</li>
                <li>Licenses cannot be transferred between accounts or users</li>
                <li>Attempting to use a license on multiple accounts is strictly prohibited</li>
                <li>We reserve the right to revoke licenses found to be in violation of these terms</li>
                <li>License keys are your responsibility to keep secure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-300 mb-3">
                All content, software, and materials provided through our services are protected by intellectual
                property laws:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Reverse engineering our software is strictly prohibited</li>
                <li>Distribution, sharing, or reselling of our software without explicit permission is not allowed</li>
                <li>All trademarks, logos, and brand names are the property of QUICKTRADE PRO</li>
                <li>Unauthorized use of our intellectual property may result in legal action</li>
                <li>
                  Screenshots and recordings of our software for educational purposes are permitted, but commercial use
                  is prohibited
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">5. Service Availability</h2>
              <p className="text-gray-300 mb-3">
                While we strive to maintain continuous service availability, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Services may occasionally be unavailable due to maintenance or technical issues</li>
                <li>We are not liable for any losses incurred during service downtime</li>
                <li>We reserve the right to modify, suspend, or discontinue any part of our service</li>
                <li>We will make reasonable efforts to notify users of scheduled maintenance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">6. User Conduct</h2>
              <p className="text-gray-300 mb-3">Users of our platform agree to:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Provide accurate and truthful information when registering</li>
                <li>Not engage in any illegal activities through our platform</li>
                <li>Not attempt to manipulate, hack, or disrupt our services</li>
                <li>Not use our platform to distribute malware or harmful content</li>
                <li>Respect the rights and privacy of other users</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline" className="border-red-500 text-red-400 hover:bg-red-950">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

