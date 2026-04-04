"use client";

export default function BloodDonor() {
  return (
    <div className="donor-wrapper">

      <h2 className="donor-title">
        Nearby Blood Donors
      </h2>

      {/* card 1 */}
      <div className="donor-card">

        <div className="donor-left">
          <div className="donor-avatar">🩸</div>

          <div>
            <div className="donor-name">
              Rahul Sharma <span className="online-dot"/>
            </div>

            <div className="donor-meta">
              0.3 km • ETA: 2 min
            </div>
          </div>
        </div>

        <div className="donor-right">
          <div className="donor-tags">
            <span>O+</span>
            <span>Available</span>
          </div>

          <button className="donor-btn">
            Request Blood
          </button>
        </div>

      </div>


      {/* card 2 */}
      <div className="donor-card">

        <div className="donor-left">
          <div className="donor-avatar">🩸</div>

          <div>
            <div className="donor-name">
              Priya Patel <span className="online-dot"/>
            </div>

            <div className="donor-meta">
              0.8 km • ETA: 5 min
            </div>
          </div>
        </div>

        <div className="donor-right">
          <div className="donor-tags">
            <span>B+</span>
            <span>Available</span>
          </div>

          <button className="donor-btn">
            Request Blood
          </button>
        </div>

      </div>

    </div>
  );
}