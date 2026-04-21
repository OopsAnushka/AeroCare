"use client";

import { useState } from "react";

type AmbulanceType = "bls" | "als";

interface AmbulanceOption {
  id: AmbulanceType;
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  features: string[];
  eta: string;
  price: string;
  color: string;
  bg: string;
  borderColor: string;
}

const AMBULANCE_OPTIONS: AmbulanceOption[] = [
  {
    id: "bls",
    icon: "🚑",
    title: "BLS Ambulance",
    subtitle: "Basic Life Support",
    badge: "STANDARD",
    badgeColor: "#16a34a",
    features: ["Oxygen Supply", "First Aid Kit", "Trained EMT", "Stretcher"],
    eta: "3–5 min",
    price: "₹500–₹800",
    color: "#16a34a",
    bg: "rgba(22, 163, 74, 0.06)",
    borderColor: "#16a34a",
  },
  {
    id: "als",
    icon: "🏥",
    title: "ALS Ambulance",
    subtitle: "Advanced Life Support",
    badge: "CRITICAL CARE",
    badgeColor: "#ef4444",
    features: ["Cardiac Monitor", "Defibrillator", "Paramedic On-board", "IV Medications", "Ventilator"],
    eta: "5–8 min",
    price: "₹1200–₹2000",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.06)",
    borderColor: "#ef4444",
  },
];

interface SearchPanelProps {
  onBook: () => void;
}

export default function SearchPanel({ onBook }: SearchPanelProps) {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selected, setSelected] = useState<AmbulanceType | null>(null);
  const [booked, setBooked] = useState(false);
  const [step, setStep] = useState<"select" | "confirm" | "booked">("select");

  const handleBook = () => {
    if (!selected) return;
    if (step === "select") {
      setStep("confirm");
      return;
    }
    setStep("booked");
    setBooked(true);
    onBook();
  };

  const selectedOption = AMBULANCE_OPTIONS.find((o) => o.id === selected);

  if (step === "booked" && selectedOption) {
    return (
      <div className="sp-wrap">
        <div className="sp-success">
          <div className="sp-success-icon">✅</div>
          <h3 className="sp-success-title">Ambulance Booked!</h3>
          <p className="sp-success-sub">
            Your <strong>{selectedOption.title}</strong> is on the way.
          </p>
          <div className="sp-success-eta">
            <span>⏱️</span>
            <span>ETA: {selectedOption.eta}</span>
          </div>
          <button
            className="sp-reset-btn"
            onClick={() => { setStep("select"); setSelected(null); setBooked(false); }}
          >
            Book Another
          </button>
        </div>

        <style jsx>{`
          .sp-wrap {
            width: 100%;
          }
          .sp-success {
            background: #fff;
            border: 1px solid #ebebeb;
            border-radius: 24px;
            padding: 40px 28px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.06);
          }
          .sp-success-icon { font-size: 52px; margin-bottom: 16px; }
          .sp-success-title {
            font-family: "Syne", sans-serif;
            font-size: 24px;
            font-weight: 800;
            color: #111;
            margin-bottom: 8px;
          }
          .sp-success-sub { font-size: 14px; color: #666; margin-bottom: 20px; }
          .sp-success-eta {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #16a34a;
            padding: 10px 20px;
            border-radius: 40px;
            font-weight: 700;
            font-size: 15px;
            margin-bottom: 24px;
          }
          .sp-reset-btn {
            display: block;
            width: 100%;
            padding: 13px;
            border-radius: 12px;
            border: 1.5px solid #e5e7eb;
            background: transparent;
            color: #555;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          .sp-reset-btn:hover { background: #f9fafb; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="sp-wrap">

      {/* ── HEADER ── */}
      <div className="sp-header">
        <div className="sp-header-left">
          <div className="sp-header-badge">
            <span className="sp-badge-dot" />
            BOOK AMBULANCE
          </div>
          <h2 className="sp-title">Select Ambulance Type</h2>
          <p className="sp-subtitle">Choose the right emergency care for your situation</p>
        </div>
        <div className="sp-step-indicator">
          <div className={`sp-step-dot ${step !== "select" ? "sp-step-dot--done" : "sp-step-dot--active"}`}>1</div>
          <div className="sp-step-line" />
          <div className={`sp-step-dot ${step === "confirm" ? "sp-step-dot--active" : ""}`}>2</div>
        </div>
      </div>

      {/* ── AMBULANCE TYPE CARDS ── */}
      <div className="sp-cards">
        {AMBULANCE_OPTIONS.map((opt) => (
          <div
            key={opt.id}
            className={`sp-card ${selected === opt.id ? "sp-card--selected" : ""}`}
            onClick={() => setSelected(opt.id)}
            style={{
              "--ccolor": opt.color,
              "--cbg": opt.bg,
              "--cborder": opt.borderColor,
            } as React.CSSProperties}
          >
            {/* Selection indicator */}
            <div className="sp-card-radio">
              <div className={`sp-radio-outer ${selected === opt.id ? "sp-radio-outer--active" : ""}`}
                style={{ borderColor: selected === opt.id ? opt.color : "#ddd" }}>
                {selected === opt.id && (
                  <div className="sp-radio-inner" style={{ background: opt.color }} />
                )}
              </div>
            </div>

            {/* Icon + Title */}
            <div className="sp-card-top">
              <div className="sp-card-icon-wrap" style={{ background: opt.bg }}>
                <span className="sp-card-icon">{opt.icon}</span>
              </div>
              <div className="sp-card-title-wrap">
                <div className="sp-card-title">{opt.title}</div>
                <div className="sp-card-subtitle">{opt.subtitle}</div>
              </div>
              <span
                className="sp-card-badge"
                style={{ color: opt.badgeColor, background: opt.bg, border: `1px solid ${opt.badgeColor}30` }}
              >
                {opt.badge}
              </span>
            </div>

            {/* Features */}
            <div className="sp-card-features">
              {opt.features.map((f) => (
                <span key={f} className="sp-feature-tag" style={{ color: opt.color, background: opt.bg }}>
                  ✓ {f}
                </span>
              ))}
            </div>

            {/* ETA + Price */}
            <div className="sp-card-meta">
              <div className="sp-meta-item">
                <span className="sp-meta-label">⏱ ETA</span>
                <span className="sp-meta-val" style={{ color: opt.color }}>{opt.eta}</span>
              </div>
              <div className="sp-meta-divider" />
              <div className="sp-meta-item">
                <span className="sp-meta-label">💰 Approx Cost</span>
                <span className="sp-meta-val">{opt.price}</span>
              </div>
            </div>

            {/* Selected glow border */}
            {selected === opt.id && (
              <div className="sp-card-selected-bar" style={{ background: opt.color }} />
            )}
          </div>
        ))}
      </div>

      {/* ── LOCATION INPUTS (shown on confirm step) ── */}
      {step === "confirm" && (
        <div className="sp-location-wrap">
          <div className="sp-loc-header">📍 Enter Locations</div>
          <div className="sp-loc-field">
            <div className="sp-loc-dot sp-loc-dot--green" />
            <input
              className="sp-loc-input"
              placeholder="Pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>
          <div className="sp-loc-connector">
            <div className="sp-loc-line" />
          </div>
          <div className="sp-loc-field">
            <div className="sp-loc-dot sp-loc-dot--red" />
            <input
              className="sp-loc-input"
              placeholder="Destination hospital (optional)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Selected summary */}
          {selectedOption && (
            <div className="sp-confirm-summary" style={{ borderColor: selectedOption.color + "40", background: selectedOption.bg }}>
              <span>{selectedOption.icon}</span>
              <div>
                <div className="sp-confirm-name" style={{ color: selectedOption.color }}>{selectedOption.title}</div>
                <div className="sp-confirm-eta">ETA: {selectedOption.eta} · {selectedOption.price}</div>
              </div>
              <button className="sp-change-btn" onClick={() => setStep("select")}>Change</button>
            </div>
          )}
        </div>
      )}

      {/* ── BOOK BUTTON ── */}
      <button
        className={`sp-book-btn ${!selected ? "sp-book-btn--disabled" : ""}`}
        onClick={handleBook}
        disabled={!selected}
        style={selected && selectedOption ? {
          background: `linear-gradient(135deg, ${selectedOption.color}, ${selectedOption.color}cc)`,
        } : {}}
      >
        {step === "select"
          ? selected
            ? `Continue with ${selectedOption?.title} →`
            : "Select an Ambulance Type"
          : "🚑 Confirm & Book Now"}
      </button>

      <p className="sp-disclaimer">
        🔒 Your request is encrypted & dispatched instantly to the nearest unit.
      </p>

    </div>
  );
}