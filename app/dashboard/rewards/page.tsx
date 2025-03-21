"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clipboard, CheckCircle, RefreshCw, Users, Award } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Referral = {
  id: string
  referredBy: string
  referredUser: string
  status: "pending" | "active"
  createdAt: Date
}

export default function RewardsPage() {
  const { user } = useAuth()
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [referrals, setReferrals] = useState({
    total: 0,
    active: 0,
    completed: false,
    reward: "R1000",
    progress: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [shareError, setShareError] = useState("")

  // Generate or retrieve referral link
  useEffect(() => {
    if (user) {
      loadReferralData()
    }
  }, [user])

  const loadReferralData = async () => {
    setIsLoading(true)

    try {
      // Check if user already has a referral link in localStorage
      const storedLink = localStorage.getItem(`referral_link_${user?.id}`)

      if (storedLink) {
        setReferralLink(storedLink)
      } else {
        // Generate a new link based on user ID and mentor ID
        const generatedLink = `https://childofnasdaqofficial.co.za/signup?ref=${user?.mentorId}`
        setReferralLink(generatedLink)
        localStorage.setItem(`referral_link_${user?.id}`, generatedLink)
      }

      // Try to fetch referrals from localStorage
      const storedReferrals = JSON.parse(localStorage.getItem(`referrals_${user?.id}`) || "[]")
      const referralData = storedReferrals

      // Calculate stats
      const totalReferrals = referralData.length
      const activeReferrals = referralData.filter((ref) => ref.status === "active").length
      const progress = (activeReferrals / 10) * 100
      const completed = activeReferrals >= 10

      setReferrals({
        total: totalReferrals,
        active: activeReferrals,
        progress,
        completed,
        reward: "R1000",
      })
    } catch (error) {
      console.error("Error loading referral data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewReferralLink = async () => {
    if (!user) return

    setIsGenerating(true)

    try {
      // Generate a unique code using timestamp and random string
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const uniqueCode = `${user.mentorId}-${timestamp}-${randomStr}`

      // Create the new referral link
      const newLink = `https://childofnasdaqofficial.co.za/signup?ref=${uniqueCode}`

      // Save to localStorage
      localStorage.setItem(`referral_link_${user.id}`, newLink)

      // Update state
      setReferralLink(newLink)
    } catch (error) {
      console.error("Error generating referral link:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const shareLink = () => {
    setShareError("")

    // First try to use the Web Share API
    if (navigator.share) {
      navigator
        .share({
          title: "QUICKTRADE PRO - Referral",
          text: "Join QUICKTRADE PRO using my referral link and get started with professional trading tools!",
          url: referralLink,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          setShareError("Couldn't share directly. The link has been copied to your clipboard instead.")
          copyToClipboard()
        })
    } else {
      // Fallback to clipboard
      copyToClipboard()
      setShareError("Direct sharing not supported in your browser. The link has been copied to your clipboard instead.")
    }
  }

  const refreshReferrals = () => {
    loadReferralData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-red-300">Loading your referral data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rewards Program</h1>
          <p className="text-red-400 mt-1">Refer friends and earn rewards</p>
        </div>
        <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-950" onClick={refreshReferrals}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {shareError && (
        <Alert className="bg-yellow-900/30 border-yellow-500 text-yellow-200">
          <AlertDescription>{shareError}</AlertDescription>
        </Alert>
      )}

      <div className="bg-red-950/20 border border-red-500 rounded-lg p-6 text-center">
        <div className="max-w-md mx-auto">
          <Award className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-300 mb-2">Earn R1000</h2>
          <p className="text-red-200 mb-6">
            Refer 10 active users to QUICKTRADE PRO and earn a R1000 reward! Your unique referral link is ready to
            share.
          </p>

          <div className="bg-black/50 border border-red-500/30 rounded-lg p-3 flex items-center justify-between mb-4">
            <div className="font-mono text-sm text-red-300 truncate mr-2">{referralLink}</div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-red-500 text-red-400 hover:bg-red-950"
              onClick={copyToClipboard}
            >
              {copied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="flex gap-4 justify-center mb-8">
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={shareLink}>
              <Clipboard className="mr-2 h-4 w-4" />
              Copy Link
            </Button>

            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-950"
              onClick={generateNewReferralLink}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate New Link
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-red-300">Progress: {referrals.active}/10 active referrals</span>
                <span className="text-sm text-red-300">{referrals.progress.toFixed(0)}%</span>
              </div>
              <Progress value={referrals.progress} className="h-2 bg-red-950" indicatorClassName="bg-red-500" />
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <Users className="h-5 w-5 text-red-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-red-300">{referrals.total}</p>
                <p className="text-xs text-red-400">Total Referrals</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-red-300">{referrals.active}</p>
                <p className="text-xs text-red-400">Active Users</p>
              </div>
              <div className="text-center">
                <Award className="h-5 w-5 text-red-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-red-300">{referrals.reward}</p>
                <p className="text-xs text-red-400">Reward Amount</p>
              </div>
            </div>
          </div>

          {referrals.completed ? (
            <div className="mt-6 bg-green-900/30 border border-green-500 rounded-lg p-4 text-green-200">
              <CheckCircle className="h-5 w-5 mx-auto mb-2" />
              <p className="font-semibold">Congratulations! You've earned your R1000 reward.</p>
              <p className="text-sm mt-1">Our team will contact you for payment details.</p>
            </div>
          ) : (
            <div className="mt-6 text-red-300 text-sm">
              <p>
                Only active users count toward your reward. An active user is someone who has purchased and activated
                the app.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-black border border-red-900 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-red-900">
          <h2 className="text-lg font-semibold text-red-300">How It Works</h2>
        </div>
        <div className="p-4">
          <ol className="space-y-4 text-red-200">
            <li className="flex gap-3">
              <span className="bg-red-900/50 text-red-300 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <p className="font-medium">Share your unique referral link with friends</p>
                <p className="text-red-400 text-sm">Share via social media, WhatsApp, email, or any platform</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-red-900/50 text-red-300 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <p className="font-medium">Friends sign up using your link</p>
                <p className="text-red-400 text-sm">When they use your link, they'll be tracked as your referral</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-red-900/50 text-red-300 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <p className="font-medium">Friends activate the app</p>
                <p className="text-red-400 text-sm">Only active users count toward your rewards</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-red-900/50 text-red-300 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <p className="font-medium">Collect your reward</p>
                <p className="text-red-400 text-sm">Once you reach 10 active referrals, you earn R1000</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

