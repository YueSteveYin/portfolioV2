// src/App.jsx
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import { THEME, getActiveKey } from "./data/theme.js";

export default function App() {
  const { pathname } = useLocation();
  const activeKey = getActiveKey(pathname);
  const theme = THEME[activeKey] ?? THEME.home;

  return (
    <div style={{ ...styles.app, background: theme.bg }}>
      <div style={styles.navShell}>
        <Nav themeMap={THEME} pathname={pathname} />
      </div>

      <main style={styles.content}>
        <Outlet context={{ activeKey, theme }} />
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    transition: "background-color 320ms ease",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  },

  navShell: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
  },

  content: {
    display: "flex",
    justifyContent: "center",
  },
};
