// src/theme.js
export const THEME = {
  home: { bg: "#050A14", accent: "#22D3EE" },
  projects: { bg: "#07060A", accent: "#D4AF37" },
  experience: { bg: "#FFFFFF", accent: "#000000" },
};

export const PAGES = [
  { key: "home", match: (p) => p === "/" },
  { key: "projects", match: (p) => p.startsWith("/projects") },
  { key: "experience", match: (p) => p.startsWith("/experience") },
];

export function getActiveKey(pathname) {
  const hit = PAGES.find((p) => p.match(pathname));
  return hit ? hit.key : "home";
}
