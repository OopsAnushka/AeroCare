"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { label: "Home", icon: "🏠", path: "/" },
  { label: "Track", icon: "🗺️", path: "/activity" },
  { label: "History", icon: "📋", path: "/pages" },
  { label: "Profile", icon: "👤", path: "/account" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const active = pathname === tab.path;

        return (
          <button
            key={tab.path}
            onClick={() => router.push(tab.path)}
            className="bnav-item"
          >
            <span className="bnav-icon">{tab.icon}</span>

            <span className={`bnav-label ${active ? "active" : ""}`}>
              {tab.label}
            </span>

            {active && <div className="bnav-dot" />}
          </button>
        );
      })}
    </nav>
  );
}