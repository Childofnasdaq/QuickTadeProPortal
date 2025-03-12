"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, CreditCard, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
      setFormData((prev) => ({ ...prev, [name]: formatted }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Card number validation (16 digits)
    const cardNumberClean = formData.cardNumber.replace(/\s/g, "")
    if (!cardNumberClean) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    // Card name validation
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required"
    }

    // Expiry validation
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = "Month is required"
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = "Year is required"
    }

    // CVV validation (3-4 digits)
    if (!formData.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      setPaymentStatus("success")

      // Redirect after successful payment
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear + i)

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Link href="/" className="flex items-center mb-8 text-red-500">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
            alt="QUICKTRADE PRO Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold neon-text">QUICKTRADE PRO</span>
        </Link>

        <Card className="bg-black border border-red-500 glow-border">
          <CardHeader>
            <CardTitle className="text-2xl text-red-500 neon-text">Credit Card Payment</CardTitle>
            <CardDescription className="text-red-300">
              Complete your purchase of QUICKTRADE PRO for $60 USD
            </CardDescription>
          </CardHeader>

          <CardContent>
            {paymentStatus === "success" ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-2">Payment Successful!</h3>
                <p className="text-green-300 mb-4">
                  Thank you for your purchase. You will receive your download link via email shortly.
                </p>
                <p className="text-red-300">Redirecting to dashboard...</p>
              </div>
            ) : paymentStatus === "error" ? (
              <Alert className="bg-red-900/30 border-red-500 text-red-200 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  There was an error processing your payment. Please try again or contact support.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-red-300">
                      Card Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        maxLength={19} // 16 digits + 3 spaces
                        className="bg-black/50 border-red-500/50 focus:border-red-500 text-white pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-400" />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cardName" className="text-red-300">
                      Cardholder Name
                    </Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                    />
                    {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-red-300">Expiry Date</Label>
                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <Select
                            value={formData.expiryMonth}
                            onValueChange={(value) => handleSelectChange("expiryMonth", value)}
                          >
                            <SelectTrigger className="bg-black/50 border-red-500/50 focus:border-red-500 text-white">
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-red-500">
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = i + 1
                                return (
                                  <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                    {month.toString().padStart(2, "0")}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
                        </div>

                        <div className="w-1/2">
                          <Select
                            value={formData.expiryYear}
                            onValueChange={(value) => handleSelectChange("expiryYear", value)}
                          >
                            <SelectTrigger className="bg-black/50 border-red-500/50 focus:border-red-500 text-white">
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-red-500">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cvv" className="text-red-300">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        maxLength={4}
                        className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-red-300">
                      Email (for receipt)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex items-center text-red-300 text-sm">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Pay $60.00 USD"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-red-900/30 pt-4">
            <div className="text-center text-red-400 text-sm">
              <p>By completing this purchase, you agree to our</p>
              <div className="flex justify-center space-x-2">
                <Link href="/terms" className="text-red-300 hover:text-red-200 underline">
                  Terms of Service
                </Link>
                <span>and</span>
                <Link href="/privacy" className="text-red-300 hover:text-red-200 underline">
                  Privacy Policy
                </Link>
              </div>
            </div>

            {paymentStatus === "idle" && (
              <Button
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-950"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

