"use client";

import { useState } from "react";

export default function HeroBanner() {
  const [active, setActive] = useState(false);

  const handleSOS = () => {
    setActive(true);
    alert("🚨 SOS Alert Sent! Nearest ambulance dispatched.");
    setTimeout(() => setActive(false), 3000);
  };

  return (
    <section className="hero-banner">
      {/* LEFT SIDE */}
      <div className="hero-left">
        <span className="live-badge">🔴 LIVE • INDORE</span>

        <h1 className="hero-title">
          Emergency Care,
          <br />
          Always Ready.
        </h1>

        <p className="hero-subtitle">
          24 ambulances active across Indore right now.
          Tap SOS to dispatch the nearest unit instantly.
        </p>

        <div className="stats-row">
          <div className="stat-card">
            <h3>24</h3>
            <p>Active</p>
          </div>

          <div className="stat-card">
            <h3>3.8m</h3>
            <p>Avg Time</p>
          </div>

          <div className="stat-card">
            <h3>98%</h3>
            <p>Uptime</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hero-right">
        <div className="ring ring1"></div>
        <div className="ring ring2"></div>

        <button
          onClick={handleSOS}
          className={`sos-btn ${active ? "active" : ""}`}
        >
          🚨
          <span>SOS</span>
        </button>

        <p className="hint">
          Instant Emergency Help
        </p>
      </div>
    </section>
  );
}