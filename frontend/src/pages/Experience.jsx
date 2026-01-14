import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import experiences from "../data/experiences.json";

const bg = {
  backgroundColor: "#050A14",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Crect width='240' height='240' fill='%23050A14'/%3E%3Cg fill='%23FFFFFF' fill-opacity='0.9'%3E%3Ccircle cx='18' cy='26' r='1'/%3E%3Ccircle cx='62' cy='44' r='1'/%3E%3Ccircle cx='98' cy='18' r='1'/%3E%3Ccircle cx='142' cy='34' r='1'/%3E%3Ccircle cx='196' cy='22' r='1'/%3E%3Ccircle cx='210' cy='78' r='1'/%3E%3Ccircle cx='22' cy='96' r='1'/%3E%3Ccircle cx='74' cy='132' r='1'/%3E%3Ccircle cx='118' cy='92' r='1'/%3E%3Ccircle cx='162' cy='126' r='1'/%3E%3Ccircle cx='206' cy='146' r='1'/%3E%3Ccircle cx='36' cy='188' r='1'/%3E%3Ccircle cx='92' cy='210' r='1'/%3E%3Ccircle cx='154' cy='196' r='1'/%3E%3Ccircle cx='218' cy='214' r='1'/%3E%3C/g%3E%3Cg fill='%2322D3EE' fill-opacity='0.65'%3E%3Ccircle cx='40' cy='70' r='1.2'/%3E%3Ccircle cx='130' cy='160' r='1.2'/%3E%3Ccircle cx='200' cy='110' r='1.2'/%3E%3C/g%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "240px 240px",
};

export default function Experience() {
  const navigate = useNavigate();

  // parallax background drift
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY || 0));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const parallax = Math.round(scrollY * 0.5);
  const items = useMemo(
    () =>
      experiences.map((e) => ({
        ...e,
        period: e.period || "",
        title: e.title || "",
        org: e.org || "",
        description: e.description || "",
      })),
    [],
  );

  return (
    <div style={styles.page}>
      <div
        aria-hidden="true"
        style={{
          ...styles.bg,
          ...bg,
          backgroundPosition: `0px ${-parallax}px`,
        }}
      />

      {/* ✅ readability overlay */}
      <div aria-hidden="true" style={styles.overlay} />

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.h1}>Experience</h1>
          <p style={styles.hint}>Click a card to view details</p>
        </div>
        <style>{`
            .timeline-date {
                font-size: 14px;
                color: #ffffff;
                font-weight: 700;
            }
            `}</style>
        <VerticalTimeline animate={true} layout="2-columns" lineColor="#ffffff">
          {items.map((e) => (
            <VerticalTimelineElement
              key={e.id}
              date={e.period}
              dateClassName="timeline-date"
              contentStyle={{
                ...styles.card,
                borderLeft: `4px solid #ffffff`,
              }}
              contentArrowStyle={{
                ...styles.arrow,
                borderRightColor: styles.card.background,
              }}
              iconStyle={{ ...styles.icon }}
              icon={<div style={styles.iconInner} />}
              onTimelineElementClick={() => navigate(`/experience/${e.id}`)}
            >
              <div style={styles.cardInner}>
                <div style={styles.topRow}>
                  <div style={styles.titleBlock}>
                    <h3 style={styles.h3}>{e.title}</h3>
                    {e.org ? <h4 style={styles.h4}>{e.org}</h4> : null}
                  </div>
                </div>

                {e.description ? <p style={styles.p}>{e.description}</p> : null}
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "70%",
    position: "relative",
    minHeight: "100vh",
  },

  bg: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    // keep this stable + seamless
    willChange: "background-position",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
    background:
      "radial-gradient(900px 520px at 20% 12%, rgba(34,211,238,0.10), transparent 62%), linear-gradient(rgba(5,10,20,0.55), rgba(5,10,20,0.55))",
  },

  content: {
    position: "relative",
    zIndex: 2,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "16px",
    marginBottom: "18px",
  },

  h1: {
    fontSize: "32px",
    margin: 0,
    letterSpacing: "-0.02em",
    color: "#E6EEF8",
  },

  hint: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(230,238,248,0.70)",
  },
  card: {
    background: "rgba(255,255,255,0.78)",
    boxShadow: "0 10px 28px rgba(2,6,23,0.14)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    padding: "18px 18px",
    backdropFilter: "blur(10px)",
  },

  arrow: {
    borderRight: "7px solid rgba(255,255,255,0.78)",
  },

  icon: {
    boxShadow: "0 10px 24px rgba(2,6,23,0.18)",
    // ✅ DO NOT set width/height here
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconInner: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background: "#ffffff",
  },
  cardInner: {
    display: "grid",
    gap: "10px",
  },

  topRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },

  titleBlock: {
    minWidth: 0,
  },

  h3: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 900,
    color: "#0F172A",
  },

  h4: {
    margin: "6px 0 0",
    fontSize: "14px",
    fontWeight: 800,
    color: "rgba(15,23,42,0.70)",
  },

  p: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.65,
    color: "rgba(15,23,42,0.78)",
  },
};
