// ==========================================================================
// CAREERLY — FEATURE PILLARS
// Array of {icon, title, subtitle}.
// ==========================================================================
import React from "react";

export default function FeaturePillars({ pillars = [] }) {
  return (
    <section className="pillars">
      {pillars.map((p, i) => (
        <div className="pillar" key={i}>
          <div className="pillar-illo">{p.icon}</div>
          <h3>{p.title}</h3>
          <p>{p.subtitle}</p>
        </div>
      ))}
    </section>
  );
}
