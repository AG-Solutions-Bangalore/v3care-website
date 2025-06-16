import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import CityModal from '../../../components/CityModal';
import logoNav from "../../../../logo/v3.png";
import './home-header.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../core/redux/store';
import axios from 'axios';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL } from '../../../baseConfig/BaseUrl';

interface Service {
  id: number;
  service: string;
  service_image: string | null;
  service_show_website: string;
}

const HomeHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

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

      if (
        searchResultsRef.current && 
        searchInputRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
useEffect(() => {
    if (showMobileSearchModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileSearchModal]);
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

  const fetchServices = async () => {
    try {
      setIsSearching(true);
      setSearchError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-all-out`);
      const filteredServices = response.data.service.filter((service: Service) => 
        service.service_show_website && service.service_show_website.includes("1")
      );
      setServices(filteredServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setSearchError('Failed to load services. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.preventDefault()
    // e.stopPropagation()
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      if (services.length === 0) {
        fetchServices();
      }
      const filtered = services.filter(service => 
        service.service.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0 && filteredServices.length > 0) {
      setShowSearchResults(true);
    }
  };

  const getImageUrlService = (imageName: string | null) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  const handleServiceClick = (service: Service) => {
    console.log("hit")
    navigate(`/pricing/${encodeURIComponent(service.service)}/${service.id}`, {
      state: {
        service_id: service.id,
        service_name: service.service
      }
    });
    setShowSearchResults(false);
    setShowMobileSearchModal(false);
    setSearchQuery('');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  const toggleMobileSearch = () => {
    setShowMobileSearchModal(!showMobileSearchModal);
    if (!showMobileSearchModal && mobileSearchInputRef.current) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
    }
  };

  const renderSearchResults = () => (
    <>
      {isSearching ? (
        <div className="home-header-nav-search-loading">
          <div className="home-header-nav-spinner"></div>
          <span>Searching...</span>
        </div>
      ) : searchError ? (
        <div className="home-header-nav-search-error">
          <Icon.AlertCircle size={16} />
          <span>{searchError}</span>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="home-header-nav-search-results-list">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className="home-header-nav-search-result-item"
              onClick={() => handleServiceClick(service)}
              role="button" 
              tabIndex={0} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleServiceClick(service);
                }
              }}
            
            >
              <div className="home-header-nav-search-result-image">
                <img
                  src={getImageUrlService(service.service_image)}
                  alt={service.service}
                  loading="lazy"
                />
              </div>
              <div className="home-header-nav-search-result-content">
                <h4>{highlightMatch(service.service, searchQuery)}</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="home-header-nav-no-results">
          <Icon.Search size={18} />
          <span>No services found</span>
        </div>
      )}
    </>
  );

  return (
    <>
      {showCityModal && (
        <CityModal
          onSelectCity={handleCitySelect}
          onClose={handleCloseModal}
          selectedCity={currentCity}
        />
      )}

      <header className={`home-header-nav ${scrollYPosition > 200 ? 'fixed' : ''}`}>
        <div className="home-header-nav-container">
          <div className="home-header-nav-brand">
            <Link to="/" className="home-header-nav-logo-link">
              <img src={logoNav} className="home-header-nav-logo-img" alt="Company Logo" />
            </Link>
          </div>

          <div className="home-header-nav-top-content">
            <div className="home-header-nav-contact-info">
              <button className="home-header-nav-city-selector" onClick={handleCityClick}>
                <Icon.MapPin size={16} />
                <span className="home-header-nav-contact-text">{currentCity || 'Select City'}</span>
              </button>
              
              <div className="home-header-nav-contact-item">
                <Icon.Phone size={16} />
                <a href="tel:+919880778585" className="home-header-nav-contact-text">+91 9880778585</a>
              </div>
              
              <div className="home-header-nav-contact-item">
                <Icon.Mail size={16} />
                <a href="mailto:info@v3care.in" className="home-header-nav-contact-text">info@v3care.in</a>
              </div>
            </div>

            <div className="home-header-nav-contact-icons">
              <button className="home-header-nav-city-selector" onClick={handleCityClick}>
                <Icon.MapPin size={16} />
              </button>
              <a href="tel:+919880778585" className="home-header-nav-contact-icon-btn">
                <Icon.Phone size={18} />
              </a>
              <a href="mailto:info@v3care.in" className="home-header-nav-contact-icon-btn">
                <Icon.Mail size={18} />
              </a>
            </div>

            <div className="home-header-nav-top-actions">
              <Link to="/become-vendor" className="home-header-nav-vendor-btn">
                <Icon.User size={16} />
                <span className="home-header-nav-btn-text">Become a Vendor</span>
              </Link>
            </div>
          </div>

          <div className="home-header-nav-bottom-content">
            <div className="home-header-nav-actions-container">
              <nav className="home-header-nav-desktop-nav">
                <ul className="home-header-nav-links">
                  <li className={isRouteActive('/') ? 'active' : ''}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={isRouteActive('/service') ? 'active' : ''}>
                    <Link to="/service">Services</Link>
                  </li>
                  <li className={isRouteActive('/contact-us') ? 'active' : ''}>
                    <Link to="/contact-us">Contact</Link>
                  </li>
                  <li className="home-header-nav-search-nav-item">
                    <div className="home-header-nav-search-container">
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e)=>handleSearchChange(e)}
                        onFocus={handleSearchFocus}
                        className="home-header-nav-search-input"
                        ref={searchInputRef}
                      />
                      <Icon.Search size={18} className="home-header-nav-search-icon" />
                      {showSearchResults && (
                        <div className="home-header-nav-search-results-dropdown" ref={searchResultsRef}>
                          {renderSearchResults()}
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </nav>

              <nav className="home-header-nav-medium-nav">
                <ul className="home-header-nav-links">
                  <li className={isRouteActive('/') ? 'active' : ''}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={isRouteActive('/service') ? 'active' : ''}>
                    <Link to="/service">Services</Link>
                  </li>
                  <li className={isRouteActive('/contact-us') ? 'active' : ''}>
                    <Link to="/contact-us">Contact</Link>
                  </li>
                  <li className="home-header-nav-search-nav-item">
                    <div className="home-header-nav-search-container">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        className="home-header-nav-search-input"
                        ref={searchInputRef}
                      />
                      <Icon.Search size={18} className="home-header-nav-search-icon" />
                      {showSearchResults && (
                        <div className="home-header-nav-search-results-dropdown" ref={searchResultsRef}>
                          {renderSearchResults()}
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </nav>

              <nav className="home-header-nav-medium-nav-for-sevenone">
                <ul className="home-header-nav-links">
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

              <div className="home-header-nav-bottom-actions">
                <button 
                  className="home-header-nav-search-icon-trigger" 
                  onClick={toggleMobileSearch}
                  aria-label="Search"
                >
                  <Icon.Search size={20} />
                </button>
                <Link to="/cart" className="home-header-nav-cart-icon">
                  <Icon.ShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="home-header-nav-cart-count">{cartItems.length}</span>
                  )}
                </Link>
                
                <Link to="/service" className="home-header-nav-book-now-btn">
                  <Icon.Plus size={16} className="home-header-nav-book-now-icon" />
                  <span className="home-header-nav-btn-text">Book Now</span>
                </Link>

                <Link to="/become-vendor" className="home-header-nav-vendor-btn-mobile">
                  <Icon.User size={16} />
                </Link>

                <button 
                  className="home-header-nav-menu-toggle" 
                  onClick={toggleMenu} 
                  aria-label="Toggle menu" 
                  ref={toggleButtonRef}
                >
                  <Icon.Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Modal */}
        {showMobileSearchModal && (
          <div className="home-header-nav-mobile-search-modal">
            <div className="home-header-nav-mobile-search-container">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="home-header-nav-mobile-search-input"
                ref={mobileSearchInputRef}
                autoFocus
              />
              <button 
                className="home-header-nav-mobile-search-close" 
                onClick={toggleMobileSearch}
                aria-label="Close search"
              >
                <Icon.X size={20} />
              </button>
            </div>
            
            <div className="home-header-nav-mobile-search-results">
              {renderSearchResults()}
            </div>
          </div>
        )}

        <div className={`home-header-nav-sidebar-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
        <div className={`home-header-nav-mobile-sidebar ${isMenuOpen ? 'open' : ''}`} ref={sidebarRef}>
          <div className="home-header-nav-sidebar-header">
            <Link to="/" className="home-header-nav-sidebar-logo" onClick={closeMenu}>
              <img src={logoNav} alt="Company Logo" />
            </Link>
            <button className="home-header-nav-sidebar-close" onClick={closeMenu} aria-label="Close menu">
              <Icon.X size={24} />
            </button>
          </div>
    
          <div className="home-header-nav-sidebar-content">
            <div className="home-header-nav-sidebar-city-selector" onClick={() => { handleCityClick(); closeMenu(); }}>
              <Icon.MapPin size={18} />
              <span>{currentCity || 'Select Your City'}</span>
            </div>
    
            <ul className="home-header-nav-sidebar-links">
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
    
            <div className="home-header-nav-sidebar-actions">
              <Link to="/become-vendor" className="home-header-nav-sidebar-vendor-btn" onClick={closeMenu}>
                <Icon.User size={18} />
                <span>Become a Vendor</span>
              </Link>
              
              <Link to="/service" className="home-header-nav-sidebar-header-book-now-btn" onClick={closeMenu}>
                <Icon.Plus size={18} />
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


// original code 