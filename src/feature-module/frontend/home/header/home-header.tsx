import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icon from 'react-feather';
import CityModal from '../../../components/CityModal';
import logoNav from "../../../../logo/v3.png";
import './home-header.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../core/redux/store';

const HomeHeader = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

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
    window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
  };

  const handleCloseModal = () => setShowCityModal(false);

  const isRouteActive = (path: string) => location.pathname === path;

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        toggleButtonRef.current && 
        !sidebarRef.current.contains(event.target as Node) && 
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        {/* First Row */}
        <div className="header-top-row">
          <div className="header-container">
            {/* Logo - Always on left */}
            <div className="header-brand">
              <Link to="/" className="logo-link">
                <img src={logoNav} className="logo-img" alt="Company Logo" />
              </Link>
            </div>

            {/* Contact Info - Center on large, hidden on small */}
            <div className="header-contact-info">
              <button className="city-selector" onClick={handleCityClick}>
                <Icon.MapPin size={16} />
                <span className="contact-text">{currentCity || 'Select City'}</span>
              </button>
              
              <div className="contact-item">
                <Icon.Phone size={16} />
                <a href="tel:+919880778585" className="contact-text">+91 9880778585</a>
              </div>
              
              <div className="contact-item">
                <Icon.Mail size={16} />
                <a href="mailto:info@v3care.in" className="contact-text">info@v3care.in</a>
              </div>
            </div>

            {/* Small screen contact icons - Only visible on mobile */}
            <div className="header-contact-icons">
              <button className="city-selector" onClick={handleCityClick}>
                <Icon.MapPin size={16} />
              </button>
              <a href="tel:+919880778585" className="contact-icon-btn">
                <Icon.Phone size={18} />
              </a>
              <a href="mailto:info@v3care.in" className="contact-icon-btn">
                <Icon.Mail size={18} />
              </a>
            </div>

            {/* Top Actions - Right side */}
            <div className="header-top-actions">
              <Link to="/become-vendor" className="vendor-btn">
                <Icon.User size={16} />
                <span className="btn-text">Become a Vendor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Second Row - Navigation */}
        <div className="header-bottom-row">
          <div className="header-container">
            {/* Desktop Navigation - Full menu for large screens */}
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

            {/* Medium Screen Navigation - Reduced menu */}
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

            {/* Right Actions */}
            <div className="header-bottom-actions">
              <Link to="/cart" className="cart-icon">
                <Icon.ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="cart-count">{cartItems.length}</span>
                )}
              </Link>
              
              <Link to="/service" className="header-book-now-btn">
                <Icon.ShoppingBag size={16} className="book-now-icon" />
                <span className="btn-text">Book Now</span>
              </Link>

              {/* Become Vendor for small screens */}
              <Link to="/become-vendor" className="vendor-btn-mobile">
                <Icon.User size={16} />
                
              </Link>

              <button 
                className="menu-toggle" 
                onClick={toggleMenu} 
                aria-label="Toggle menu" 
                ref={toggleButtonRef}
              >
                <Icon.Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`sidebar-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
        <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`} ref={sidebarRef}>
          <div className="sidebar-header">
            <Link to="/" className="sidebar-logo" onClick={closeMenu}>
              <img src={logoNav} alt="Company Logo" />
            </Link>
            <button className="sidebar-close" onClick={closeMenu} aria-label="Close menu">
              <Icon.X size={24} />
            </button>
          </div>

          <div className="sidebar-content">
            <div className="sidebar-city-selector" onClick={() => { handleCityClick(); closeMenu(); }}>
              <Icon.MapPin size={18} />
              <span>{currentCity || 'Select Your City'}</span>
            </div>

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
              <Link to="/become-vendor" className="sidebar-vendor-btn" onClick={closeMenu}>
                <Icon.User size={18} />
                <span>Become a Vendor</span>
              </Link>
              
              <Link to="/service" className="sidebar-header-book-now-btn" onClick={closeMenu}>
                <Icon.ShoppingBag size={18} />
                <span>Book Now</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;