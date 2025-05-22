import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {

  set_toggleSidebar_data,
} from '../../../../core/data/redux/action';
import * as Icon from 'react-feather';
import { AppState } from '../../../../core/models/interface';
import CityModal from '../../../components/CityModal';
import logoNav from "../../../../logo/v3.png";

type props = {
  type: number;
  
};

const HomeHeader: React.FC<props> = ({ type  }) => {
  const location = useLocation();

  const toggle_data = useSelector((state: AppState) => state.toggleSidebar);
  const [scrollYPosition, setScrollYPosition] = useState<number>(0);
  const [close, setClose] = useState<boolean>(true);
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [currentCity, setCurrentCity] = useState<string | null>(null);


  const dispatch = useDispatch();

  // useEffect(() => {

  //   const city = localStorage.getItem('city');
  //   setCurrentCity(city);
  // }, []);

  useEffect(() => {
    const storedCity = localStorage.getItem('city');
    setCurrentCity(storedCity);

    const handleCityChange = (event: Event) => {

      const city = (event as CustomEvent).detail;
      setCurrentCity(city);
    };

    window.addEventListener('cityChanged', handleCityChange);

    return () => {
      window.removeEventListener('cityChanged', handleCityChange);
    };
  }, []);


  const toogle = () => {
    dispatch(set_toggleSidebar_data(toggle_data ? false : true));
  };

  const handleCityClick = () => {
    setShowCityModal(true);
  };
  const handleCitySelect = (city: string, branchId: number) => {
    localStorage.setItem('city', city);
    localStorage.setItem('branch_id', branchId.toString());
    setCurrentCity(city);
    setShowCityModal(false);
  };


  const handleCloseModal = () => {
    setShowCityModal(false);
  };

  const handleScroll = () => {
    setScrollYPosition(scrollY);
  };
  useEffect(() => {
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll('.has-submenu');
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll('li');
      const listItems2 = submenu.querySelectorAll('.single-demo');
      submenu.classList.remove('active');
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains('active')) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add('active');
          return;
        }
      });
      listItems2.forEach((item) => {
        if (item.classList.contains('active')) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add('active');
          return;
        }
      });
    });
  }, [location.pathname]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isRouteActive = (path: string): boolean => {
    return location.pathname === path;
  };
  return (
    <>
      {showCityModal && (
        <CityModal
          onSelectCity={handleCitySelect}
          onClose={handleCloseModal}
          selectedCity={currentCity}
        />
      )}
      {/* <div className={` top-bar `}>
        <h6>50% OFF on Christmas</h6>
        <ul>
          <li>2</li>
          <li>15</li>
          <li>33</li>
          <li>32</li>
        </ul>
        <Link to="#" className="top-close" onClick={() => setClose(false)}>
          <Icon.X />
        </Link>
      </div> */}





      <header className={`header  ${scrollYPosition > 200 ? 'fixed' : ''}`}>
        <div
          className={` ${type == 4 || type == 1 ? 'container-fluid' : 'container'}`}
        >
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <Link onClick={toogle} id="mobile_btn" to="#">
                <span className="bar-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </Link>
              <Link to="/" className="navbar-brand logo" >
                <img
                  src={logoNav}
                  className="img-fluid "
                  style={{ width: "100px", height: "50px" }}
                  alt="Logo"
                />
              </Link>
              <Link to="/" className="navbar-brand logo-small">
                <img
                  src={logoNav}
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link to="/" onClick={() => dispatch(set_toggleSidebar_data(false))} className="menu-logo">
                  <img
                     src={logoNav}
                    className="img-fluid"
                    style={{ width: "100px", height: "50px", textAlign: "center" }}
                    alt="Logo"
                  />
                </Link>
                <Link
                  onClick={toogle}
                  id="menu_close"
                  className="menu-close"
                  to="#"
                >
                  {' '}
                  <i className="fas fa-times" />
                </Link>

              </div>

              {/* <ul className="main-nav align-items-lg-center">
                <li className={isRouteActive('/') ? 'active' : ''}>
                  <Link to="/">Home</Link>
                </li>

                <li
                  className={isRouteActive('/pages/about-us') ? 'active' : ''}
                >
                  <Link to="/pages/about-us">About Us</Link>
                </li>

                <li
                  className={
                    isRouteActive('/pages/service') ? 'active' : ''
                  }
                >
                  <Link to="/pages/service">Services</Link>
                </li>
                <li className={isRouteActive('/pages/client') ? 'active' : ''}>
                  <Link to="/pages/client">Client</Link>
                </li>
                <li
                  className={isRouteActive('/pages/blog') ? 'active' : ''}
                >
                  <Link to="/pages/blog">Blog</Link>
                </li>
                <li
                  className={isRouteActive('/pages/contact-us') ? 'active' : ''}
                >
                  <Link to="/pages/contact-us">Contact Us</Link>
                </li>
              </ul> */}
              <ul className="main-nav align-items-lg-center">
                <li className={isRouteActive('/') ? 'active' : ''}>
                  <Link to="/" onClick={() => dispatch(set_toggleSidebar_data(false))}>Home</Link>
                </li>

                <li className={isRouteActive('/about-us') ? 'active' : ''}>
                  <Link to="/about-us" onClick={() => dispatch(set_toggleSidebar_data(false))}>About Us</Link>
                </li>

                <li className={isRouteActive('/service') ? 'active' : ''}>
                  <Link to="/service" onClick={() => dispatch(set_toggleSidebar_data(false))}>Services</Link>
                </li>

                <li className={isRouteActive('/client') ? 'active' : ''}>
                  <Link to="/client" onClick={() => dispatch(set_toggleSidebar_data(false))}>Client</Link>
                </li>

                <li className={isRouteActive('/blog') ? 'active' : ''}>
                  <Link to="/blog" onClick={() => dispatch(set_toggleSidebar_data(false))}>Blog</Link>
                </li>

                <li className={isRouteActive('/contact-us') ? 'active' : ''}>
                  <Link to="/contact-us" onClick={() => dispatch(set_toggleSidebar_data(false))}>Contact Us</Link>
                </li>
              </ul>
            </div>

            <ul className="nav header-navbar-rht">
              <li className="nav-item city-selector" onClick={handleCityClick}>
                <div className="nav-link" style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  background: '#f5f7fa',
                  transition: 'all 0.2s ease'
                }}>
                  <Icon.MapPin size={16} style={{ marginRight: '8px', color: '#3182ce' }} />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: currentCity ? '#2d3748' : '#718096'
                  }}>
                    {currentCity || 'Select City'}
                  </span>
                </div>
              </li>


              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center border border-danger rounded px-2 py-1 header-login text-white"
                  to="/become-vendor"
                >
                  <i className="fa-regular fa-circle-user me-1"></i>
                  <span className="fs-16">Become a Vendor</span>
                </Link>
              </li>



            </ul>

          </nav>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;
