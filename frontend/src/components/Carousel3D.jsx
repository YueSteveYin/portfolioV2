// src/components/Carousel3D.jsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

const Carousel3D = forwardRef(function Carousel3D({ items }, ref) {
  const blockRef = useRef(null);
  const carouselRef = useRef(null);
  const cellsRef = useRef([]);

  const [sceneW, setSceneW] = useState(260);

  const safeItems = useMemo(() => ensureMin3(items), [items]);
  const cellCount = Math.max(3, safeItems.length);

  // internal layout params
  const layoutRef = useRef({
    sceneW: 260,
    sceneH: 180,
    cardW: 400,
    cardH: 260,
    left: -70,
    top: -40,
    borderRadius: 16,
    perspective: 2000,
    transitionMs: 0,
    theta: 360 / cellCount,
    radius: 300,
    forwardZ: 80,
  });

  // expose API
  useImperativeHandle(ref, () => ({
    setRotationDeg: (deg) => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const { forwardZ } = layoutRef.current;
      carousel.style.transform = `translateZ(${forwardZ}px) rotateY(${deg}deg)`;
    },
  }));

  // measure width
  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries?.[0]?.contentRect?.width ?? 260;
      const clamped = Math.max(260, Math.min(1100, Math.floor(w)));
      setSceneW(clamped);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // compute layout from sceneW
  const layout = useMemo(() => {
    const w = sceneW;
    const h = Math.round(w * 0.42);

    // BIG impressive cards
    const cardW = Math.round(w * 1.45);
    const cardH = Math.round(h * 1.6);

    const left = Math.round((w - cardW) / 2);
    const top = Math.round((h - cardH) / 2);

    const borderRadius = Math.max(12, Math.round(w * 0.03));
    const perspective = 2000;

    return {
      sceneW: w,
      sceneH: h,
      cardW,
      cardH,
      left,
      top,
      borderRadius,
      perspective,
      transitionMs: 0, // GSAP drives transforms, keep instant
    };
  }, [sceneW]);

  // layout cells and store geometry in layoutRef
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let raf = 0;

    const doLayout = () => {
      const cells = cellsRef.current.filter(Boolean);
      if (!cells.length) return;

      const theta = 360 / cellCount;

      // spacing controls the gap
      const spacingSize = Math.round(layout.sceneW * 1.6);
      const radius = Math.round((spacingSize / 2) / Math.tan(Math.PI / cellCount));

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (!cell) continue;

        const cellAngle = theta * i;
        cell.style.opacity = 1;

        // inside barrel: face inward
        cell.style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px) rotateY(180deg)`;
        cell.style.pointerEvents = "auto";
      }

      const forwardZ = Math.round(spacingSize * 0.5);

      layoutRef.current = {
        ...layoutRef.current,
        ...layout,
        theta,
        radius,
        forwardZ,
      };
      // init rotation at 0
      carousel.style.transform = `translateZ(${forwardZ}px) rotateY(0deg)`;
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(doLayout);
    };

    schedule();
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
    };
  }, [cellCount, layout]);

  return (
    <div ref={blockRef} style={style.block}>
      <div
        style={{
          ...style.scene,
          width: layout.sceneW,
          height: layout.sceneH,
          perspective: layout.perspective,
          borderRadius: layout.borderRadius,
        }}
      >
        <div ref={carouselRef} style={style.carousel}>
          {safeItems.map((p, i) => {
            const href = p.href?.trim();
            const Tag = href ? "a" : "div";
            const linkProps = href ? { href, target: "_blank", rel: "noreferrer" } : {};

            return (
              <Tag
                key={p.id}
                {...linkProps}
                ref={(el) => (cellsRef.current[i] = el)}
                style={{
                  ...style.cell,
                  width: layout.cardW,
                  height: layout.cardH,
                  left: layout.left,
                  top: layout.top,
                  borderRadius: layout.borderRadius,
                }}
              >
                <div style={style.card}>
                  <div style={style.cardTop}>
                    <div style={style.title}>{p.title}</div>
                    {p.tag ? <div style={style.badge}>{p.tag}</div> : null}
                  </div>

                  {p.desc ? <div style={style.desc}>{p.desc}</div> : null}

                  <div style={style.bottom}>
                    <div style={style.meta}>{p.year || ""}</div>
                    <div style={style.hint}>{href ? "↗ open" : ""}</div>
                  </div>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default Carousel3D;

function ensureMin3(arr) {
  if (arr.length >= 3) return arr;
  if (arr.length === 0) {
    return [
      { id: "empty-0", title: "No projects", desc: "", tag: "", year: "", href: "" },
      { id: "empty-1", title: "No projects", desc: "", tag: "", year: "", href: "" },
      { id: "empty-2", title: "No projects", desc: "", tag: "", year: "", href: "" },
    ];
  }
  const out = [...arr];
  while (out.length < 3) {
    const base = arr[out.length % arr.length];
    out.push({ ...base, id: `${base.id}-dup-${out.length}` });
  }
  return out;
}

const style = {
  block: {
    width: "min(1100px, 96vw)",
    padding: 8,
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  scene: {
    position: "relative",
    margin: "0 auto",
    transformStyle: "preserve-3d",
    background: "transparent",
    overflow: "visible",
  },
  carousel: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    transformStyle: "preserve-3d",
    willChange: "transform",
  },
  cell: {
    position: "absolute",
    border: "2px solid #111",
    color: "#111",
    textDecoration: "none",
    display: "block",
    overflow: "hidden",
    background: "white",
    boxSizing: "border-box",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  },
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
