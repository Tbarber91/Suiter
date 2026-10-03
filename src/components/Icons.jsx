// ==========================================================================
// CAREERLY — ICON SET
// Reusable inline SVG icons. Usage: <Icon name="search" size={18} />
// ==========================================================================
import React from "react";

const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  star: <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.3l1.6-6.8L2.3 8.9l6.9-.6z" />,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  heart: <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1.2 3.5 2 .5-.8 1.5-2 3.5-2 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" />,
  chat: <path d="M21 11.5a8.5 8.5 0 1 1-3.5-6.9L21 3l-1.4 4.1A8.5 8.5 0 0 1 21 11.5z" />,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v9h14v-9" /></>,
  arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  home: <path d="M3 9.5 12 3l9 6.5M5 10v10h14V10" />,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>,
  mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

export default function Icon({ name, size = 24, color = "currentColor", stroke = 2, ...props }) {
  const isFilled = ["star", "heart"].includes(name);
  const Tag = isFilled ? "svg" : "svg";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? color : "none"}
      stroke={isFilled ? "none" : color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name] || null}
    </svg>
  );
}
