// ==========================================================================
// CAREERLY — COMPANY CARD
// logoColor: hex string for the logo glyph fill.
// ==========================================================================
import React from "react";
import Icon from "./Icons";

export default function CompanyCard({ name, logoColor = "#1952a8", logoShape = "circle", rating, reviews, jobs, onClick }) {
  const shapes = {
    circle: <circle cx="12" cy="12" r="10" fill={logoColor} />,
    diamond: <path d="M12 2L2 7l10 5 10-5z" fill={logoColor} />,
    square: <rect x="3" y="3" width="18" height="18" rx="4" fill={logoColor} />,
  };
  return (
    <article className={`card company-card${onClick ? " clickable" : ""}`} onClick={onClick}>
      <div className="company-logo">
        <svg viewBox="0 0 24 24">{shapes[logoShape]}</svg>
      </div>
      <div className="company-name">{name}</div>
      <div className="rating-row">
        <Icon name="star" size={14} className="star" />
        <span>{rating}</span>
        <span className="dot">•</span>
        <span>{reviews} Reviews</span>
      </div>
      <span className="jobs-pill">{jobs} Jobs</span>
    </article>
  );
}
