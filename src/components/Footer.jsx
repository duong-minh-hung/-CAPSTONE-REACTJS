
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>GET HELP</h3>
          <Link to="/">Home</Link>
          <a href="#nike">Nike</a>
          <a href="#adidas">Adidas</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-column">
          <h3>SUPPORT</h3>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#help">Help</a>
          <a href="#phone">Phone</a>
        </div>

        <div className="footer-column">
          <h3>REGISTER</h3>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 CyberSoft. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
