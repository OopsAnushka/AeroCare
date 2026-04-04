"use client";

const activities = [
  {
    icon: "🚑",
    iconBg: "module-icon-red",
    title: "Emergency Ambulance",
    meta: "MG Road → Bombay Hospital · 12 Apr 2025",
    status: "Completed",
    statusClass: "status-completed",
  },
  {
    icon: "🩸",
    iconBg: "module-icon-green",
    title: "Blood Request — B+",
    meta: "Vijay Nagar · 10 Apr 2025 · 2 donors matched",
    status: "Completed",
    statusClass: "status-completed",
  },
  {
    icon: "🚑",
    iconBg: "module-icon-amber",
    title: "Scheduled Transfer",
    meta: "CARE Hospital → Airport · 8 Apr 2025",
    status: "Cancelled",
    statusClass: "status-cancelled",
  },
  {
    icon: "🏥",
    iconBg: "module-icon-blue",
    title: "Hospital Routing",
    meta: "Nearest ICU — Kokilaben found · 2 Apr 2025",
    status: "Completed",
    statusClass: "status-completed",
  },
];

export default function RecentActivity() {
  return (
    <div className="activity-section">
      <p className="section-heading">Recent Activity</p>
      <div className="activity-list">
        {activities.map((a) => (
          <div key={a.title} className="activity-item">
            <div className={`activity-icon-wrap ${a.iconBg}`}>{a.icon}</div>
            <div className="activity-details">
              <p className="activity-title">{a.title}</p>
              <p className="activity-meta">{a.meta}</p>
            </div>
            <span className={`activity-status ${a.statusClass}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}