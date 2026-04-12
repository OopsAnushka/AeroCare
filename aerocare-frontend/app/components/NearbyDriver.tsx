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

  <div className="section-heading">
    Nearby Drivers
  </div>

  <div className="drivers-strip">

    <div className="driver-card">
      <div className="driver-row">
        <div className="driver-avatar">🚑</div>

        <div className="driver-info">
          <div className="driver-info-name">Sheyas Iyer</div>
          <div className="driver-info-vehicle">Ambulance • MP09 AB1234</div>
        </div>

        <div className="driver-eta-pill">3 min</div>
      </div>

      <div className="driver-meta">
        <div className="driver-rating">⭐ 4.8</div>
        <button className="driver-call">Call</button>
      </div>
    </div>

    <div className="driver-card">
      <div className="driver-row">
        <div className="driver-avatar">🚑</div>

        <div className="driver-info">
          <div className="driver-info-name">Rohit Sharma</div>
          <div className="driver-info-vehicle">ICU Van • MP09 XY7890</div>
        </div>

        <div className="driver-eta-pill">5 min</div>
      </div>

      <div className="driver-meta">
        <div className="driver-rating">⭐ 4.6</div>
        <button className="driver-call">Call</button>
      </div>
    </div>
        <div className="driver-card">
      <div className="driver-row">
        <div className="driver-avatar">🚑</div>

        <div className="driver-info">
          <div className="driver-info-name">Virat Kohli</div>
          <div className="driver-info-vehicle">ICU Van • MP09 XY9669</div>
        </div>

        <div className="driver-eta-pill">5 min</div>
      </div>

      <div className="driver-meta">
        <div className="driver-rating">⭐ 4.8</div>
        <button className="driver-call">Call</button>
      </div>
    </div>
        <div className="driver-card">
      <div className="driver-row">
        <div className="driver-avatar">🚑</div>

        <div className="driver-info">
          <div className="driver-info-name">MS Dhoni</div>
          <div className="driver-info-vehicle">ICU Van • MP09 XY5226</div>
        </div>

        <div className="driver-eta-pill">5 min</div>
      </div>

      <div className="driver-meta">
        <div className="driver-rating">⭐ 4.9</div>
        <button className="driver-call">Call</button>
      </div>
    </div>
  </div>

</div>
  );
}