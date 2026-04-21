"use client";

import { useEffect, useState } from "react";

export default function HomeOptions() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/hospitals")
      .then((res) => res.json())
      .then((data) => setHospitals(data))
      .catch((err) => console.log(err));
  }, []);

  const services = [
    {
      icon: "🚑",
      title: "Book Ambulance",
      desc: "Fast emergency booking in seconds",
    },
    {
      icon: "🩸",
      title: "Blood Request",
      desc: "Find urgent blood donors nearby",
    },
    {
      icon: "🏥",
      title: "Nearby Hospitals",
      desc: "Tap to find hospitals near you",
    },
    {
      icon: "📋",
      title: "First Aid Help",
      desc: "Instant emergency guides",
    },
  ];

  const reasons = [
    {
      icon: "⚡",
      title: "Instant Dispatch",
      desc: "Nearest ambulance located & sent immediately.",
    },
    {
      icon: "🛡️",
      title: "Verified Network",
      desc: "Trusted drivers & partner hospitals.",
    },
    {
      icon: "🌍",
      title: "24 / 7 Availability",
      desc: "Emergency support anytime, anywhere.",
    },
  ];

  return (
    <section className="home-wrap">
      {/* TOP STATS */}
      <div className="dashboard-grid">
        <div className="dash-card highlight">
          <div className="dash-top">
            <span className="dash-icon">🚑</span>
            <span className="dash-badge live">Live</span>
          </div>
          <h3>12</h3>
          <p>Active Ambulances</p>
        </div>

        <div className="dash-card">
          <div className="dash-top">
            <span className="dash-icon">⏱️</span>
            <span className="dash-badge">Fast</span>
          </div>
          <h3>4m</h3>
          <p>Avg. response time</p>
        </div>

        <div className="dash-card">
          <div className="dash-top">
            <span className="dash-icon">🏥</span>
            <span className="dash-badge blue">Open</span>
          </div>
          <h3>{hospitals.length}</h3>
          <p>Hospitals available</p>
        </div>

        <div className="dash-card">
          <div className="dash-top">
            <span className="dash-icon">🩸</span>
            <span className="dash-badge green">Urgent</span>
          </div>
          <h3>18</h3>
          <p>Blood donors ready</p>
        </div>
      </div>

      {/* REPLACED QUICK ACCESS + WHY SECTION */}
      <div className="bottom-grid">
        {/* LEFT SIDE */}
        <div className="panel">
          <h2 className="panel-title">
            Quick Access
          </h2>

          {services.map((item, i) => (
            <div key={i} className="row-card">
              <div className="row-left">
                <div className="mini-icon">
                  {item.icon}
                </div>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>

              <span className="arrow">›</span>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="panel">
          <h2 className="panel-title">
            Why AeroCare
          </h2>

          {reasons.map((item, i) => (
            <div key={i} className="row-card">
              <div className="row-left">
                <div className="mini-icon gray">
                  {item.icon}
                </div>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}