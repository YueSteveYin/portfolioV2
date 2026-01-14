// src/components/NavBtn.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function NavBtn({ item, themeMap, pathname }) {
  const [hovered, setHovered] = useState(false);

  const itemAccent = themeMap?.[item.key]?.accent || "#2563EB";
  const active = item.match(pathname);

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={styles.link(itemAccent, hovered, active)}
    >
      <div style={styles.linkText(itemAccent, hovered, active)}>
        {item.label}
      </div>
    </NavLink>
  );
}

const styles = {
  link: (accent, hovered, active) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "46px",
    padding: "0 12px",
    textDecoration: "none",
    border: "1px solid rgba(15, 23, 42, 0.10)",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    color: active ? "#0F172A" : hovered ? "#0F172A" : "#475569",

    backgroundImage: `
      linear-gradient(rgba(248,250,252,0.72), rgba(248,250,252,0.72)),
      linear-gradient(${accent}, ${accent})
    `,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left top, left top",
    backgroundSize: `
      100% 100%,
      ${active || hovered ? "100% 100%" : "0% 100%"}
    `,
    transition: "background-size 320ms ease, color 240ms ease",
  }),

  linkText: (accent, hovered, active) => ({
    position: "relative",
    fontSize: "20px",
    fontWeight: 800,
    paddingBottom: "6px",

    backgroundImage: `linear-gradient(${accent}, ${accent})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    backgroundSize: active || hovered ? "100% 3px" : "0% 3px",
    transition: "background-size 280ms ease",
  }),
};
