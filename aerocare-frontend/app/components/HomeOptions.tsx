"use client";

import { useEffect, useState } from "react";

export default function HomeOptions() {

  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/hospitals")
      .then(res => res.json())
      .then(data => setHospitals(data))
      .catch(err => console.log(err));
  }, []);

  const modules = [
    {
      icon: "🏥",
      label: "Hospital Routing",
      desc: `${hospitals.length} hospitals available`,
      iconClass: "module-icon-blue",
      tag: "Live",
      tagClass: "tag-live",
    },
    {
      icon: "👥",
      label: "Samaritan Radar",
      desc: "8 CPR volunteers within 500m",
      iconClass: "module-icon-green",
      tag: "8 nearby",
      tagClass: "tag-near",
    },
    {
      icon: "🩸",
      label: "Blood Donors",
      desc: "B+ donors available near Vijay Nagar",
      iconClass: "module-icon-red",
      tag: "Urgent",
      tagClass: "tag-urgent",
    },
    {
      icon: "📋",
      label: "First Aid Guide",
      desc: "30+ step-by-step offline guides",
      iconClass: "module-icon-purple",
      tag: "Offline",
      tagClass: "tag-new",
    },
    {
      icon: "💊",
      label: "Medicine Locate",
      desc: "Find 24hr pharmacies nearby",
      iconClass: "module-icon-amber",
      tag: "Open now",
      tagClass: "tag-amber",
    },
    {
      icon: "🧬",
      label: "Health Records",
      desc: "Your medical history & documents",
      iconClass: "module-icon-purple",
      tag: "Secure",
      tagClass: "tag-near",
    },
  ];

  return (
    <section className="modules-section">
      <p className="section-heading">Quick Access Modules</p>

      <div className="modules-grid">
        {modules.map((m, index) => (
          <div key={index} className="module-card">

            <div className={`module-icon-wrap ${m.iconClass}`}>
              {m.icon}
            </div>

            <p className="module-name">{m.label}</p>
            <p className="module-desc">{m.desc}</p>

            <span className={`module-tag ${m.tagClass}`}>
              {m.tag}
            </span>

          </div>
        ))}
      </div>
    </section>
  );
}