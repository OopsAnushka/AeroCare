"use client";

const stats = [
  { num: "24",  label: "Ambulances Online" },
  { num: "98%", label: "Service Uptime" },
  { num: "12k", label: "Lives Helped" },
];

export default function StatsRow() {
  return (
    <div className="stats-section">
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-num">{s.num}</span>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}