"use client";

export default function MedicineLocate() {
  return (
    <div className="med-wrapper">

      <h2 className="med-title">Nearby Medical Stores</h2>

      <div className="med-card">

        <div className="med-left">
          <div className="med-icon">💊</div>

          <div>
            <div className="med-name">Apollo Pharmacy</div>
            <div className="med-meta">0.4 km • Open 24/7</div>
          </div>

        </div>

        <button className="med-btn">
          Locate
        </button>

      </div>

      <div className="med-card">

        <div className="med-left">
          <div className="med-icon">💊</div>

          <div>
            <div className="med-name">MedPlus Store</div>
            <div className="med-meta">1.1 km • Open</div>
          </div>

        </div>

        <button className="med-btn">
          Locate
        </button>

      </div>

    </div>
  );
}