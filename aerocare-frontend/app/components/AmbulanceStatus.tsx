"use client";
import { useEffect, useState } from "react";

type Status = "idle" | "booked" | "arriving";

export default function AmbulanceStatus({ status = "booked" }: { status?: Status }) {
  const [eta, setEta] = useState(6);

  useEffect(() => {
    if (status !== "booked") return;
    const t = setInterval(() => setEta((e) => Math.max(0, e - 1)), 3000);
    return () => clearInterval(t);
  }, [status]);

  if (status === "idle") return null;

  return (
    <div className="amb-status-card">
      <div className="amb-status-map">
        <div className="amb-status-map-grid" />
        <div className="amb-status-road-h" />
        <div className="amb-status-road-v" />
        <span className="amb-status-vehicle">🚑</span>
        <span className="amb-status-dest">📍</span>
        <span className="amb-status-pin">You</span>
      </div>

      <div className="amb-status-info">
        <div className="amb-status-driver-wrap">
          <div className="amb-status-driver-avatar">👨‍⚕️</div>
          <div>
            <p className="amb-status-driver-name">Rajesh Kumar</p>
            <p className="amb-status-driver-meta">
              MP09-AE-4782
              <span className="amb-status-driver-rating">⭐ 4.9</span>
            </p>
          </div>
        </div>
        <div className="amb-status-eta-box">
          <span className="amb-status-eta-num">
            {eta === 0 ? "Here!" : `${eta} min`}
          </span>
          <p className="amb-status-eta-label">ETA</p>
        </div>
      </div>

      <div className="amb-status-actions">
        <button className="amb-action-btn">📞 Call</button>
        <button className="amb-action-btn">💬 Chat</button>
        <button className="amb-action-btn">📤 Share</button>
        <button className="amb-action-btn-cancel">✕ Cancel</button>
      </div>
    </div>
  );
}