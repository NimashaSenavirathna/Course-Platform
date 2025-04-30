import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Course Platform</h3>
          <p className="footer-description">
            Your one-stop destination for quality online courses and learning resources. 
            Empowering learners worldwide with knowledge and skills for the future.
          </p>
          <div className="newsletter">
            <h4>Subscribe to our newsletter</h4>
            <div className="newsletter-input">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/courses" className="footer-link">
                <span className="link-icon">→</span>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/cart" className="footer-link">
                <span className="link-icon">→</span>
                Cart
              </Link>
            </li>
            <li>
              <Link to="/admin" className="footer-link">
                <span className="link-icon">→</span>
                Admin
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-contact">
            <li>
              <FaEnvelope className="contact-icon" />
              <span>support@courseplatform.com</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>123 Learning St, Education City</span>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link">
              <FaFacebook className="social-icon" />
              <span>Facebook</span>
            </a>
            <a href="#" className="social-link">
              <FaTwitter className="social-icon" />
              <span>Twitter</span>
            </a>
            <a href="#" className="social-link">
              <FaLinkedin className="social-icon" />
              <span>LinkedIn</span>
            </a>
            <a href="#" className="social-link">
              <FaInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Course Platform. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy" className="legal-link">Privacy Policy</Link>
          <Link to="/terms" className="legal-link">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 