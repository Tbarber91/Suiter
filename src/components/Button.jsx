// ==========================================================================
// CAREERLY — BUTTON
// Variants: outline | primary | pink
// ==========================================================================
import React from "react";

export default function Button({ variant = "primary", block = true, icon, children, ...props }) {
  const cls = `btn btn-${variant}${block ? " btn-block" : ""}`;
  return (
    <button className={cls} {...props}>
      {icon}
      {children}
    </button>
  );
}
