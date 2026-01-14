// src/components/Carousel3D.jsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import ProjectCard from "./projectCard.jsx";

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
      transitionMs: 0,
    };
  }, [sceneW]);

  // layout cells
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let raf = 0;

    const doLayout = () => {
      const cells = cellsRef.current.filter(Boolean);
      if (!cells.length) return;

      const theta = 360 / cellCount;
      const spacingSize = Math.round(layout.sceneW * 1.6);
      const radius = Math.round(
        spacingSize / 2 / Math.tan(Math.PI / cellCount),
      );

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (!cell) continue;

        const cellAngle = theta * i;
        cell.style.opacity = 1;

        // inside barrel: face inward
        const base = `rotateY(${cellAngle}deg) translateZ(${radius}px) rotateY(180deg)`;
cell.style.setProperty("--cellTransform", base);
cell.style.transform = base; // default (non-hover) transform

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
  const hoverCss = `
  .carousel-cell{
    transform-style: preserve-3d;
    will-change: transform, box-shadow;
    transition: transform 220ms ease, box-shadow 220ms ease;
    cursor: pointer;
  }

  /* lift the whole cell, while keeping your existing 3D transform */
  .carousel-cell:hover{
    transform: var(--cellTransform) translateY(-14px) translateZ(18px);
    box-shadow: 0 18px 50px rgba(0,0,0,0.22);
  }

  .carousel-cell:active{
    transform: var(--cellTransform) translateY(-8px) translateZ(10px);
  }

  /* optional: slight float animation while hovered */
  @media (prefers-reduced-motion: no-preference){
    .carousel-cell:hover{
      animation: floaty 1.8s ease-in-out infinite;
    }
    @keyframes floaty{
      0%,100% { transform: var(--cellTransform) translateY(-14px) translateZ(18px); }
      50%     { transform: var(--cellTransform) translateY(-18px) translateZ(22px); }
    }
  }
`;


  return (
    <div ref={blockRef} style={style.block}>
      <style>{hoverCss}</style>
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
            const linkProps = href
              ? { href, target: "_blank", rel: "noreferrer" }
              : {};

            return (
              <Tag
                key={p.id}
                {...linkProps}
                ref={(el) => (cellsRef.current[i] = el)}
                className="carousel-cell"
                style={{
                  ...style.cell,
                  width: layout.cardW,
                  height: layout.cardH,
                  left: layout.left,
                  top: layout.top,
                  borderRadius: layout.borderRadius,
                }}
              >
                <ProjectCard item={p} />
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
      {
        id: "empty-0",
        title: "No projects",
        desc: "",
        tag: "",
        year: "",
        href: "",
      },
      {
        id: "empty-1",
        title: "No projects",
        desc: "",
        tag: "",
        year: "",
        href: "",
      },
      {
        id: "empty-2",
        title: "No projects",
        desc: "",
        tag: "",
        year: "",
        href: "",
      },
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
    pointerEvents: "none",
  },
  carousel: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    transformStyle: "preserve-3d",
    willChange: "transform",
    pointerEvents: "none",
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
    pointerEvents: "auto",
  },
};
