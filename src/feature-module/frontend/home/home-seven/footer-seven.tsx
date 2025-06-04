import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import logoNav from "../../../../logo/footer_logo.png";
import './FooterSeven.css'; // Import the new CSS file

const FooterSeven = () => {
  const routes = all_routes;
  return (
    <footer className="footer footer-seven">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="container">
          <div className="footer-columns">
            {/* Logo and Description Column */}
            <div className="footer-column">
              <div className="footer-widget footer-widget-seven">
                <div className="footer-logo">
                  <Link to={routes.index}>
                    <img src={logoNav} alt="logo_footer" loading="lazy" decoding="async" />
                  </Link>
                </div>
                <div className="footer-content">
                  <p>
                    We are an organisation that cares about our people and our clients – To be the most admired cleaning and facility services partner in our chosen segments in India
                  </p>
                </div>
              </div>
            </div>

            {/* About Links Column */}
            <div className="footer-column">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">About</h2>
                <ul>
                  <li>
                    <Link to={routes.aboutUs}>About us</Link>
                  </li>
                  <li>
                    <Link to={routes.contactUs}>Contact Us</Link>
                  </li>
                  <li>
                    <Link to={routes.client}>Client</Link>
                  </li>
                  <li>
                    <Link to={routes.blogGrid}>Blog</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info Column */}
            <div className="footer-column">
              <div className="footer-widget">
                <h2 className="footer-title">Contact</h2>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">
                      <ImageWithBasePath src="assets/img/icons/call-calling.svg" alt="phone" />
                    </span>
                    <div className="contact-details">
                      <span>Phone Number</span>
                      <h6><a href="tel:+919880778585">+91 98807 78585</a></h6>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">
                      <ImageWithBasePath src="assets/img/icons/sms.svg" alt="email" />
                    </span>
                    <div className="contact-details">
                      <span>Mail Address</span>
                      <h6><a href="mailto:info@v3care.com">info@v3care.com</a></h6>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">
                      <ImageWithBasePath src="assets/img/icons/location.svg" alt="location" />
                    </span>
                    <div className="contact-details">
                      <span>Bangalore Address</span>
                      <h6>V3 CARE, H. No. 2296, 24th Main Road, 16th Cross, HSR Layout, Sector 1, Bangalore – 560 102</h6>
                      <h6>Land Mark: Opposite Bangalore One</h6>
                      <h6>Also we are in: Hyderabad, Pune & Gurgaon</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
     {/* Footer Bottom */}
<div className="footer-bottom footer-bottom-seven">
  <div className="container">
    <div className="footer-bottom-content">
      <div className="copyright">
        <p
        style={
          {
            color:"#ffffff"
          }
        }
        >Copyright 2025 © <a
        
       
        href="https://ag-solutions.in/" target="_blank" rel="noreferrer" className="text-white">AGSolutions</a>. All right reserved.</p>
      </div>
      <div className="social-links">
        <ul>
          <li>
            <Link target="_blank" rel="noreferrer" to="https://www.facebook.com/v3care">
              <i className="fa-brands fa-facebook" />
            </Link>
          </li>
          <li>
            <Link target="_blank" rel="noreferrer" to="https://x.com/care_v3">
              <i className="fab fa-twitter" />
            </Link>
          </li>
          <li>
            <Link target="_blank" rel="noreferrer" to="https://www.instagram.com/v3care/">
              <i className="fa-brands fa-instagram" />
            </Link>
          </li>
          <li>
            <Link target="_blank" rel="noreferrer" to="https://www.linkedin.com/in/v3-care-15135119b/">
              <i className="fa-brands fa-linkedin" />
            </Link>
          </li>
          <li>
            <Link target="_blank" rel="noreferrer" to="https://www.youtube.com/channel/UC3eZ5BXlhuQk_OZ6zXXgW2w">
              <i className="fa-brands fa-youtube" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
    </footer>
  );
};

export default FooterSeven;