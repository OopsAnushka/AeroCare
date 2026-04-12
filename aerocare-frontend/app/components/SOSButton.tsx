"use client";
import React, { useState, useRef } from "react";

const SOSButton = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSOS = async () => {
    setStatus("sending");
    try {
      // Get user location
      const position = await new Promise<GeolocationPosition>((res, rej) => 
        navigator.geolocation.getCurrentPosition(res, rej)
      );

      const response = await fetch("http://localhost:5000/api/sos/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) setStatus("sent");
    } catch (error) {
      console.error("SOS Failed:", error);
      alert("Could not send SOS. Please check location permissions.");
      setStatus("idle");
    }
  };

  const startHold = () => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      triggerSOS();
      setIsHolding(false);
    }, 2000); // 2 second hold
  };

  const endHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHolding(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        className={`w-40 h-40 rounded-full border-8 transition-all duration-300 shadow-xl flex items-center justify-center text-white font-bold text-2xl
          ${status === "sent" ? "bg-green-500 border-green-200" : "bg-red-600 border-red-200 active:scale-95"}
          ${isHolding ? "scale-110 border-red-400" : ""}
        `}
      >
        {status === "idle" && (isHolding ? "HOLDING..." : "")}
        {status === "sending" && "SENDING..."}
        {status === "sent" && "SENT!"}
      </button>
      {/* <p className="mt-4 text-gray-500 text-sm">
        {status === "sent" ? "Help is on the way." : "Hold for 2 seconds to alert nearby responders."}
      </p> */}
    </div>
  );
};

export default SOSButton;