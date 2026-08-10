import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-col">
          <h2 className="footer-logo">
            EV TIMES ⚡
          </h2>

          <p>
            Your trusted destination for
            Electric Vehicle news, battery
            technology, charging infrastructure,
            market insights and policy updates.
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/bookmarks">Bookmarks</a>
          <a href="/profile">Profile</a>
          <a href="/notifications">
            Notifications
          </a>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h3>Categories</h3>

          <a href="/category/technology">
            Technology
          </a>

          <a href="/category/battery">
            Battery
          </a>

          <a href="/category/charging">
            Charging
          </a>

          <a href="/category/market">
            Market
          </a>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h3>Connect With Us</h3>

          <div className="social-icons">

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

          </div>

          <p className="footer-mail">
            support@evtimes.com
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 EV TIMES. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;