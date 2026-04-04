"use client";

export default function HealthRecords() {
  return (
    <div className="record-wrapper">

      <h2 className="record-title">Health Records</h2>

      <div className="record-card">
        <div>
          <div className="record-name">Blood Test Report</div>
          <div className="record-date">12 March 2026</div>
        </div>

        <button className="record-btn">View</button>
      </div>

      <div className="record-card">
        <div>
          <div className="record-name">X-Ray Chest</div>
          <div className="record-date">28 Feb 2026</div>
        </div>

        <button className="record-btn">View</button>
      </div>

      <div className="record-card">
        <div>
          <div className="record-name">Prescription</div>
          <div className="record-date">21 Feb 2026</div>
        </div>

        <button className="record-btn">View</button>
      </div>

    </div>
  );
}