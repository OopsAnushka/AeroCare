"use client";
import { useState } from "react";
import SOSButton       from "./components/SOSButton";
import SearchPanel     from "./components/SearchPanel";
import AmbulanceStatus from "./components/AmbulanceStatus";
import BottomNav       from "./components/BottomNav";
import NearbyDrivers   from "./components/NearbyDriver";
import RecentActivity  from "./components/Recent Activity";
import HeroBanner      from "./components/HeroBanner";
import StatsRow        from "./components/StatRow";
import HospitalRouting from "./components/HospitalRouting";
import HomeOptions        from "./components/HomeOptions";
import BloodDonor from "./components/BloodDonor";
import FirstAidGuide from "./components/FirstAidGuide";
import MedicineLocate from "./components/MedicineLocate";
import HealthRecords  from "./components/HealthRecords";
const sidebarItems = [
  { icon: "🏠", label: "Home", active: true },
  { icon: "🚑", label: "Book Ambulance" },
  { icon: "🗺️", label: "Live Tracking" },
  { icon: "🏥", label: "Hospital Routing" },
  { icon: "👥", label: "Samaritan Radar" },
  { icon: "🩸", label: "Blood Donors" },
  { icon: "📋", label: "First Aid Guide" },
  { icon: "💊", label: "Medicine Locate" },
  { icon: "🧬", label: "Health Records" },
];

export default function Home() {
  const [booked, setBooked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [location, setLocation] = useState("Vijay Nagar, Indore");
const [showLocationInput, setShowLocationInput] = useState(false);
  return (
    <main className="app-shell">

      {/* Navbar */}
      <div className="navbar">

        <div className="navbar-left">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <span className="navbar-logo">
            <span className="navbar-logo-heart">❤</span>
            Aero<span>Care</span>
          </span>
        </div>

        <div className="navbar-icons">
             <div className="loc-bar">
        <div className="loc-bar-dot" />
       

  {!showLocationInput ? (
    <>
      <p className="loc-bar-text">
        Current location — <strong>{location}</strong>
      </p>

      <button
        className="loc-bar-change"
        onClick={() => setShowLocationInput(true)}
      >
        Change
      </button>
    </>
  ) : (
    <div className="loc-input-wrap">
      <input
        className="loc-input"
        placeholder="Enter location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button
        className="loc-save"
        onClick={() => setShowLocationInput(false)}
      >
        Save
      </button>
    </div>
  )}

      </div>

         <div 
  className="navbar-avatar"
  onClick={() => setShowAuth(!showAuth)}
>
  A
</div>

        </div>
      </div>
{showAuth && (
  <div className="auth-dropdown">
    <button className="auth-btn">Login</button>
    <button className="auth-btn signup">Sign Up</button>
  </div>
)}
      {/* Location bar */}
   
      {/* Sidebar */}
      <aside className={`desktop-sidebar ${sidebarOpen ? "open" : ""}`}>
        <p className="sidebar-label">Navigation</p>

      {sidebarItems.map((item) => (
  <button
    key={item.label}
    onClick={() => setActiveTab(item.label)}
    className={`sidebar-item ${activeTab === item.label ? "active" : ""}`}
  >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="sidebar-divider" />

        <p className="sidebar-label">Quick Info</p>

        <div className="sidebar-dummy">
          <p>🩸 24 Blood Donors Available</p>
          <p>🚑 12 Ambulances Active</p>
          <p>🏥 8 Hospitals Nearby</p>
          <p>💊 5 Medical Stores Open</p>
        </div>

        <div className="sidebar-divider" />

        <button className="sidebar-sos-btn">
          🚨 SOS Emergency
        </button>
      </aside>

      {/* Main */}
      <div className="main-content">

        <SOSButton />

<div className="desktop-grid">

{activeTab === "Home" && (
<>
  <HeroBanner />
  <SearchPanel onBook={() => setBooked(true)} />
  {booked && <AmbulanceStatus status="booked" />}
  <StatsRow />
  <HomeOptions />
  <NearbyDrivers />
  <RecentActivity />
</>
)}

{activeTab === "Book Ambulance" && (
<>
  <SearchPanel onBook={() => setBooked(true)} />
  {booked && <AmbulanceStatus status="booked" />}
</>
)}

{activeTab === "Samaritan Radar" && (
<>
  <NearbyDrivers />
</>
)}

{activeTab === "Blood Donors" && (
<>
  <BloodDonor />
</>
)}

{activeTab === "Live Tracking" && (
<>
  <HeroBanner />
</>
)}
{activeTab === "Hospital Routing" && (
<>
  <HospitalRouting />
</>
)}
{activeTab === "First Aid Guide" && (
<>
  <FirstAidGuide />
</>
)}
{activeTab === "Medicine Locate" && (
<>
  <MedicineLocate />
</>
)}
{activeTab === "Health Records" && (
<>
  <HealthRecords />
</>
)}

</div>
      </div>

      <BottomNav />

    </main>
  );
}