// src/pages/Home.jsx
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { theme } = useOutletContext();
  const styles = {
    h1: { fontSize: "48px", lineHeight: 1.1, margin: 0 },
    p: {
      fontSize: "16px",
      lineHeight: 1.6,
      marginTop: "16px",
      maxWidth: "65ch",
      color: "#334155",
    },
    pill: {
      display: "inline-block",
      marginTop: "16px",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(15,23,42,0.10)",
      color: "#0F172A",
      fontWeight: 700,
      fontSize: "14px",
    },
    accentDot: { color: theme.accent },
  };

  return (
    <div>
      <h1 style={styles.h1}>
        Steve Yin <span style={styles.accentDot}>•</span> Full-stack Engineer
      </h1>
      <div style={styles.pill}>Theme accent: {theme.accent}</div>
      <p style={styles.p}>
        I build clean, fast product experiences end-to-end (frontend + backend).
        This site uses a “folder stack” UI where each page has its own theme
        color.
      </p>
    </div>
  );
}
