"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-red-500 neon-text">Privacy Policy</h1>
        </div>

        <div className="bg-black/80 border border-red-500/30 rounded-lg p-6 mb-8">
          <p className="text-red-300 mb-4">Last Updated: March 13, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-3">We collect the following types of information from our users:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Personal information such as name, email address, and phone number</li>
                <li>Account information including username and password</li>
                <li>Payment information (processed through secure third-party payment processors)</li>
                <li>Usage data such as login times, features used, and license key generation</li>
                <li>Device information including IP address, browser type, and operating system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-3">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process payments and manage subscriptions</li>
                <li>To verify user identity and prevent fraud</li>
                <li>To send important notifications about our services</li>
                <li>To improve our platform based on usage patterns</li>
                <li>To respond to customer service requests and support needs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">3. Data Security</h2>
              <p className="text-gray-300 mb-3">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>All data is encrypted during transmission using SSL technology</li>
                <li>We use secure cloud storage with industry-standard protections</li>
                <li>Regular security audits and updates are performed</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
                <li>We never store complete credit card information on our servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">4. Third-Party Services</h2>
              <p className="text-gray-300 mb-3">We may use third-party services that collect information about you:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Payment processors to handle financial transactions</li>
                <li>Analytics providers to help us understand user behavior</li>
                <li>Cloud storage providers to securely store data</li>
                <li>Communication services to send notifications and updates</li>
                <li>Each third-party service has its own privacy policy and terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">5. Your Rights</h2>
              <p className="text-gray-300 mb-3">
                As a user of our platform, you have the following rights regarding your data:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Right to access the personal information we hold about you</li>
                <li>Right to request correction of inaccurate information</li>
                <li>Right to request deletion of your data (subject to legal requirements)</li>
                <li>Right to opt out of marketing communications</li>
                <li>Right to be informed about how your data is used</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-300 mb-3">Our website uses cookies and similar tracking technologies:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Essential cookies that enable core functionality</li>
                <li>Analytics cookies that help us improve our website</li>
                <li>Preference cookies that remember your settings</li>
                <li>You can manage cookie preferences through your browser settings</li>
                <li>Disabling certain cookies may affect the functionality of our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">7. Changes to This Policy</h2>
              <p className="text-gray-300 mb-3">We may update our Privacy Policy from time to time:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>We will notify users of significant changes via email or website notice</li>
                <li>The "Last Updated" date at the top will be revised</li>
                <li>Continued use of our services after changes constitutes acceptance</li>
                <li>We encourage users to review the policy periodically</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-400 mb-4">8. Contact Us</h2>
              <p className="text-gray-300 mb-3">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Email: support@quicktradepro.com</li>
                <li>WhatsApp: +27 695 347 219</li>
                <li>We will respond to all inquiries within 48 hours</li>
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

