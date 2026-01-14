// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  const styles = {
    h2: { fontSize: "32px", margin: 0 },
    p: { marginTop: "12px", color: "#334155" },
    a: {
      display: "inline-block",
      marginTop: "16px",
      color: "#2563EB",
      fontWeight: 800,
      textDecoration: "none",
    },
  };

  return (
    <div>
      <h2 style={styles.h2}>404</h2>
      <p style={styles.p}>That page doesn’t exist.</p>
      <Link to="/" style={styles.a}>
        Go home
      </Link>
    </div>
  );
}
