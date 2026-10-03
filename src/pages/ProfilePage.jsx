// ==========================================================================
// CAREERLY — PROFILE PAGE
// ==========================================================================
import React from "react";
import TopBar from "../components/TopBar";
import Button from "../components/Button";
import { Footer } from "../components/Footer";

export default function ProfilePage({ onNavigate }) {
  const completion = 65;

  const items = [
    { label: "Resume", value: "Uploaded" },
    { label: "Phone number", value: "Verified" },
    { label: "Location", value: "Adelaide SA 5000" },
    { label: "Job alert preferences", value: "Founder · Adelaide" },
    { label: "Visibility", value: "Visible to employers" },
  ];

  return (
    <>
      <TopBar avatarLetter="T" onMenu={() => {}} onOpenApp={() => {}} />

      <section className="profile-header">
        <div className="avatar-lg">T</div>
        <h1>Tamara</h1>
        <p>Member since 2026</p>
      </section>

      <main className="page">
        <div className="profile-completion">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--s-2)" }}>
            <strong>Profile completion</strong>
            <span>{completion}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${completion}%` }} />
          </div>
        </div>

        <section className="profile-section">
          <h2>Account details</h2>
          {items.map((it) => (
            <div className="profile-item" key={it.label}>
              <span className="label">{it.label}</span>
              <span className="value">{it.value}</span>
            </div>
          ))}
        </section>

        <section className="profile-section">
          <Button variant="pink" onClick={() => onNavigate("search")}>
            Browse new jobs
          </Button>
          <div style={{ height: "var(--s-3)" }} />
          <Button variant="outline" onClick={() => {}}>Sign out</Button>
        </section>

        <Footer />
      </main>
    </>
  );
}
