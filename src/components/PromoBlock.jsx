// ==========================================================================
// CAREERLY — PROMO BLOCK
// Illustration badge + text + button.
// tint: "pink" | "blue"
// ==========================================================================
import React from "react";
import Button from "./Button";

export default function PromoBlock({ tint = "pink", icon, text, buttonLabel, onButtonClick }) {
  return (
    <section className="promo">
      <div className={`promo-illo illo-${tint}`}>{icon}</div>
      <p>{text}</p>
      <Button variant="outline" onClick={onButtonClick}>{buttonLabel}</Button>
    </section>
  );
}
