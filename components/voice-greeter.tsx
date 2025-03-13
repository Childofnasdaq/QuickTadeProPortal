"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VoiceGreeter() {
  const { user } = useAuth()
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasAttemptedRef = useRef(false)

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    // Check if we have a user and haven't attempted to play yet
    if (user && !hasAttemptedRef.current && !isMuted) {
      hasAttemptedRef.current = true

      // Use a pre-recorded welcome message
      // This is a placeholder URL - in a real implementation, you would host this audio file on your server
      const audioUrl = "https://audio.jukehost.co.uk/KTXXdXQPQXZLPQXJQZXXXXXXXXXXXXXX" // Placeholder URL

      // Set up the audio
      const audio = audioRef.current
      audio.src = audioUrl
      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        setHasPlayed(true)
      }
      audio.onerror = (e) => {
        console.error("Audio playback error:", e)
        setIsPlaying(false)

        // Fallback to browser speech synthesis if audio file fails
        if ("speechSynthesis" in window) {
          try {
            const displayName = user.displayName || user.name || "trader"
            const greeting = `Hi ${displayName}, welcome to QUICK TRADE PRO. This platform allows you to manage your trading licenses efficiently.`

            const utterance = new SpeechSynthesisUtterance(greeting)

            // Try to find a male voice
            const voices = window.speechSynthesis.getVoices()
            const maleVoice = voices.find(
              (voice) => voice.name.includes("Male") && (voice.lang.includes("en-") || voice.lang.includes("en_")),
            )

            if (maleVoice) {
              utterance.voice = maleVoice
            }

            utterance.rate = 0.9
            utterance.pitch = 1.0

            window.speechSynthesis.speak(utterance)
          } catch (err) {
            console.error("Speech synthesis fallback failed:", err)
          }
        }
      }

      // Try to play immediately
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio is playing automatically")
          })
          .catch((error) => {
            console.error("Auto-play prevented:", error)

            // Create a user interaction to enable audio
            const unlockAudio = () => {
              document.removeEventListener("click", unlockAudio)
              audio.play().catch((e) => console.error("Play after interaction error:", e))
            }

            document.addEventListener("click", unlockAudio)
          })
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [user, isMuted])

  // Handle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else if (isMuted && !hasPlayed) {
        audioRef.current.play().catch((e) => console.error("Play error:", e))
      }
    }

    setIsMuted(!isMuted)
  }

  // Play greeting manually
  const playGreeting = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((e) => console.error("Play error:", e))
    }
  }

  // If no user, don't render anything
  if (!user) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 md:left-[280px]">
      <Button
        onClick={isMuted ? toggleMute : isPlaying ? toggleMute : playGreeting}
        variant="outline"
        size="sm"
        className="bg-black/70 border border-red-500/50 text-red-400 hover:bg-red-950/30 hover:text-red-300"
      >
        {isMuted ? (
          <>
            <VolumeX className="h-4 w-4 mr-2" />
            <span>Unmute</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4 mr-2" />
            <span>{isPlaying ? "Mute" : "Play Greeting"}</span>
          </>
        )}
      </Button>
    </div>
  )
}

