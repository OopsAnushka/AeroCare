"use client"
import { useState, useEffect } from "react"

export default function LocationPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const enableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords)
        setShow(false)
      },
      () => {
        alert("Location permission denied")
      }
    )
  }

  if (!show) return null

  return (
    <div className="location-overlay">
      <div className="location-popup">
        <div className="location-icon">📍</div>

        <h3>Enable Location</h3>
        <p>Turn on location to find nearby ambulances</p>

        <button onClick={enableLocation} className="enable-btn">
          Turn On Location
        </button>

        <button onClick={() => setShow(false)} className="skip-btn">
          Not Now
        </button>
      </div>
    </div>
  )
}