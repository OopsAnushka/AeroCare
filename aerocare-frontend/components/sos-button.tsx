"use client"

import { useState } from "react"
import { Phone } from "lucide-react"

export function SOSButton() {
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = () => {
    setIsPressed(true)
    // Simulate dispatch activation
    setTimeout(() => setIsPressed(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 animate-ping rounded-full bg-emergency/30" />
        <div className="absolute inset-[-12px] animate-pulse rounded-full bg-emergency/20" />
        
        {/* Main SOS Button */}
        <button
          onClick={handlePress}
          disabled={isPressed}
          className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-emergency/50 active:scale-95 disabled:opacity-80 sm:h-56 sm:w-56 md:h-64 md:w-64"
          style={{
            boxShadow: "0 0 60px rgba(220, 38, 38, 0.4), 0 0 100px rgba(220, 38, 38, 0.2)",
          }}
        >
          {isPressed ? (
            <>
              <div className="mb-2 h-10 w-10 animate-spin rounded-full border-4 border-emergency-foreground border-t-transparent" />
              <span className="text-lg font-semibold sm:text-xl">DISPATCHING...</span>
            </>
          ) : (
            <>
              <Phone className="mb-2 h-12 w-12 sm:h-14 sm:w-14" />
              <span className="text-3xl font-bold sm:text-4xl">SOS</span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider opacity-90 sm:text-sm">
                Tap for Emergency
              </span>
            </>
          )}
        </button>
      </div>

      <p className="max-w-xs text-center text-sm text-muted-foreground">
        Press to immediately dispatch emergency medical services to your location
      </p>
    </div>
  )
}
