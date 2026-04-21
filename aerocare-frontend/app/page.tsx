"use client";

import { useState } from "react";
import SearchPanel from "./components/SearchPanel";
import AmbulanceStatus from "./components/AmbulanceStatus";
import BottomNav from "./components/BottomNav";
import NearbyDrivers from "./components/NearbyDriver";
import HeroBanner from "./components/HeroBanner";
import HomeOptions from "./components/HomeOptions";
import BloodDonor from "./components/BloodDonor";
import FirstAidGuide from "./components/FirstAidGuide";
import MedicineLocate from "./components/MedicineLocate";
import HealthRecords from "./components/HealthRecords";
import HospitalRouting from "./components/HospitalRouting";
import LocationPopup from "./components/Popup";
import LifeSupport from "./components/LifeSupport";

const sidebarItems = [
  { icon: "🏠", label: "Home" },
  { icon: "🚑", label: "Book Ambulance" },
  { icon: "🗺️", label: "Live Tracking" },
  { icon: "🏥", label: "Hospital Routing" },
  { icon: "👥", label: "Samaritan Radar" },
  { icon: "🩸", label: "Blood Donors" },
  { icon: "📋", label: "First Aid Guide" },
  { icon: "💊", label: "Medicine Locate" },
  { icon: "🧬", label: "Health Records" },
  { icon: "🫀", label: "Life Support" },
];

type AuthMode = "login" | "signup";

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function Home() {
  const [booked, setBooked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [location, setLocation] = useState("Vijay Nagar, Indore");
  const [showLocationInput, setShowLocationInput] = useState(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError("");
    setShowAuthModal(true);
  };

  const closeAuth = () => {
    setShowAuthModal(false);
    setAuthError("");
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      setAuthError("Please fill in all fields.");
      return;
    }
    setUser({ name: loginEmail.split("@")[0], email: loginEmail, phone: "" });
    closeAuth();
  };

  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPhone || !signupPassword) {
      setAuthError("Please fill in all fields.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setAuthError("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    setUser({ name: signupName, email: signupEmail, phone: signupPhone });
    closeAuth();
  };

  const handleLogout = () => {
    setUser(null);
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <main className="app-shell">

      {/* ── AUTH MODAL ── */}
      {showAuthModal && !user && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAuth();
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "420px",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                background: "#ef4444",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🚑</span>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>
                  {authMode === "login" ? "Welcome Back" : "Create Account"}
                </span>
              </div>
              <button
                onClick={closeAuth}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            {/* Tab switcher */}
            <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
              {(["login", "signup"] as AuthMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setAuthMode(mode); setAuthError(""); }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    border: "none",
                    background: "none",
                    fontSize: "14px",
                    fontWeight: authMode === mode ? 600 : 400,
                    color: authMode === mode ? "#ef4444" : "#888",
                    borderBottom: authMode === mode ? "2px solid #ef4444" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {mode === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form body */}
            <div style={{ padding: "1.5rem" }}>
              {authError && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    marginBottom: "1rem",
                  }}
                >
                  {authError}
                </div>
              )}

              {authMode === "login" ? (
                <>
                  <AuthField
                    label="Email address"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    placeholder="you@example.com"
                  />
                  <AuthField
                    label="Password"
                    type="password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    placeholder="Enter your password"
                  />
                  <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "1rem" }}>
                    <span
                      style={{ fontSize: "13px", color: "#ef4444", cursor: "pointer" }}
                      onClick={() => setAuthError("Forgot password flow coming soon!")}
                    >
                      Forgot password?
                    </span>
                  </div>
                  <AuthSubmitBtn label="Login" onClick={handleLogin} />
                </>
              ) : (
                <>
                  <AuthField
                    label="Full name"
                    type="text"
                    value={signupName}
                    onChange={setSignupName}
                    placeholder="Aryan Sharma"
                  />
                  <AuthField
                    label="Email address"
                    type="email"
                    value={signupEmail}
                    onChange={setSignupEmail}
                    placeholder="you@example.com"
                  />
                  <AuthField
                    label="Phone number"
                    type="tel"
                    value={signupPhone}
                    onChange={setSignupPhone}
                    placeholder="+91 98765 43210"
                  />
                  <AuthField
                    label="Password"
                    type="password"
                    value={signupPassword}
                    onChange={setSignupPassword}
                    placeholder="Min. 6 characters"
                  />
                  <AuthField
                    label="Confirm password"
                    type="password"
                    value={signupConfirm}
                    onChange={setSignupConfirm}
                    placeholder="Re-enter password"
                  />
                  <AuthSubmitBtn label="Create Account" onClick={handleSignup} />
                </>
              )}

              <p style={{ textAlign: "center", fontSize: "13px", color: "#888", marginTop: "1rem" }}>
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <span
                  style={{ color: "#ef4444", cursor: "pointer", fontWeight: 500 }}
                  onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }}
                >
                  {authMode === "login" ? "Sign up" : "Login"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGGED-IN PROFILE MODAL ── */}
      {user && showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "320px",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ background: "#ef4444", padding: "1.5rem", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                {initials}
              </div>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: "16px", margin: 0 }}>{user.name}</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: "4px 0 0" }}>{user.email}</p>
            </div>
            <div style={{ padding: "1.25rem" }}>
              {user.phone && (
                <p style={{ fontSize: "13px", color: "#888", margin: "0 0 1rem" }}>
                  📞 {user.phone}
                </p>
              )}
              <button
                onClick={() => { handleLogout(); closeAuth(); }}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
              <button
                onClick={closeAuth}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "1px solid #e5e7eb",
                  color: "#666",
                  fontSize: "14px",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <div className="navbar">
        <div className="navbar-left">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <span className="navbar-logo">
            <span className="navbar-logo-heart">🚑</span>
            Aero<span>Care</span>
          </span>
        </div>

        <div className="navbar-icons">
          <div className="loc-bar">
            <div className="loc-bar-dot" />
            <LocationPopup />
            {!showLocationInput ? (
              <>
                <p className="loc-bar-text">
                  Current location — <strong>{location}</strong>
                </p>
                <button className="loc-bar-change" onClick={() => setShowLocationInput(true)}>
                  Change
                </button>
              </>
            ) : (
              <div className="loc-input-wrap">
                <input
                  className="loc-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button className="loc-save" onClick={() => setShowLocationInput(false)}>
                  Save
                </button>
              </div>
            )}
          </div>

          {/* ── AVATAR / USER MENU ── */}
          {user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {initials}
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => openAuth("login")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ef4444",
                  background: "transparent",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              <button
                onClick={() => openAuth("signup")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <aside className={`desktop-sidebar ${sidebarOpen ? "open" : ""}`}>
        <p className="sidebar-label">Navigation</p>
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActiveTab(item.label);
              setSidebarOpen(false); // auto-close on mobile
            }}
            className={`sidebar-item ${activeTab === item.label ? "active" : ""}`}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 998,
          }}
        />
      )}

      {/* ── MAIN ── */}
      <div className="main-content">
        <div className="desktop-grid">

          {activeTab === "Home" && (
            <>
              <HeroBanner />
              <SearchPanel onBook={() => setBooked(true)} />
              {booked && <AmbulanceStatus status="booked" />}
              <HomeOptions />
            </>
          )}

          {activeTab === "Book Ambulance" && (
            <>
              <SearchPanel onBook={() => setBooked(true)} />
              {booked && <AmbulanceStatus status="booked" />}
            </>
          )}

          {activeTab === "Live Tracking" && (
            <AmbulanceStatus status="arriving" />
          )}

          {activeTab === "Hospital Routing" && <HospitalRouting />}

          {activeTab === "Samaritan Radar" && <NearbyDrivers />}

          {activeTab === "Blood Donors" && <BloodDonor />}

          {activeTab === "First Aid Guide" && <FirstAidGuide />}

          {activeTab === "Medicine Locate" && <MedicineLocate />}

          {activeTab === "Health Records" && <HealthRecords />}

          {/* ── NEW: Life Support Tab ── */}
          {activeTab === "Life Support" && <LifeSupport />}

        </div>
      </div>

      <BottomNav />
    </main>
  );
}

// ── Reusable sub-components ──

function AuthField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 500,
          color: "#555",
          marginBottom: "5px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          transition: "border 0.15s",
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #ef4444")}
        onBlur={(e) => (e.target.style.border = "1px solid #e5e7eb")}
      />
    </div>
  );
}

function AuthSubmitBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "11px",
        borderRadius: "8px",
        border: "none",
        background: "#ef4444",
        color: "#fff",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        marginTop: "4px",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = "#dc2626")}
      onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = "#ef4444")}
    >
      {label}
    </button>
  );
}