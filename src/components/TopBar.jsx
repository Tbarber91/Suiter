// ==========================================================================
// CAREERLY — TOP BAR
// Reusable sticky header. Pass brand, avatarLetter, onMenu.
// ==========================================================================
import React from "react";
import Icon from "./Icons";

export default function TopBar({ brand = "Careerly", avatarLetter = "T", onMenu, onOpenApp }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        {brand}
      </div>
      <div className="topbar-actions">
        <button className="chip-btn" onClick={onOpenApp}>Open app</button>
        <div className="avatar" aria-label="User avatar">{avatarLetter}</div>
        <button className="icon-btn" aria-label="Menu" onClick={onMenu}>
          <Icon name="menu" />
        </button>
      </div>
    </header>
  );
}
