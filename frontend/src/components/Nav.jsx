// src/components/Nav.jsx
import NavBtn from "./NavBtn.jsx";

const NAV_ITEMS = [
  {
    key: "projects",
    label: "Projects",
    to: "/projects",
    match: (p) => p.startsWith("/projects"),
  },
  { key: "home", label: "Home", to: "/", end: true, match: (p) => p === "/" },
  {
    key: "experience",
    label: "Experience",
    to: "/experience",
    match: (p) => p.startsWith("/experience"),
  },
];

export default function Nav({ themeMap, pathname }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {NAV_ITEMS.map((item) => (
          <NavBtn
            key={item.key}
            item={item}
            themeMap={themeMap}
            pathname={pathname}
          />
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    width: "100%",
  },
  inner: {
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    alignItems: "stretch",
  },
};
