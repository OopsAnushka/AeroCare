"use client";
import { useState } from "react";

export default function SOSButton() {
  const [dispatching, setDispatching] = useState(false);

  const handleSOS = () => {
    setDispatching(true);
    setTimeout(() => setDispatching(false), 3000);
  };

  return (
    <div className="sos-section">
      <div className="sos-wrap">
        <span className="sos-ring-outer" />
        <span className="sos-ring-inner" />
        <button className="sos-btn" onClick={handleSOS}>
          <span className="sos-btn-icon">🚨</span>
          <span className="sos-btn-label">SOS</span>
          <span className="sos-btn-sub">
            {dispatching ? "DISPATCHING..." : "TAP FOR EMERGENCY"}
          </span>
        </button>
      </div>
      <p className="sos-desc">
        Instantly dispatches the nearest ambulance to your GPS location
      </p>
    </div>
  );
}