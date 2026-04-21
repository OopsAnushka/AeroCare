"use client";

import { useState } from "react";

type SupportLevel = "bls" | "als";
type Step = { icon: string; title: string; desc: string; time?: string };
type Protocol = { id: string; label: string; steps: Step[] };

const BLS_PROTOCOLS: Protocol[] = [
  {
    id: "cpr",
    label: "CPR Protocol",
    steps: [
      { icon: "📞", title: "Call 112", desc: "Call emergency services immediately or ask a bystander to call.", time: "0–30s" },
      { icon: "🔍", title: "Check Responsiveness", desc: "Tap shoulders firmly and shout 'Are you okay?' Check for breathing.", time: "30s" },
      { icon: "🫁", title: "Open Airway", desc: "Tilt head back, lift chin. Look, listen, feel for breathing for no more than 10 seconds.", time: "10s" },
      { icon: "💓", title: "Start Compressions", desc: "30 chest compressions — hard and fast. Push at least 2 inches deep at 100–120/min.", time: "Continuous" },
      { icon: "💨", title: "Rescue Breaths", desc: "2 rescue breaths after every 30 compressions. Pinch nose, seal mouth, breathe for 1 second each.", time: "2 breaths" },
      { icon: "⚡", title: "Use AED if Available", desc: "Turn on AED, follow voice prompts. Resume CPR immediately after shock.", time: "ASAP" },
    ],
  },
  {
    id: "choking",
    label: "Choking Adult",
    steps: [
      { icon: "🙋", title: "Confirm Choking", desc: "Ask 'Are you choking?' If they cannot speak, cough, or breathe — act now.", time: "Instant" },
      { icon: "🤜", title: "5 Back Blows", desc: "Lean them forward. Give 5 firm blows between shoulder blades with heel of hand.", time: "5 blows" },
      { icon: "✊", title: "5 Abdominal Thrusts", desc: "Stand behind, make a fist above navel. Pull sharply inward and upward 5 times.", time: "5 thrusts" },
      { icon: "🔁", title: "Alternate & Repeat", desc: "Keep alternating 5 back blows + 5 abdominal thrusts until object dislodges or they lose consciousness.", time: "Repeat" },
      { icon: "📞", title: "Call 112 if Unconscious", desc: "If they become unconscious, lower carefully to ground and begin CPR. Call 112 immediately.", time: "If needed" },
    ],
  },
  {
    id: "bleeding",
    label: "Severe Bleeding",
    steps: [
      { icon: "🧤", title: "Protect Yourself", desc: "If available, wear gloves. Avoid direct contact with blood.", time: "First" },
      { icon: "🩹", title: "Apply Direct Pressure", desc: "Use a clean cloth or bandage. Press firmly on the wound without lifting.", time: "Non-stop" },
      { icon: "🦾", title: "Tourniquet if Limb", desc: "If bleeding is from arm/leg and uncontrolled, apply tourniquet 2 inches above wound. Note the time.", time: "If needed" },
      { icon: "📐", title: "Elevate the Limb", desc: "Raise the injured area above heart level to slow blood flow.", time: "Maintain" },
      { icon: "📞", title: "Call for Help", desc: "Maintain pressure and call 112. Do not remove soaked bandages — add more on top.", time: "Urgent" },
    ],
  },
];

const ALS_PROTOCOLS: Protocol[] = [
  {
    id: "acls",
    label: "ACLS — Cardiac Arrest",
    steps: [
      { icon: "⚡", title: "High-Quality CPR", desc: "Begin CPR immediately. 30:2 ratio, 100–120/min. Minimize interruptions to < 10 seconds.", time: "Immediate" },
      { icon: "🔌", title: "IV/IO Access", desc: "Establish intravenous or intraosseous access for medication delivery.", time: "Early" },
      { icon: "💊", title: "Epinephrine 1mg IV", desc: "Administer epinephrine 1mg IV/IO every 3–5 minutes. For VF/pVT — Amiodarone 300mg first dose.", time: "3–5 min" },
      { icon: "📺", title: "Monitor & Rhythm Check", desc: "Attach cardiac monitor. Identify rhythm — shockable (VF/pVT) or non-shockable (PEA/Asystole).", time: "Continuous" },
      { icon: "🔬", title: "Identify H's and T's", desc: "Treat reversible causes: Hypoxia, Hypovolemia, Hypo/Hyperkalemia, Tension Pneumo, Tamponade, Toxins, Thrombosis.", time: "Ongoing" },
      { icon: "🏥", title: "Post-ROSC Care", desc: "After return of spontaneous circulation: 12-lead ECG, targeted temperature management, ICU transfer.", time: "Post-arrest" },
    ],
  },
  {
    id: "airway",
    label: "Advanced Airway",
    steps: [
      { icon: "😮", title: "BVM Ventilation First", desc: "Begin bag-valve-mask ventilation with 100% O₂ before attempting advanced airway.", time: "First" },
      { icon: "🔦", title: "RSI if Indicated", desc: "Rapid Sequence Intubation: Preoxygenate → Sedation (Ketamine/Etomidate) → Succinylcholine 1.5mg/kg.", time: "RSI" },
      { icon: "🫁", title: "Endotracheal Intubation", desc: "Insert ETT, confirm with waveform capnography (EtCO₂ 35–45 mmHg). Secure tube, CXR to confirm position.", time: "Confirm" },
      { icon: "📊", title: "Ventilator Settings", desc: "TV 6–8 mL/kg IBW, RR 10–12/min, FiO₂ 100% initially then titrate SpO₂ 94–98%.", time: "Set" },
      { icon: "🔁", title: "Supraglottic Alternative", desc: "If intubation fails — insert LMA or King LT. Maximum 2 attempts before surgical airway.", time: "Fallback" },
    ],
  },
  {
    id: "stroke",
    label: "Acute Stroke (FAST)",
    steps: [
      { icon: "😶", title: "F — Face Drooping", desc: "Ask patient to smile. Is one side drooping? Uneven smile = stroke sign.", time: "Check" },
      { icon: "💪", title: "A — Arm Weakness", desc: "Ask them to raise both arms. Does one drift downward? Arm weakness = stroke sign.", time: "Check" },
      { icon: "🗣️", title: "S — Speech Difficulty", desc: "Ask to repeat a simple phrase. Is speech slurred, strange, or unable to speak?", time: "Check" },
      { icon: "⏰", title: "T — Time to Call 112", desc: "If ANY sign present, call 112 IMMEDIATELY. Note the exact time symptoms started.", time: "NOW" },
      { icon: "🏥", title: "CT Scan & tPA Window", desc: "Target CT within 25 min of arrival. tPA eligible within 4.5 hours of symptom onset. BP management.", time: "Hospital" },
      { icon: "🚫", title: "Do NOT give food/water", desc: "NPO until swallow assessed. Keep patient calm, lying flat or 15° head elevated. Do not give aspirin if hemorrhagic stroke suspected.", time: "Always" },
    ],
  },
];

export default function LifeSupport() {
  const [level, setLevel] = useState<SupportLevel>("bls");
  const [activeProtocol, setActiveProtocol] = useState<string>("cpr");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const protocols = level === "bls" ? BLS_PROTOCOLS : ALS_PROTOCOLS;
  const currentProtocol = protocols.find((p) => p.id === activeProtocol) || protocols[0];

  const handleLevelSwitch = (l: SupportLevel) => {
    setLevel(l);
    setActiveProtocol(l === "bls" ? "cpr" : "acls");
    setExpandedStep(null);
  };

  return (
    <section className="ls-wrap">
      {/* ── HEADER ── */}
      <div className="ls-header">
        <div className="ls-header-left">
          <div className="ls-header-badge">
            <span className="ls-badge-dot" />
            EMERGENCY PROTOCOLS
          </div>
          <h2 className="ls-title">Life Support Guide</h2>
          <p className="ls-subtitle">
            Step-by-step protocols for emergency responders and bystanders.
          </p>
        </div>

        {/* Level Toggle */}
        <div className="ls-toggle-wrap">
          <button
            className={`ls-toggle-btn ${level === "bls" ? "ls-toggle-btn--active-bls" : ""}`}
            onClick={() => handleLevelSwitch("bls")}
          >
            <span className="ls-toggle-icon">🫀</span>
            <div>
              <div className="ls-toggle-label">BLS</div>
              <div className="ls-toggle-sub">Basic Life Support</div>
            </div>
          </button>
          <button
            className={`ls-toggle-btn ${level === "als" ? "ls-toggle-btn--active-als" : ""}`}
            onClick={() => handleLevelSwitch("als")}
          >
            <span className="ls-toggle-icon">🏥</span>
            <div>
              <div className="ls-toggle-label">ALS</div>
              <div className="ls-toggle-sub">Advanced Life Support</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="ls-body">
        {/* Protocol Sidebar */}
        <div className="ls-sidebar">
          <div className="ls-sidebar-label">SELECT PROTOCOL</div>
          {protocols.map((p) => (
            <button
              key={p.id}
              className={`ls-proto-btn ${activeProtocol === p.id ? "ls-proto-btn--active" : ""}`}
              onClick={() => { setActiveProtocol(p.id); setExpandedStep(null); }}
              style={{
                "--pcolor": level === "bls" ? "#ef4444" : "#3b82f6",
              } as React.CSSProperties}
            >
              <span className="ls-proto-indicator" />
              {p.label}
            </button>
          ))}

          {/* Info box */}
          <div className={`ls-info-box ${level === "als" ? "ls-info-box--als" : ""}`}>
            {level === "bls" ? (
              <>
                <div className="ls-info-icon">ℹ️</div>
                <p className="ls-info-text">BLS can be performed by trained bystanders. No advanced equipment needed.</p>
              </>
            ) : (
              <>
                <div className="ls-info-icon">⚠️</div>
                <p className="ls-info-text">ALS protocols require certified medical personnel and advanced equipment.</p>
              </>
            )}
          </div>
        </div>

        {/* Steps Panel */}
        <div className="ls-steps-panel">
          <div className="ls-steps-header">
            <h3 className="ls-steps-title">{currentProtocol.label}</h3>
            <span className="ls-steps-count">{currentProtocol.steps.length} Steps</span>
          </div>

          <div className="ls-steps-list">
            {currentProtocol.steps.map((step, i) => (
              <div
                key={i}
                className={`ls-step ${expandedStep === i ? "ls-step--expanded" : ""}`}
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                style={{
                  "--stepcolor": level === "bls" ? "#ef4444" : "#3b82f6",
                  "--stepbg": level === "bls" ? "rgba(239,68,68,0.07)" : "rgba(59,130,246,0.07)",
                } as React.CSSProperties}
              >
                <div className="ls-step-left">
                  <div className="ls-step-num-wrap">
                    <div className="ls-step-num">{i + 1}</div>
                    {i < currentProtocol.steps.length - 1 && (
                      <div className="ls-step-connector" />
                    )}
                  </div>
                  <div className="ls-step-content">
                    <div className="ls-step-top">
                      <span className="ls-step-icon">{step.icon}</span>
                      <span className="ls-step-title">{step.title}</span>
                      {step.time && (
                        <span className="ls-step-time">{step.time}</span>
                      )}
                      <span className="ls-step-chevron">
                        {expandedStep === i ? "▲" : "▼"}
                      </span>
                    </div>
                    {expandedStep === i && (
                      <div className="ls-step-desc">{step.desc}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </section>
  );
}