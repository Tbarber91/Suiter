// ==========================================================================
// CAREERLY — JOB DETAIL PAGE
// ==========================================================================
import React from "react";
import TopBar from "../components/TopBar";
import Button from "../components/Button";
import { jobs, companies } from "../data";
import Icon from "../components/Icons";

export default function JobDetailPage({ jobId, onBack }) {
  const job = jobs.find((j) => j.id === jobId) || jobs[0];
  const company = companies.find((c) => c.id === job.companyId);

  const shapes = {
    circle: <circle cx="12" cy="12" r="10" fill={job.logoColor} />,
    diamond: <path d="M12 2L2 7l10 5 10-5z" fill={job.logoColor} />,
    square: <rect x="3" y="3" width="18" height="18" rx="4" fill={job.logoColor} />,
  };

  return (
    <>
      <section className="detail-hero">
        <button className="back-btn" onClick={onBack}>
          <Icon name="back" size={16} /> Back
        </button>
        <div className="company-line">
          <div className="logo-box">
            <svg viewBox="0 0 24 24" width="28" height="28">{shapes[job.logoShape]}</svg>
          </div>
          <strong>{job.company}</strong>
        </div>
        <h1>{job.title}</h1>
        <div className="detail-meta">
          <span className="meta-chip">{job.location}</span>
          <span className="meta-chip">{job.type}</span>
          <span className="meta-chip">{job.salary}</span>
          <span className="meta-chip">Posted {job.posted}</span>
        </div>
      </section>

      <main className="page">
        <section className="detail-section">
          <h2>About the role</h2>
          <p>
            We are looking for an experienced {job.title} to join {job.company} in {job.location}.
            You'll be responsible for driving key initiatives, collaborating across teams,
            and delivering outcomes that matter.
          </p>
        </section>

        <section className="detail-section">
          <h2>Key responsibilities</h2>
          <ul className="bullet-list">
            <li>Lead end-to-end delivery of strategic projects</li>
            <li>Collaborate with stakeholders to define requirements</li>
            <li>Mentor junior team members and share knowledge</li>
            <li>Drive continuous improvement initiatives</li>
          </ul>
        </section>

        <section className="detail-section">
          <h2>What you'll bring</h2>
          <ul className="bullet-list">
            <li>Proven experience in a similar role</li>
            <li>Strong communication and stakeholder management skills</li>
            <li>Ability to work autonomously in a fast-paced environment</li>
          </ul>
        </section>

        {company && (
          <section className="detail-section">
            <h2>About {company.name}</h2>
            <p>{company.tagline} · {company.rating} ★ · {company.reviews} Reviews · {company.location}</p>
          </section>
        )}
      </main>

      <div className="apply-bar">
        <Button variant="outline" onClick={onBack}>Save</Button>
        <Button variant="primary" onClick={() => {}}>Apply now</Button>
      </div>
    </>
  );
}
