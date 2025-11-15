import { useCallback } from "react";

const trustSignals = [
  { title: "Weekend squads", caption: "drop gentle check-ins" },
  { title: "Tiny quests", caption: "keep momentum playful" }
];

const vibeChips = ["Micro-goals", "Gentle nudges", "Cozy accountability"];

export function Hero() {
  const scrollToFeatures = useCallback(() => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="hero">
      <div className="hero__content">
        <p className="eyebrow">Consistency, engineered</p>
        <h1>Soft accountability for people who overthink the gym.</h1>
        <p className="hero__description">
          ArcForge is the hackathon project helping our friends show up with playful check-ins, gentle nudges,
          and zero guilt trips. No funnels, no pitch—just vibes.
        </p>
        <div className="hero__chips">
          {vibeChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
        <div className="hero__cta">
          <button className="btn secondary" onClick={scrollToFeatures}>
            Explore features
          </button>
        </div>
        <div className="hero__trust">
          {trustSignals.map((signal) => (
            <div key={signal.title}>
              <span className="stat">{signal.title}</span>
              <span className="label">{signal.caption}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hero__visual" aria-hidden="true">
        <div className="mood-card">
          <p className="mood-card__eyebrow">Today's intent</p>
          <h3>Leg day with Maya</h3>
          <p className="mood-card__sub">2 gentle quests left</p>
          <div className="mood-card__pill-group">
            <span>Focus room</span>
            <span>Stretch ritual</span>
          </div>
          <div className="mood-card__footer">
            <p>You promised Future You for 14 days</p>
            <small>ArcForge keeps the receipts.</small>
          </div>
        </div>
      </div>
    </section>
  );
}
