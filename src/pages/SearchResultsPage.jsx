// ==========================================================================
// CAREERLY — SEARCH RESULTS PAGE
// Filterable job list.
// ==========================================================================
import React, { useState } from "react";
import TopBar from "../components/TopBar";
import { jobs, filters } from "../data";
import Icon from "../components/Icons";

export default function SearchResultsPage({ onSelectJob, onBack }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = jobs.filter((j) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Remote") return j.location === "Remote";
    if (activeFilter === "Adelaide SA") return j.location.includes("Adelaide");
    return j.type === activeFilter;
  });

  return (
    <>
      <TopBar avatarLetter="T" onMenu={() => {}} onOpenApp={() => {}} />
      <main className="page">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
          <button className="icon-btn" onClick={onBack} aria-label="Back" style={{ marginLeft: "-8px" }}>
            <Icon name="back" />
          </button>
          <h2 className="section-title">Search results</h2>
        </div>
        <p className="section-sub">{filtered.length} jobs found</p>

        <div className="filters-bar">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-chip${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="result-list">
          {filtered.map((job) => {
            const shapes = {
              circle: <circle cx="12" cy="12" r="10" fill={job.logoColor} />,
              diamond: <path d="M12 2L2 7l10 5 10-5z" fill={job.logoColor} />,
              square: <rect x="3" y="3" width="18" height="18" rx="4" fill={job.logoColor} />,
            };
            return (
              <div
                key={job.id}
                className="card result-card"
                onClick={() => onSelectJob(job.id)}
              >
                <div className="logo-box">
                  <svg viewBox="0 0 24 24" width="28" height="28">{shapes[job.logoShape]}</svg>
                </div>
                <div className="body">
                  <div className="title">{job.title}</div>
                  <div className="company">{job.company}</div>
                  <div className="tags">
                    <span className="tag">{job.location}</span>
                    <span className="tag">{job.type}</span>
                    <span className="tag salary">{job.salary}</span>
                    <span className="tag">{job.posted}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="empty-state">No jobs match that filter.</div>
          )}
        </div>
      </main>
    </>
  );
}
