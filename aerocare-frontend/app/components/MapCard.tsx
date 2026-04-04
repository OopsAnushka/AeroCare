"use client";

export default function MapCard() {
  return (
    <div className="amb-status-map" style={{ margin: "0 20px 20px", borderRadius: "20px", border: "1px solid #EBEBEB" }}>
      <div className="amb-status-map-grid" />
      <div className="amb-status-road-h" />
      <div className="amb-status-road-v" />
      <span style={{ fontSize: "48px", position: "relative", zIndex: 2 }}>🗺️</span>
      <div style={{
        position: "absolute", bottom: "12px", left: "50%",
        transform: "translateX(-50%)", background: "white",
        border: "1px solid #EBEBEB", padding: "6px 16px",
        borderRadius: "999px", fontSize: "12px",
        fontWeight: 600, color: "#7A7670",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        whiteSpace: "nowrap", zIndex: 2
      }}>
        Live map · Google Maps integration ready
      </div>
    </div>
  );
}