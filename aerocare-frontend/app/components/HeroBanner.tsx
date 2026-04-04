"use client";

import { useState } from "react";

export default function HeroBanner() {

  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="hero-banner">
      <div className="hero-banner-text">
        <span className="hero-banner-tag">LIVE · INDORE</span>
        <h2 className="hero-banner-title">
          Emergency Care,<br />Always On.
        </h2>
        <p className="hero-banner-sub">
          24 ambulances active across Indore right now
        </p>
      </div>

      <div className="hero-banner-stat">
        <span className="hero-banner-stat-num">3.8m</span>
        <span className="hero-banner-stat-label">Avg response</span>
      </div>
    </div>
  );
}