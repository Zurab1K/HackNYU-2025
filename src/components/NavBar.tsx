import { useCallback } from "react";

const navLinks = [
  { label: "Features", target: "features" },
  { label: "Contact", target: "contact" }
];

export function NavBar() {
  const handleScroll = useCallback((target: string) => {
    const el = document.getElementById(target);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <nav className="nav">
      <div className="logo">
        <span className="glyph" aria-hidden="true">
          ▲
        </span>
        <span>ArcForge</span>
      </div>
      <div className="nav-links">
        {navLinks.map(({ label, target }) => (
          <button key={target} onClick={() => handleScroll(target)} className="nav-link">
            {label}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <a className="btn ghost" href="#!" aria-label="Mock login button">
          Log in
        </a>
      </div>
    </nav>
  );
}
