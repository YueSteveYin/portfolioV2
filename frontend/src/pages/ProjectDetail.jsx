// src/pages/ProjectDetail.jsx
import { useParams } from "react-router-dom";

export default function ProjectDetail() {
  const { slug } = useParams();
  const styles = {
    h2: { fontSize: "32px", margin: 0 },
    p: { marginTop: "12px", color: "#334155", lineHeight: 1.6 },
    box: {
      marginTop: "24px",
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.7)",
    },
    code: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
  };

  return (
    <div>
      <h2 style={styles.h2}>
        Project: <span style={styles.code}>{slug}</span>
      </h2>
      <p style={styles.p}>
        Replace this with real project content later (from local data → JSON →
        backend).
      </p>
      <div style={styles.box}>Case study sections go here.</div>
    </div>
  );
}
