// src/components/ProjectCard.jsx
import React from "react";

export default function ProjectCard({ item }) {
  const title = item?.title ?? "Untitled";
  const tag = item?.tag ?? "";
  const desc = item?.desc ?? "";
  const year = item?.year ?? "";
  const href = item?.href?.trim?.() ?? "";

  return (
    <>
      {/* local keyframes */}

      <div style={style.card} className="pc-card">
        <div style={style.cardTop}>
          <div style={style.title}>{title}</div>
          {tag ? <div style={style.badge}>{tag}</div> : null}
        </div>

        {desc ? <div style={style.desc}>{desc}</div> : null}

        <div style={style.bottom}>
          <div style={style.meta}>{year}</div>
          <div style={style.hint}>{href ? "↗ open" : ""}</div>
        </div>
      </div>
    </>
  );
}

const style = {
  card: {
    width: "100%",
    height: "100%",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 900,
    lineHeight: 1.2,
    textAlign: "left",
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.12)",
    whiteSpace: "nowrap",
    color: "#111",
  },
  desc: {
    fontSize: 12,
    lineHeight: 1.35,
    textAlign: "left",
    opacity: 0.9,
    marginTop: 8,
  },
  bottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  meta: { fontSize: 11, opacity: 0.75 },
  hint: { fontSize: 11, opacity: 0.75 },
};
