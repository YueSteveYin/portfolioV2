// src/pages/Projects.jsx
import React, { useEffect, useMemo, useRef } from "react";
import projectsRaw from "../data/projects.json";
import Carousel3D from "../components/Carousel3D";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const projects = useMemo(() => {
    const arr = Array.isArray(projectsRaw)
      ? projectsRaw
      : projectsRaw?.projects || [];
    return arr.map((p, idx) => ({
      id: p.id ?? `p-${idx}`,
      title: p.title ?? "Untitled",
      desc: p.desc ?? p.description ?? "",
      tag: p.tag ?? p.stack ?? p.tech ?? "",
      year: p.year ?? "",
      href: p.href ?? p.link ?? p.url ?? "",
    }));
  }, []);

  const wrapRef = useRef(null);
  const pageRef = useRef(null);
  const carouselApiRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const n = Math.max(3, projects.length);
    const theta = 360 / n;

    // scroll distance: tune this
    const scrollLen = Math.max(1200, n * 260);

    const state = { rot: 0 };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top-=100 top",
      end: `+=${scrollLen}`,
      pin: true,
      scrub: 0.15, // smooth
      anticipatePin: 1,
      onUpdate: (self) => {
        // rotate forward as you scroll down
        state.rot = -self.progress * (theta * n);
        carouselApiRef.current?.setRotationDeg(state.rot);
      },
    });

    // ensure initial
    carouselApiRef.current?.setRotationDeg(0);

    return () => st.kill();
  }, [projects.length]);

  return (
    <section ref={pageRef} style={style.page}>
      <div ref={wrapRef} style={style.pinWrap}>
        <Carousel3D ref={carouselApiRef} items={projects} />
      </div>
    </section>
  );
}

const style = {
  page: {
    fontFamily: "sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    width: "100%",
    background: "radial-gradient(ellipse at center, #0b0b10 0%, #000 70%)",
    overscrollBehavior: "none",
    overflowX: "hidden",
  },

  // this is the pinned element
  pinWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    width: "100%",
    position: "relative",
  },
};
