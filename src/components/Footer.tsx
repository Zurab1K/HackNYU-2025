export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div>© {year} ArcForge Labs</div>
      <div className="footer__links">
        <a href="#">Privacy</a>
        <a href="#">Status</a>
        <a href="#">Careers</a>
      </div>
    </footer>
  );
}
