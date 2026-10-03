// ==========================================================================
// CAREERLY — HERO BANNER
// Navy banner with curved wave accent + search input.
// ==========================================================================
import React from "react";
import Icon from "./Icons";

export default function Hero({ title, subtitle, onSearch }) {
  return (
    <section className="hero">
      <svg className="hero-wave" viewBox="0 0 200 200" aria-hidden="true">
        <path d="M100,20 C150,20 180,60 180,100 C180,150 140,180 100,180 C50,180 20,140 20,100 C20,60 60,20 100,20 Z" fill="none" stroke="var(--navy-600)" strokeWidth="3" />
        <path d="M100,40 C140,40 160,70 160,100 C160,140 130,160 100,160 C70,160 40,140 40,100 C40,70 60,40 100,40 Z" fill="none" stroke="var(--navy-600)" strokeWidth="3" />
      </svg>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      <div className="hero-search">
        <Icon name="search" size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by company name"
          aria-label="Search by company name"
          onKeyDown={(e) => e.key === "Enter" && onSearch?.(e.target.value)}
        />
      </div>
    </section>
  );
}
