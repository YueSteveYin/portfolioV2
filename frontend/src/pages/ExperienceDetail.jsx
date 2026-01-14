import { useParams, Link } from "react-router-dom";
import experiences from "../data/experiences.json";

export default function ExperienceDetail() {
  const { slug } = useParams();
  const exp = experiences.find((e) => e.id === slug);

  const styles = {
    back: {
      display: "inline-block",
      marginBottom: "16px",
      color: "#2563EB",
      fontWeight: 800,
      textDecoration: "none",
    },
    h1: {
      fontSize: "32px",
      margin: 0,
    },
    p: {
      marginTop: "12px",
      lineHeight: 1.6,
      color: "rgba(15,23,42,0.75)",
    },
    card: {
      marginTop: "24px",
      padding: "24px",
      borderRadius: "18px",
      border: "1px solid rgba(15,23,42,0.1)",
      background: "rgba(255,255,255,0.7)",
    },
  };

  if (!exp) {
    return <p>Experience not found.</p>;
  }

  return (
    <div>
      <Link to="/experience" style={styles.back}>
        ← Back to timeline
      </Link>

      <h1 style={styles.h1}>
        {exp.title} · {exp.org}
      </h1>
      <p style={styles.p}>{exp.period}</p>

      <div style={styles.card}>
        <p>{exp.description}</p>
      </div>
    </div>
  );
}
