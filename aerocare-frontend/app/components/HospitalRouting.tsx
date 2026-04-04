"use client";

export default function HospitalRouting() {
  return (
    <div className="hospital-wrapper">

      <h2 className="hospital-title">
        Nearby Hospitals
      </h2>

      {/* card 1 */}
      <div className="hospital-card">

        <div className="hospital-left">
          <div className="hospital-icon">🏥</div>

          <div>
            <div className="hospital-name">
              Apollo Hospital <span className="hospital-dot"/>
            </div>

            <div className="hospital-meta">
              Vijay Nagar • 1.2 km • 5 min
            </div>

            <div className="hospital-tags">
              <span>ICU</span>
              <span>Emergency</span>
              <span>24/7</span>
            </div>

          </div>
        </div>

        <div className="hospital-right">
          <div className="bed-count">
            8 Beds
          </div>

          <button className="route-btn">
            Route
          </button>
        </div>

      </div>


      {/* card 2 */}
      <div className="hospital-card">

        <div className="hospital-left">
          <div className="hospital-icon">🏥</div>

          <div>
            <div className="hospital-name">
              Care CHL Hospital <span className="hospital-dot"/>
            </div>

            <div className="hospital-meta">
              Palasia • 2.4 km • 8 min
            </div>

            <div className="hospital-tags">
              <span>Trauma</span>
              <span>Emergency</span>
              <span>ICU</span>
            </div>

          </div>
        </div>

        <div className="hospital-right">
          <div className="bed-count">
            3 Beds
          </div>

          <button className="route-btn">
            Route
          </button>
        </div>

      </div>

    </div>
  );
}