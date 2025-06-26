import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import CityModal from '../../../components/CityModal';
import logoNav from "../../../../logo/v3.png";
import './home-header.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../core/redux/store';
import axios from 'axios';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL } from '../../../baseConfig/BaseUrl';

interface Service {
  id: number;
  service: string;
  service_image: string | null;
  service_show_website: string;
  serviceSuper_url: string;
  super_service_id: number;
}

interface ServiceSub {
  id: number;
  service_sub: string;
  service_sub_image: string | null;
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
  
  // Subservice modal states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<ServiceSub[]>([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [hasFetchedServices, setHasFetchedServices] = useState(false);
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
      setServices(response.data.service);
      setHasFetchedServices(true);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setSearchError('Failed to load services. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const fetchSubServices = async (serviceId: number, serviceName: string,serviceSuperUrl: string, superServiceId: number) => {
    try {
      setSubServiceLoading(true);
      const branchId = localStorage.getItem("branch_id");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-web-service-sub-out/${serviceId}/${branchId}`
      );
      
      if (response.data.servicesub && response.data.servicesub.length > 0) {
        setSubServices(response.data.servicesub);
        setShowSubServiceModal(true);
      } else {
        navigate(`/pricing/${serviceSuperUrl}/${superServiceId}/${encodeURIComponent(serviceName)}/${serviceId}`, {
          state: {
            service_id: serviceId,
            service_name: serviceName
          }
        });
      }
    } catch (error) {
      console.error('Error fetching sub-services:', error);
      navigate(`/pricing/${serviceSuperUrl}/${superServiceId}/${encodeURIComponent(serviceName)}/${serviceId}`, {
        state: {
          service_id: serviceId,
          service_name: serviceName
        }
      });
    } finally {
      setSubServiceLoading(false);
    }
  };

 
  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);
    
  //   if (query.length > 0) {
  //     setShowSearchResults(true); 
      
  //     if (services.length === 0) {
  //       fetchServices(); 
  //     } else {
       
  //       const filtered = services.filter(service => 
  //         service.service.toLowerCase().includes(query.toLowerCase())
  //       );
  //       setFilteredServices(filtered);
  //     }
  //   } else {
  //     setShowSearchResults(false);
  //   }
  // };
  
const handleSearchFocus = () => {
  if (!hasFetchedServices) {
    fetchServices();
  }
  setShowSearchResults(true);
};

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const query = e.target.value;
  setSearchQuery(query);
  
  if (query.length > 0) {
    if (hasFetchedServices) {
      const filtered = services.filter(service => 
        service.service.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
      setShowSearchResults(true);
    }
    // Don't show results until we have data
  } else {
    setShowSearchResults(false);
  }
};
  // const handleSearchFocus = () => {
  //   if (searchQuery.length > 0 && filteredServices.length > 0) {
  //     setShowSearchResults(true);
  //   }
  // };

  const getImageUrlService = (imageName: string | null, isSubService = false) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  const handleServiceClick = (service: Service, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedService(service);
    fetchSubServices(service.id, service.service, service.serviceSuper_url, service.super_service_id);
    
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
    if (!showMobileSearchModal && !hasFetchedServices) {
      fetchServices();
    }
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
              onClick={(e) => handleServiceClick(service, e)}
              role="button" 
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
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

      {/* Subservice Modal */}
      {showSubServiceModal && (
        <div className="modal fade show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)'
        }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '680px' }}>
            <div className="modal-content border-0" style={{
              boxShadow: '0 5px 30px rgba(138, 141, 242, 0.2)',
              borderRadius: '14px',
              overflow: 'hidden'
            }}>
              <div className="modal-header py-3 px-4" style={{
                background: '#000000',
                borderBottom: 'none'
              }}>
                <h5 className="modal-title text-white" style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  <Icon.Grid className="me-2" size={18} />
                  Select {selectedService?.service}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowSubServiceModal(false)}
                  aria-label="Close"
                />
              </div>
      
              <div className="modal-body p-3" style={{ 
                maxHeight: '65vh',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
              }}>
                {subServiceLoading ? (
                  <div className="d-flex justify-content-center align-items-center py-4">
                    <div 
                      className="spinner-grow spinner-grow-sm" 
                      role="status"
                      style={{ color: '#3b82f6' }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row g-2">
                    {subServices.map((subService) => (
                      <div key={subService.id} className="col-6 col-sm-4 col-md-3">
                        <div 
                          className="card h-100 border-0 overflow-hidden transition-all position-relative"
                          onClick={() => navigate(`/pricing/${selectedService?.serviceSuper_url}/${selectedService?.super_service_id}/${selectedService?.service}/${selectedService?.id}/${subService.service_sub}/${subService.id}`, {
                            state: {
                              service_id: selectedService?.id,
                              service_name: selectedService?.service,
                              service_sub_id: subService.id,
                              service_sub_name: subService.service_sub
                            }
                          })}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: '8px',
                            border: '2px solid rgba(59, 130, 246, 0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 8px 15px rgba(59, 130, 246, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)';
                          }}
                        >
                          <div className="ratio ratio-1x1" style={{ backgroundColor: '#f0f9ff' }}>
                            <img
                              src={getImageUrlService(subService.service_sub_image, true)}
                              alt={subService.service_sub}
                              className="img-fluid object-fit-cover"
                              loading="lazy"
                              decoding="async"
                              style={{ 
                                objectPosition: 'center',
                                height: '100%',
                                width: '100%'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `${NO_IMAGE_URL}`;
                              }}
                            />
                          </div>
                          <div className="card-body p-2 text-center">
                            <h6 className="card-title mb-0" style={{
                              fontSize: '0.9rem',
                              color: '#000000',
                              fontWeight: 500,
                              lineHeight: 1.25,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {subService.service_sub}
                            </h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
      
              <div className="modal-footer py-2 px-3" style={{
                background: 'linear-gradient(to right, #ffffff, #a5a7fa)',
                borderTop: '1px solid rgba(59, 130, 246, 0.1)'
              }}>
                <button 
                  type="button" 
                  className="btn btn-sm px-3 fw-medium"
                  onClick={() => setShowSubServiceModal(false)}
                  style={{
                    fontSize: '0.8rem',
                    backgroundColor: '#000000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.35rem 1rem',
                  }}
                >
                  Close 
                </button>
              </div>
            </div>
          </div>
        </div>
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
            <Link to="/apply-job" className="home-header-nav-vendor-btn">
                <Icon.Briefcase size={16} />
                <span className="home-header-nav-btn-text">Apply For Job</span>
              </Link>
              <Link to="/become-partner" className="home-header-nav-vendor-btn">
                <Icon.User size={16} />
                <span className="home-header-nav-btn-text">Become Partner</span>
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
                  <li className="home-header-nav-search-nav-item">
                    <div className="home-header-nav-search-container">
                      <input
                        type="text"
                        placeholder="Search services..."
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

              <nav className="home-header-nav-medium-nav">
                <ul className="home-header-nav-links">
                  <li className={isRouteActive('/') ? 'active' : ''}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={isRouteActive('/service') ? 'active' : ''}>
                    <Link to="/service">Services</Link>
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
                  <span className="home-header-nav-btn-text">Book Now</span>
                </Link>
                {/* <Link to="/apply-job" className="home-header-nav-book-now-btn">
                  <span className="home-header-nav-btn-text">Apply for Job</span>
                </Link> */}

                <Link to="/become-partner" className="home-header-nav-vendor-btn-mobile">
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
                onFocus={handleSearchFocus} 
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
              <Link to="/become-partner" className="home-header-nav-sidebar-vendor-btn" onClick={closeMenu}>
                <Icon.User size={18} />
                <span>Become Partner</span>
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