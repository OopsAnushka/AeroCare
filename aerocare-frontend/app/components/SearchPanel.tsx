"use client";
import { useState } from "react";

export default function SearchPanel({ onBook }: { onBook?: () => void }) {
  const [pickup, setPickup] = useState("Vijay Nagar, Indore");
  const [dest,   setDest]   = useState("");

  const swap = () => {
    setPickup(dest || "");
    setDest(pickup);
  };

  return (
    <div className="search-panel">
      <div className="search-panel-header">
        <span className="search-panel-title">
          <span className="search-panel-title-dot" />
          Book Ambulance
        </span>
        <span className="search-panel-badge">🚑 4 min away</span>
      </div>

      <div className="search-panel-body">
        <div className="search-input-row">
          <div className="search-input-dot-green" />
          <input
            className="search-input-field"
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </div>

        <div className="search-connector">
          <div className="search-connector-line" />
          <button className="search-connector-swap" onClick={swap}>⇅</button>
          <div className="search-connector-line" />
        </div>

        <div className="search-input-row">
          <div className="search-input-dot-red" />
          <input
            className="search-input-field"
            placeholder="Hospital / destination"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
          />
        </div>

        <button className="book-btn" onClick={onBook}>
          🚑 Confirm Booking
        </button>
      </div>
    </div>
  );
}