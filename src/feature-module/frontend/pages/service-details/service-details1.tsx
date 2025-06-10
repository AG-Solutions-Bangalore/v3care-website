import React, { useEffect, useState } from 'react';
import 'yet-another-react-lightbox/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import axios from 'axios';
import { BASE_URL, SERVICE_DETAILS_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../core/redux/slices/CartSlice';
import './ServiceDetails.css'




const ServiceDetails1 = () => {

  const dispatch = useDispatch();


   

     const params = useParams<{
      id?: string;
      category_name?: string;
      service_name?: string;
      service_sub_name?: string;
      service_id?: string;
      service_sub_id?: string;
    }>();
    
    const {
      id = "",
      category_name = "",
      service_name = "",
      service_sub_name = "",
      service_id = "",
      service_sub_id = "",
    } = params;
 

    // id : supercategory id 

    // category_name : supecategory name

    // service_name :  state?.service_name

    // service_sub_name : state?.service_sub_name 

    // service_id : state?.service_id 

    // service_sub_id : state?.service_sub_id

  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const branch_id = localStorage.getItem('branch_id');

  const city = localStorage.getItem("city") || "your area";
  const message = `We're not available in ${city} at the moment, but we're expanding and will be there soon!`;

  const [servicePrices, setServicePrices] = useState<any[]>([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [serviceCards, setServiceCards] = useState<any[]>([]);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [selectedPrices, setSelectedPrices] = useState<any[]>([]);
  const [serviceMeta, setServiceMeta] = useState<any>(null);
  const [showFullText, setShowFullText] = useState<Record<string | number, boolean>>({});
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [notifications, setNotifications] = useState<{
    id: string;
    message: string;
    type: 'success' | 'error';
  }[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);



  const updateMetaTags = (title: string, metaTitle: string, metaDescription: string) => {
 
    document.title = title;

   
    let titleMeta = document.querySelector('meta[name="title"]');
    if (titleMeta) {
      titleMeta.setAttribute('content', metaTitle);
    } else {
      titleMeta = document.createElement('meta');
      titleMeta.setAttribute('name', 'title');
      titleMeta.setAttribute('content', metaTitle);
      document.head.appendChild(titleMeta);
    }

   
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', metaDescription);
    } else {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      descriptionMeta.setAttribute('content', metaDescription);
      document.head.appendChild(descriptionMeta);
    }
  };


  useEffect(() => {
    if (serviceMeta?.service && serviceMeta?.service_meta_title && serviceMeta?.service_meta_description) {
      updateMetaTags(
        serviceMeta.service,
        serviceMeta.service_meta_title,
        serviceMeta.service_meta_description
      );
    }

  
    return () => {
   
     updateMetaTags(
         "Best house cleaning service | V3 Care",
       "Best house cleaning service | Affordable cleaning services.",
       "Get professional high quality cleaning services at affordable prices, Book house cleaning, office cleaning, deep cleaning & bathroom cleaning services."
       );
    };
  }, [serviceMeta]);


  const showNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const fetchServicePrices = async () => {
    try {
      setPriceLoading(true);
      setPriceError(null);

      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-web-service-price-out`,
        {
          branch_id: branch_id,
          order_service: service_id,
          order_service_sub: service_sub_id,
        },
      );

      setServicePrices(response.data.serviceprice || []);
       // Set the service meta data
       if (response.data.service) {
        setServiceMeta(response.data.service);
      }
    } catch (error) {
      console.error('Error fetching service prices:', error);
      setPriceError('Failed to load service prices. Please try again.');
    } finally {
      setPriceLoading(false);
    }
  };

  const fetchServiceCard = async () => {
    try {
      setCardLoading(true);
      setCardError(null);

      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-web-service-details-out`,
        {
          service_id: service_id,
          service_sub_id: service_sub_id,
        },
      );

      setServiceCards(response.data.serviceDetails || []);
    } catch (error) {
      console.error('Error fetching service card :', error);
      setCardError('Failed to load service card. Please try again.');
    } finally {
      setCardLoading(false);
    }
  };

  useEffect(() => {
    if (service_id && branch_id) {
      fetchServicePrices();
    }
  }, [service_id, service_sub_id, branch_id]);

  useEffect(() => {
    if (service_id) {
      fetchServiceCard();
    }
  }, [service_id, service_sub_id]);

  useEffect(() => {
    if (servicePrices.length > 0) {
      setSelectedPrices([servicePrices[0]]);
    }
  }, [servicePrices]);





  const totalPrice = selectedPrices.reduce(
    (sum, price) => sum + parseFloat(price.service_price_amount),
    0,
  );
  const totalOriginalPrice = selectedPrices.reduce(
    (sum, price) => sum + parseFloat(price.service_price_rate),
    0,
  );




  /*------------------------------------------------end----------------- */

  const togglePriceSelection = (price: any) => {

    setSelectedPrices((prev) => {
      const isSelected = prev.some((p) => p.id === price.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== price.id);
      } else {
        return [...prev, price];
      }
    });
  };



  return (
    <>
    
      <HomeHeader />
      <style>
        {`
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    `}
      </style>
      <style>
        {`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}
      </style>

      <div
        style={{
          position: 'fixed',
          top: isSmallScreen ? '105px' : '110px',
          right: '20px',
          zIndex: 1000,
          maxWidth: '300px',
          width: '100%',
          left: isSmallScreen ? '50%' : 'auto',
          transform: isSmallScreen ? 'translateX(-50%)' : 'none',
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show p-2 mb-2`}
            style={{
              width: '100%',
              borderRadius: '4px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'slideDown 0.3s ease-out',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ flex: 1 }}>{notification.message}</span>
            <button
              type="button"
              className="btn-close p-1"
              style={{ fontSize: '10px' }}
              onClick={() => removeNotification(notification.id)}
              aria-label="Close"
            />
          </div>
        ))}
      </div>


      <div className="page-wrapper">


        <div
          className="d-lg-none"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            background: 'linear-gradient(90deg, #4361ee 0%, #7209b7 100%)',
            color: 'white',
            zIndex: 1000,
            borderTopLeftRadius: showBreakdown ? '0' : '12px',
            borderTopRightRadius: showBreakdown ? '0' : '12px',
            boxShadow: '0 -3px 10px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            transition: 'border-radius 0.3s ease'
          }}
        >
          {/* Shine effect overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
              animation: 'shine 3s infinite'
            }}
          ></div>

          {/* Content container */}
          <div className="container-fluid py-2 px-3">
            <div className="row align-items-center" onClick={() => setShowBreakdown(!showBreakdown)}>
              <div className="col">
                <div className="d-flex align-items-center">
                  <span
                    className="badge rounded-pill me-2"
                    style={{
                      backgroundColor: '#ffe600',
                      color: '#7209b7',
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedPrices.length}
                  </span>
                  <div>
                    <span className="fw-bold">₹{totalPrice.toFixed(2)}</span>
                    {totalOriginalPrice > 0 && (
                      <small
                        className="ms-2"
                        style={{
                          textDecoration: 'line-through',
                          opacity: 0.75
                        }}
                      >
                        ₹{totalOriginalPrice.toFixed(2)}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <i className={`fas fa-chevron-${showBreakdown ? 'down' : 'up'} text-white`}></i>
              </div>
            </div>

            {showBreakdown && (
              <div className="mt-3 pt-2 border-top">
                {selectedPrices.map((price, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span>{price.service_price_for}</span>
                    <span>₹{price.service_price_amount}</span>
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>


        <div className="content">

          <div className="container">
            <div className="row">
              <div className="col-xl-8">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="service-head mb-2">
                {/* <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <h3 className="mb-2">Lighting Servicesedit</h3>
                        <h3 className="mb-2">
                          {state?.service_name || 'Service Name'}
                          {state?.service_id || 'Service Id'}---
                          {state?.service_sub_id || 'Service Sub id'}
                          {state?.service_sub_name || 'Service Sub'} ---
                          {city && ` (${city})`}
                          {branch_id && ` [Branch: ${branch_id}]`}
                        </h3>
                        <h4 className="mb-2  text-primary"   >
                          <span> {state?.service_name || 'Service Name'}</span>

                          &nbsp;  <span>{state?.service_sub_name ? `-- ${state?.service_sub_name}` : ""}</span>

                        </h4>
                        <span onClick={()=>navigate("/service")} className="mb-2  text-primary "  style={{
                          cursor:"pointer"
                        }} >
                        Browse more services

                        </span>

                      </div>  */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                        <div className="d-flex align-items-center flex-wrap">
                          <h4 className="mb-0 text-primary fw-bold">
                            {service_name || 'Service Name'}
                            { service_sub_name && (
                              <span style={{ color: 'gray', fontSize: '14px', }}>( {service_sub_name})</span>
                            )}
                          </h4>
                        </div>
                        <button
                          onClick={() => navigate("/service")}
                          className="btn btn-link text-decoration-none text-primary p-0"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          <i className="fas fa-arrow-left me-2"></i>Browse Services
                        </button>
                      </div>
                    </div>








                    <div className="accordion service-accordion">
                      <div className="accordion-item mb-4">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button p-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#overview"
                            aria-expanded="false"
                          >
                            Service Offered
                          </button>
                        </h2>
                        <div id="overview" className="accordion-collapse collapse show">
                          <div className="accordion-body border-0 p-0 pt-2">
                            <div className="bg-light-200 p-2 offer-wrap">
                              {priceLoading ? (
                                <div className="text-center py-3">
                                  <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  <p className="mt-2">Loading prices...</p>
                                </div>
                              ) : priceError ? (
                                <div className="alert alert-danger d-flex align-items-center justify-content-between py-2">
                                  <div className="fs-14">{priceError}</div>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={fetchServicePrices}
                                  >
                                    Try Again
                                  </button>
                                </div>
                              ) : servicePrices.length > 0 ? (
                                servicePrices.map((price) => (
                                  <div
                                    key={price.id}
                                    className={`offer-item d-flex align-items-center justify-content-between mb-2 p-2 ${selectedPrices.some((p) => p.id === price.id)
                                        ? 'bg-primary-light border-primary'
                                        : 'bg-white'
                                      }`}
                                    style={{
                                      cursor: 'pointer',
                                      transition: 'all 0.3s ease',
                                      border: selectedPrices.some((p) => p.id === price.id)
                                        ? '1px solid #0d6efd'
                                        : '1px solid #dee2e6',
                                      borderRadius: '6px',
                                    }}
                                    onClick={() => togglePriceSelection(price)}
                                  >
                                    <div className="d-flex align-items-center">
                                      <span className="avatar avatar-sm flex-shrink-0 me-2">
                                        {selectedPrices.some((p) => p.id === price.id) ? (
                                          <i className="fas fa-check-circle text-primary fs-5"></i>
                                        ) : (
                                          <i className="far fa-circle text-muted fs-5"></i>
                                        )}
                                      </span>
                                      <h6 className="fs-14 fw-medium mb-0">
                                        {price.service_price_for}
                                      </h6>
                                    </div>
                                    <div className="text-end">
                                      <h6 className="fs-14 fw-medium text-primary mb-0">
                                        ₹{price.service_price_amount}

                                      </h6>
                                      <p className="fs-12 text-muted mb-0 text-decoration-line-through">
                                        ₹{price.service_price_rate}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="alert alert-info py-2 fs-14">{message}</div>
                              )}
                            </div>
                          </div>
                          <div id="include" className="accordion-collapse collapse show">
                            <div className="accordion-body border-0 p-0 pt-2">
                              <div className="bg-light-200  p-2 br-10">
                            
                                <div className="button-group-container">
  <button
    className="add-to-cart-btn"
    onClick={() => {
      if (selectedPrices.length === 0) {
        showNotification('Please select at least one service', 'error');
        return;
      }
      selectedPrices.forEach(price => {
        dispatch(addToCart({
          id: price.id,
          service_price_for: price.service_price_for,
          service_price_rate: price.service_price_rate,
          service_price_amount: price.service_price_amount,
          service_id: service_id,
          service_name: service_name,
          service_sub_id: service_sub_id,
          service_sub_name: service_sub_name,
          service_label: price?.status_label,
        }));
      });
      showNotification('Service added to cart', 'success');
    }}
  >
    <i className="fas fa-cart-plus"></i> Add to Cart
  </button>
  
  <button
    className=" checkout-btn" 
    onClick={() => {
      if (selectedPrices.length === 0) {
        showNotification('Please select at least one service', 'error');
        return;
      }
      navigate('/cart');
      selectedPrices.forEach(price => {
        dispatch(addToCart({
          id: price.id,
          service_price_for: price.service_price_for,
          service_price_rate: price.service_price_rate,
          service_price_amount: price.service_price_amount,
          service_id: service_id,
          service_name: service_name,
          service_sub_id: service_sub_id,
          service_sub_name: service_sub_name,
          service_label: price?.status_label,
        }));
      });
    }}
  >
    <i className="fas fa-shopping-bag"></i> Checkout
  </button>
</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>









                      <div className="accordion-item mb-4">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button p-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#include"
                            aria-expanded="false"
                          >
                            Includes
                          </button>
                        </h2>
                        <div
                          id="include"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body border-0 p-0 pt-3">
                            <div className="bg-light-200 p-3 pb-2 br-10">
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Verified Professionals
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Safe Chemicals 
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Superior Stain Removal
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Hassle Free Booking
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Transparent Pricing
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item mb-0">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button p-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#faq"
                            aria-expanded="false"
                          >
                            FAQ’s
                          </button>
                        </h2>
                        <div
                          id="faq"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body border-0 p-0 pt-3">
                            <div
                              className="accordion accordion-customicon1 faq-accordion"
                              id="accordionfaq"
                            >
                              <div className="accordion-item bg-light-200 mb-3">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq1"
                                    aria-expanded="false"
                                  >
                                 What types of cleaning services do you offer?
                                  </button>
                                </h2>
                                <div
                                  id="faq1"
                                  className="accordion-collapse collapse show"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                    We provide a wide range of services including home deep cleaning, kitchen cleaning, bathroom cleaning, sofa and carpet shampooing, window cleaning, pest control, and much more. Whether it’s a one-time job or regular maintenance, we’ve got you covered.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion-item bg-light-200 mb-3">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq2"
                                    aria-expanded="false"
                                  >
                                Do I need to provide any cleaning materials or equipment?
                                  </button>
                                </h2>
                                <div
                                  id="faq2"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                    No, our professionals come fully equipped with all the necessary tools and high-quality cleaning products to get the job done effectively.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion-item bg-light-200 mb-3">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq3"
                                    aria-expanded="false"
                                  >
                                    How do I book a service and what is the process?
                                  </button>
                                </h2>
                                <div
                                  id="faq3"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                    Booking is simple! Just select the service you need, choose your preferred date and time, and confirm your booking. Our team will then arrive at your location and complete the service as scheduled.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion-item bg-light-200">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq4"
                                    aria-expanded="false"
                                  >
                                    Are your services safe for pets and children?
                                  </button>
                                </h2>
                                <div
                                  id="faq4"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                    Yes, we use eco-friendly and non-toxic products wherever possible to ensure the safety of your entire household, including kids and pets.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 theiaStickySidebar">
                <StickyBox>
                  <div className="card border-0 d-none d-lg-block ">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between ">
                        <div className="d-flex align-items-center">
                          <div className="mb-3">
                            <p className="fs-14 mb-0">Starts From</p>

                            <h4>
                              <span className="display-6 fw-bold">
                                &#8377;{totalPrice.toFixed(2) || '0'}
                              </span>
                              {totalOriginalPrice > 0 && (
                                <span className="text-decoration-line-through text-default">
                                  {' '}
                                  &#8377;{totalOriginalPrice.toFixed(2)}
                                </span>
                              )}
                            </h4>
                          </div>
                        </div>
                        <span className="badge bg-success mb-3 d-inline-flex align-items-center fw-medium">
                          <i className="ti ti-circle-percentage me-1" />
                          {Math.round((1 - totalPrice / totalOriginalPrice) * 100) || 0}% Offer
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* recommendation card  */}
                  {cardLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading service cards...</p>
                    </div>
                  ) : cardError ? (
                    <div className="alert alert-danger d-flex align-items-center justify-content-between">
                      <div>{cardError}</div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={fetchServiceCard}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : serviceCards.length > 0 && (
                    serviceCards.map((card) => (
                      <>
                        <div key={card.id} className="card p-0 border-0">
                          <div className="card-body p-0">
                            <div className="img-sec w-100">
                              <img
                                src={`${SERVICE_DETAILS_IMAGE_URL}/${card.serviceDetails_image}`}
                                className="img-fluid rounded-top w-100 "
                                alt="img"
                              />
                            </div>
                            <div className="p-3">
                              <div>
                                <h5 className="fs-16 mb-1 text-wrap">
                                  {card?.serviceDetails_name}
                                </h5>


                                <p className="fs-12" style={{ textAlign: 'justify' }}>
                                  {card?.serviceDetails && (
                                    <>
                                      {showFullText?.[card.id] ? (
                                        card.serviceDetails
                                      ) : (
                                        <>
                                          {card.serviceDetails.split(' ').slice(0, 25).join(' ')}
                                          {card.serviceDetails.split(' ').length > 25 && '...'}
                                        </>
                                      )}
                                      {card.serviceDetails.split(' ').length > 25 && (
                                        <span
                                          className="link-primary text-decoration-underline ms-1"
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => setShowFullText(prev => ({ ...prev, [card.id]: !prev?.[card.id] }))}
                                        >
                                          {showFullText?.[card.id] ? 'Read less' : 'Read more'}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>

                          </div>
                        </div>
                      </>
                    ))
                  ) }

                  {/* recommendation card end */}
                </StickyBox>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails1;
//sajid 