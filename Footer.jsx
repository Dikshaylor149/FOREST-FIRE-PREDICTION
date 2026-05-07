import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">ForestGuard</h2>
            <p className="footer-tagline">
              Leading the way in AI-driven wildfire intelligence and 
              ecosystem protection.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <a href="#hero">Home</a>
              <a href="#analytics">Analytics</a>
              <a href="#helpline">Helpline</a>
            </div>
            <div className="link-group">
              <h4>Products</h4>
              <a href="#">Wildfire Solution</a>
              <a href="#">Fire Spread</a>
              <a href="#">Real Time Analysis and Risk Alert System</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 ForestGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;