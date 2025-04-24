import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';

const FooterSeven = () => {
  const routes = all_routes;
  return (
    <footer className="footer footer-seven">
  {/* Footer Top */}
  <div className="footer-top " >
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-md-6">
          {/* Footer Widget */}
          <div className="footer-widget footer-widget-seven">
            <div className="footer-logo">
              <Link to={routes.index}>
                <img src="https://new.agsdraft.online/assets/v3logo-Chdt_krj.png"  alt="logo" />
              </Link>
            </div>
            <div className="footer-content">
              <p>
              We are an organisation that cares about our people and our clients – To be the most admired cleaning and facility services partner in our chosen segments in India
              </p>
            </div>
            <div className="footer-selects footer-selects-seven col-lg-10 col-md-8">
              <h2 className="footer-subtitle">Newsletter Signup</h2>
              <div className="subscribe-form">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
                <button type="submit" className="btn footer-btn">
                  Submit
                </button>
              </div>
            </div>
          </div>
          {/* /Footer Widget */}
        </div>
        {/* <div className="col-lg-2 col-md-6"> */}
          {/* Footer Widget */}
          {/* <div className="footer-widget footer-menu">
            <h2 className="footer-title">Support</h2>
            <ul>
              <li>
                <Link to="#">Account</Link>
              </li>
              <li>
                <Link to="#">Book Appointment</Link>
              </li>
              <li>
                <Link to="#">Orders</Link>
              </li>
              <li>
                <Link to="#">Payments</Link>
              </li>
              <li>
                <Link to="#">Returns</Link>
              </li>
              <li>
                <Link to={routes.contactUs}>Contact us</Link>
              </li>
            </ul>
          </div> */}
          {/* /Footer Widget */}
        {/* </div> */}
        <div className="col-lg-2 col-md-6">
          {/* Footer Widget */}
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
          {/* /Footer Widget */}
        </div>
        <div className="col-lg-2 col-md-6">
          {/* Footer Widget */}
          <div className="footer-widget footer-menu">
            <h2 className="footer-title">Services</h2>
            <ul>
              <li>
                <Link to="#">Book Services</Link>
              </li>
              <li>
                <Link to="#">Residential Services</Link>
              </li>
              <li>
                <Link to="#">Corporate Services</Link>
              </li>
              <li>
                <Link to="#">Industrial service</Link>
              </li>
              <li>
                <Link to="#">Sofa Cleaning service</Link>
              </li>
             
            </ul>
          </div>
          {/* /Footer Widget */}
        </div>
        <div className="col-lg-4 col-md-6">
          {/* Footer Widget */}
          <div className="footer-widget">
            <h2 className="footer-title">Contact</h2>
            <div className="footer-six-main">
              <div className="footer-six-left">
                <span className="footer-seven-icon">
                  <ImageWithBasePath src="assets/img/icons/call-calling.svg" alt="image" />
                </span>
                <div className="footer-six-ryt">
                  <span>Phone Number</span>
                  {/* <h6> +91 98807 78585</h6> */}
                  <h6><a href="tel:+919880778585" className='text-white'>+91 98807 78585</a></h6>
                </div>
              </div>
              <div className="footer-six-left">
                <span className="footer-seven-icon">
                  <ImageWithBasePath src="assets/img/icons/sms.svg" alt="image" />
                </span>
                <div className="footer-six-ryt">
                  <span>Mail Address</span>
                  {/* <h6>info@v3care.com</h6> */}
                  <h6><a href="mailto:info@v3care.com"  className='text-white'>info@v3care.com</a></h6>
                </div>
              </div>
              <div className="footer-six-left ">
                <span className="footer-seven-icon">
                  <ImageWithBasePath src="assets/img/icons/location.svg" alt="image" />
                </span>
                <div className="footer-six-ryt">
                  <span>Bangalore Address</span>
                  <h6>V3 CARE, H. No. 2296, 24th Main Road, 16th Cross, HSR Layout, Sector 1, Bangalore – 560 102         <br/></h6>
         
                  <h6>Land Mark : Opposite Bangalore One</h6>
                  <h6>

                  Also we are in: <br/>
                  Hyderabad, Pune & Gurgaon

                  </h6>
                </div>
              </div>
            </div>
          </div>
          {/* /Footer Widget */}
        </div>
      </div>
    </div>
  </div>
  {/* /Footer Top */}
  {/* Footer Bottom */}
  <div className="footer-bottom footer-bottom-seven">
    <div className="container">
      {/* Copyright */}
      <div className="copyright">
        <div className="row gy-2">
          <div className="col-md-6">
            <div className="copyright-text">
            <p>Copyright 2025 © <a href="https://ag-solutions.in/" target="_blank" rel="noreferrer" className='text-white'>AGSolutions</a>. All right reserved.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="social-icon justify-content-md-end">
              <ul>
                <li>
                  <Link target="_blank" rel="noreferrer" to="https://www.facebook.com/v3care">
                    <i className="fa-brands fa-facebook" />{" "}
                  </Link>
                </li>
                <li>
                <Link target="_blank" rel="noreferrer" to="https://x.com/care_v3">
  <i className="fab fa-twitter" />{" "}
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
      {/* /Copyright */}
    </div>
  </div>
  {/* /Footer Bottom */}
</footer>

  );
};

export default FooterSeven;
