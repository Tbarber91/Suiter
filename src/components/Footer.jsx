// ==========================================================================
// CAREERLY — FOOTER + BOTTOM NAV
// ==========================================================================
import React from "react";
import Icon from "./Icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div className="footer-col">
          <h4>Job seekers</h4>
          <ul>
            <li><a href="#">Browse jobs</a></li>
            <li><a href="#">Career advice</a></li>
            <li><a href="#">Salary guide</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Employers</h4>
          <ul>
            <li><a href="#">Post a job</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function BottomNav({ active, onNavigate }) {
  const items = [
    { key: "home", icon: <Icon name="home" />, label: "Home" },
    { key: "search", icon: <Icon name="search" />, label: "Search" },
    { key: "saved", icon: <Icon name="bookmark" />, label: "Saved" },
    { key: "messages", icon: <Icon name="chat" />, label: "Messages" },
    { key: "profile", icon: <Icon name="user" />, label: "Profile" },
  ];
  return (
    <nav className="bottomnav">
      {items.map((it) => (
        <button
          key={it.key}
          className={active === it.key ? "active" : ""}
          onClick={() => onNavigate?.(it.key)}
        >
          {it.icon}
          {it.label}
        </button>
      ))}
    </nav>
  );
}
