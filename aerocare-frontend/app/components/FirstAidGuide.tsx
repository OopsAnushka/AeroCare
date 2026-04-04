"use client";

export default function FirstAidGuide() {
  return (
    <div className="aid-wrapper">

      <h2 className="aid-title">Emergency First Aid Guides</h2>

      <div className="aid-card">
        <div className="aid-left">
          <div className="aid-icon">❤️</div>
          <div>
            <div className="aid-name">CPR - Cardiac Arrest</div>
            <div className="aid-meta">Step-by-step life saving guide</div>
          </div>
        </div>
        <button className="aid-btn">Open Guide</button>
      </div>

      <div className="aid-card">
        <div className="aid-left">
          <div className="aid-icon">🩸</div>
          <div>
            <div className="aid-name">Heavy Bleeding</div>
            <div className="aid-meta">Control bleeding quickly</div>
          </div>
        </div>
        <button className="aid-btn">Open Guide</button>
      </div>

      <div className="aid-card">
        <div className="aid-left">
          <div className="aid-icon">🔥</div>
          <div>
            <div className="aid-name">Burn Injury</div>
            <div className="aid-meta">Immediate burn treatment</div>
          </div>
        </div>
        <button className="aid-btn">Open Guide</button>
      </div>

    </div>
  );
}