import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';


const HeroSection = () => {
  return (
    <section className="hero-section-seven">
      <div className="hero-sectionseven-top pt-5 pt-lg-0 pb-5 pb-lg-0">
        <div className="container">
          <div className="home-banner homer-banner-seven">
            <div className="row align-items-center w-100">
              <div className="col-lg-6 col-12">
                <div className="section-search">
                  <p>Search From 150 Awesome Verified Ads!</p>
                  <h1>
                    Best Solution for Every
                    <span>House Problems</span>
                  </h1>
                  <div className="solution-seven">
                    <h6>2M+ Professionals registered</h6>
                    <ul className="total-client-avatar total-client-avatar-seven d-flex align-items-center mt-2">
                      <li>
                        <Link to="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12" fill="#FF6B6B" />
                            <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12" fill="#4CAF50" />
                            <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12" fill="#2196F3" />
                            <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12" fill="#FFC107" />
                            <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12" fill="#9C27B0" />
                            <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                          </svg>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="hero-banner-ryt">
                  <ImageWithBasePath
                    src="assets/img/hero-section-seven-ryt.png"
                    alt="image"
                    className="img-fluid"
                  />
                  <div className="hero-banner-ryt-content">
                    <div className="hero-banner-ryt-top">
                      <h5>+21 k</h5>
                      <p>Services Completed</p>
                    </div>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#9370DB"
                          d="M6 7V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2zm2 0h8V6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v1z"
                        />
                        <path
                          fill="#FFFFFF"
                          d="M5 9h14v1H5V9zm0 3h14v1H5v-1zm0 3h14v1H5v-1z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;