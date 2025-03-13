"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { Upload } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    displayName: user?.displayName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(user?.avatar || null)

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        displayName: user.displayName || "",
        phone: user.phone || "",
        email: user.email || "",
      })
      setPreviewImage(user.avatar || null)
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Basic validation
    if (!form
