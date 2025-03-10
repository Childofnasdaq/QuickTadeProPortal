"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X, Loader2 } from "lucide-react"
import Image from "next/image"

type Message = {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "Welcome to QUICKTRADE PRO! How can we help you today?",
          sender: "agent",
          timestamp: new Date(),
        },
      ])
    }
  }, [messages.length])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate agent typing
    setIsTyping(true)

    // Simulate agent response after delay
    setTimeout(() => {
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        text: getAutoResponse(newMessage),
        sender: "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Simple auto-response system
  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("license") || lowerMessage.includes("key")) {
      return "Our license system allows you to generate and manage keys for your EAs. You can create up to 10,000 licenses through your dashboard."
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("plan")) {
      return "We offer flexible pricing plans starting from $49/month. You can view all our pricing options on the dashboard after signing up."
    } else if (lowerMessage.includes("ea") || lowerMessage.includes("expert advisor")) {
      return "QUICKTRADE PRO supports all MetaTrader EAs. You can manage multiple EAs through our intuitive dashboard."
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("support")) {
      return "You can reach our support team via email at support@childofnasdaqofficial.co.za or WhatsApp at +27 695 347 219."
    } else {
      return "Thank you for your message. One of our team members will get back to you shortly. For immediate assistance, please contact us via WhatsApp at +27 695 347 219."
    }
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all z-50"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 overflow-hidden">
          {/* Chat header */}
          <div className="bg-red-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/304fc277-f835-46c7-ba23-d07c855074f2_20250303_233002_0000-XjQ9UtyKq1KXvIjUOL0ffYCtH5gm1g.png"
                alt="QUICKTRADE PRO Logo"
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="font-semibold">QUICKTRADE PRO Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`mb-3 max-w-[80%] ${message.sender === "user" ? "ml-auto" : "mr-auto"}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
                <div className={`text-xs mt-1 text-gray-500 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center mb-3 max-w-[80%]">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

