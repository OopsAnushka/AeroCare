"use client";

const drivers = [
  { name: "Suresh M.",   vehicle: "MP09-AB-1234", emoji: "👨‍⚕️", rating: "4.9", eta: "3 min" },
  { name: "Priya S.",    vehicle: "MP09-CD-5678", emoji: "👩‍⚕️", rating: "4.8", eta: "5 min" },
  { name: "Anil K.",     vehicle: "MP09-EF-9012", emoji: "👨‍⚕️", rating: "4.7", eta: "7 min" },
  { name: "Meena R.",    vehicle: "MP09-GH-3456", emoji: "👩‍⚕️", rating: "5.0", eta: "9 min" },
];

export default function NearbyDrivers() {
  return (
    <div className="drivers-section">
      <p className="section-heading">Nearby Drivers</p>
      <div className="drivers-strip">
        {drivers.map((d) => (
          <div key={d.name} className="driver-card">
            <div className="driver-avatar-wrap">
              <div className="driver-avatar">{d.emoji}</div>
              <div>
                <p className="driver-info-name">{d.name}</p>
                <p className="driver-info-vehicle">{d.vehicle}</p>
              </div>
            </div>
            <div className="driver-meta">
              <span className="driver-rating">⭐ {d.rating}</span>
              <span className="driver-eta-pill">{d.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}