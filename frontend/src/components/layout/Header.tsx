import { Link } from "react-router";

const Header = () => (
  <div style={{ backgroundColor: 'lightblue' }}>
    <h1 style={{margin: '0'}}>This is a header</h1>
    <nav>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: '1rem' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  </div>
);

export default Header;