import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icon from 'react-feather';
import CityModal from '../../../components/CityModal';
import logoNav from "../../../../logo/v3.png";
import './home-header.css';

const HomeHeader = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [currentCity, setCurrentCity] = useState<string | null>(null);

  useEffect(() => {
    const storedCity = localStorage.getItem('city');
    setCurrentCity(storedCity);

    const handleCityChange = (event: Event) => {
      const city = (event as CustomEvent).detail;
      setCurrentCity(city);
    };

    window.addEventListener('cityChanged', handleCityChange);
    return () => window.removeEventListener('cityChanged', handleCityChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollYPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleCityClick = () => setShowCityModal(true);
  
  const handleCitySelect = (city: string, branchId: number) => {
    localStorage.setItem('city', city);
    localStorage.setItem('branch_id', branchId.toString());
    setCurrentCity(city);
    setShowCityModal(false);
  };

  const handleCloseModal = () => setShowCityModal(false);

  const isRouteActive = (path: string) => location.pathname === path;

  return (
    <>
      {showCityModal && (
        <CityModal
          onSelectCity={handleCitySelect}
          onClose={handleCloseModal}
          selectedCity={currentCity}
        />
      )}

      <header className={`header ${scrollYPosition > 200 ? 'fixed' : ''}`}>
        <div className="header-container">
          <div className="header-brand">
            <Link to="/" className="logo-link">
              <img src={logoNav} className="logo-img" alt="Company Logo" />
            </Link>
          </div>

          {/* Desktop Navigation (lg screens) */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li className={isRouteActive('/') ? 'active' : ''}>
                <Link to="/">Home</Link>
              </li>
              <li className={isRouteActive('/about-us') ? 'active' : ''}>
                <Link to="/about-us">About Us</Link>
              </li>
              <li className={isRouteActive('/service') ? 'active' : ''}>
                <Link to="/service">Services</Link>
              </li>
              <li className={isRouteActive('/client') ? 'active' : ''}>
                <Link to="/client">Clients</Link>
              </li>
              <li className={isRouteActive('/blog') ? 'active' : ''}>
                <Link to="/blog">Blog</Link>
              </li>
              <li className={isRouteActive('/contact-us') ? 'active' : ''}>
                <Link to="/contact-us">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Medium Screen Navigation (md screens) */}
          <nav className="medium-nav">
            <ul className="nav-links">
              <li className={isRouteActive('/') ? 'active' : ''}>
              <Link to="/">Home</Link>
              </li>
              <li className={isRouteActive('/service') ? 'active' : ''}>
              <Link to="/service">Services</Link>
              </li>
              <li className={isRouteActive('/contact-us') ? 'active' : ''}>
              <Link to="/contact-us">Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="city-selector-container">
              <button className="city-selector" onClick={handleCityClick}>
                <Icon.MapPin size={16} />
                <span>{currentCity || 'Select City'}</span>
              </button>
            </div>
            
            <Link to="/become-vendor" className="vendor-btn">
              <Icon.User size={16} />
              <span>Become a Vendor</span>
            </Link>

            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
              <Icon.Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`sidebar-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
        <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <Link to="/" className="sidebar-logo" onClick={closeMenu}>
              <img src={logoNav} alt="Company Logo" />
            </Link>
            <button className="sidebar-close" onClick={closeMenu} aria-label="Close menu">
              <Icon.X size={24} />
            </button>
          </div>

          <div className="sidebar-content">
            <ul className="sidebar-links">
              <li className={isRouteActive('/') ? 'active' : ''}>
                <Link to="/" onClick={closeMenu}>
                  <Icon.Home size={18} />
                  <span>Home</span>
                </Link>
              </li>
              <li className={isRouteActive('/about-us') ? 'active' : ''}>
                <Link to="/about-us" onClick={closeMenu}>
                  <Icon.Info size={18} />
                  <span>About Us</span>
                </Link>
              </li>
              <li className={isRouteActive('/service') ? 'active' : ''}>
                <Link to="/service" onClick={closeMenu}>
                  <Icon.Settings size={18} />
                  <span>Services</span>
                </Link>
              </li>
              <li className={isRouteActive('/client') ? 'active' : ''}>
                <Link to="/client" onClick={closeMenu}>
                  <Icon.Users size={18} />
                  <span>Clients</span>
                </Link>
              </li>
              <li className={isRouteActive('/blog') ? 'active' : ''}>
                <Link to="/blog" onClick={closeMenu}>
                  <Icon.BookOpen size={18} />
                  <span>Blog</span>
                </Link>
              </li>
              <li className={isRouteActive('/contact-us') ? 'active' : ''}>
                <Link to="/contact-us" onClick={closeMenu}>
                  <Icon.Mail size={18} />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>

            <div className="sidebar-actions">
              <button 
                className="sidebar-city-selector" 
                onClick={() => { handleCityClick(); closeMenu(); }}
              >
                <Icon.MapPin size={18} />
                <span>{currentCity || 'Select Your City'}</span>
              </button>
              
              <Link to="/become-vendor" className="sidebar-vendor-btn" onClick={closeMenu}>
                <Icon.User size={18} />
                <span>Become a Vendor</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;