"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

type Message = {
  id: string
  text: string
  sender: string
  timestamp: Date
  isAdmin: boolean
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Check if chat is already started
  useEffect(() => {
    const chatId = localStorage.getItem("chatId")
    if (chatId) {
      setChatStarted(true)
    }
  }, [])

  // Auto-fill user info if logged in
  useEffect(() => {
    if (user) {
      setName(user.displayName || user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  // Load messages from localStorage when chat is opened
  useEffect(() => {
    if (!isOpen || !chatStarted) return

    const chatId = localStorage.getItem("chatId") || "public"
    const storedMessages = JSON.parse(localStorage.getItem(`chat_${chatId}`) || "[]")

    // Convert string dates to Date objects
    const parsedMessages = storedMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }))

    setMessages(parsedMessages)
    scrollToBottom()

    // Add a welcome message if there are no messages
    if (parsedMessages.length === 0) {
      const welcomeMessage = {
        id: Date.now().toString(),
        text: "Welcome to QuickTrade Pro support! How can we help you today?",
        sender: "Support",
        timestamp: new Date(),
        isAdmin: true,
      }

      setMessages([welcomeMessage])

      // Save to localStorage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify([welcomeMessage]))
    }
  }, [isOpen, chatStarted])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const startChat = async () => {
    if (!name.trim() || !email.trim()) return

    setIsSubmittingInfo(true)

    try {
      // Create a new chat session or use existing
      let chatId = localStorage.getItem("chatId")

      if (!chatId) {
        chatId = Date.now().toString()
        localStorage.setItem("chatId", chatId)

        // Store chat metadata
        const chatMetadata = {
          userEmail: email,
          userName: name,
          startedAt: new Date(),
          userId: user?.id || null,
        }

        localStorage.setItem(`chat_metadata_${chatId}`, JSON.stringify(chatMetadata))
      }

      setChatStarted(true)
    } catch (error) {
      console.error("Error starting chat:", error)
    } finally {
      setIsSubmittingInfo(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !chatStarted) return

    const chatId = localStorage.getItem("chatId") || "public"

    try {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: name,
        timestamp: new Date(),
        isAdmin: false,
      }

      // Update state
      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)

      // Save to localStorage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages))

      setMessage("")

      // Simulate a response after 2 seconds
      setTimeout(() => {
        const responseMessage = {
          id: Date.now().toString(),
          text: "Thank you for your message. Our team will get back to you soon.",
          sender: "Support",
          timestamp: new Date(),
          isAdmin: true,
        }

        const messagesWithResponse = [...updatedMessages, responseMessage]
        setMessages(messagesWithResponse)
        localStorage.setItem(`chat_${chatId}`, JSON.stringify(messagesWithResponse))
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-black border border-red-500 rounded-lg shadow-2xl z-50 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-red-900 p-4 rounded-t-lg">
            <h3 className="font-bold text-white">QUICKTRADE PRO Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat content */}
          {!chatStarted ? (
            <div className="p-4 flex-1">
              <p className="text-red-300 mb-4">
                Please provide your information to start chatting with our support team.
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
                <Input
                  placeholder="Your Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
                <Button
                  onClick={startChat}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isSubmittingInfo || !name.trim() || !email.trim()}
                >
                  {isSubmittingInfo ? "Starting..." : "Start Chat"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-black/90 min-h-[300px] max-h-[350px]">
                {messages.length === 0 ? (
                  <div className="text-center text-red-400 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.isAdmin ? "bg-red-900/30 text-white" : "bg-red-600 text-white"
                          }`}
                        >
                          {msg.isAdmin && (
                            <div className="flex items-center gap-1 mb-1">
                              <User className="h-3 w-3" />
                              <span className="text-xs font-semibold">Support</span>
                            </div>
                          )}
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-3 border-t border-red-900/30 flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
                />
                <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}

