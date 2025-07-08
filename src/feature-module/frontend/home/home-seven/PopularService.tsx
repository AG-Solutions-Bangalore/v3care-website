import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import axios from 'axios';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import SkeletonPopularService from '../../../skeletonLoader/SkeletonPopularService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './PopularService.css';
import type { Swiper as SwiperType } from 'swiper';

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

const PopularService = () => {
  const navigate = useNavigate();
  const branchId = localStorage.getItem("branch_id");

  const [services, setServices] = useState<Service[]>([]);
  const [servicesTwo, setServicesTwo] = useState<Service[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<ServiceSub[]>([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const fetchServices = async () => {
    try {
      setIsServicesLoading(true);
      setServicesError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-all-out`);
     
      const filteredServices = response.data.service.filter((service: Service) => 
        service.service_show_website && service.service_show_website.includes("1")
      );
      const filteredServicesTwo = response.data.service.filter((service: Service) => 
        service.service_show_website && service.service_show_website.includes("2")
      );
    
      setServices(filteredServices);
      setServicesTwo(filteredServicesTwo);
  
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServicesError('Failed to load services. Please try again.');
    } finally {
      setIsServicesLoading(false);
    }
  };
  
  const fetchSubServices = async (serviceId: number, serviceName: string,serviceSuperUrl: string, superServiceId: number) => {
    try {
      setSubServiceLoading(true);
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

  const getImageUrlService = (imageName: string | null, isSubService = false) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    fetchSubServices(service.id, service.service, service.serviceSuper_url, service.super_service_id);
  };

  const sliderSettings = {
    modules: [Navigation, Autoplay],
    spaceBetween: 20,
    slidesPerView: 'auto',
    centeredSlides: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      disabledClass: 'swiper-button-disabled'
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
      pauseOnMouseEnter: true
    },
    onSwiper: (swiper: SwiperType) => {
      setSwiperInstance(swiper);
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
    onSlideChange: (swiper: SwiperType) => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
    breakpoints: {
      320: {
        spaceBetween: 15,
      },
      768: {
        spaceBetween: 20,
      }
    }
  };

  const handleMouseEnter = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };
  
  const handleMouseLeave = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  return (
    <>
      {/* First Section - Centered Header */}
      <section className="popular-service-home-section">
        <div className="popular-service-home-container">
          <div className="popular-service-home-header text-center">
            <h2 className="popular-service-home-title">Most Popular Services</h2>
            <p className="popular-service-home-subtitle">What do you need to find?</p>
          </div>

          {isServicesLoading && <SkeletonPopularService />}

          {servicesError && !isServicesLoading && (
            <div className="popular-service-home-error">
              <Icon.AlertCircle className="popular-service-home-error-icon" size={18} />
              <span>{servicesError}</span>
              <button
                className="popular-service-home-retry-btn"
                onClick={fetchServices}
              >
                <Icon.RefreshCw className="popular-service-home-retry-icon" size={14} />
                Try Again
              </button>
            </div>
          )}

          {!isServicesLoading && !servicesError && services.length > 0 && (
            <div className="popular-service-home-slider-wrapper">
              <div className="popular-service-home-slider-container">
                <Swiper {...sliderSettings} className="popular-service-home-slider">
                  {services.map((service) => (
                    <SwiperSlide key={service.id} className="popular-service-slide">
                      <div
                        className="popular-service-home-card"
                        onClick={() => handleServiceClick(service)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="popular-service-home-card-image">
                          <img
                            src={getImageUrlService(service.service_image)}
                            alt={service.service}
                            // loading="lazy"
                            // decoding="async"
                          />
                          <div className="popular-service-home-card-overlay"></div>
                          <div className="popular-service-home-card-badge">
                            {service.service}
                          </div>
                        </div>
                        {/* <div className="popular-service-home-card-content">
                          <h3 className="service-title">{service.service}</h3>
                          <div className="popular-service-home-card-cta">
                            <span>View Details</span>
                            <Icon.ArrowRight size={16} />
                          </div>
                        </div> */}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className={`swiper-button-prev ${isBeginning ? 'swiper-button-disabled' : ''}`}></div>
                <div className={`swiper-button-next ${isEnd ? 'swiper-button-disabled' : ''}`}></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Second Section - Left Aligned Header */}
      {servicesTwo.length >= 7 && (
        <section className="popular-service-home-featured-section">
          <div className="popular-service-home-container">
            <div className="popular-service-home-header text-left">
              <h2 className="popular-service-home-title">Featured Services</h2>
              <p className="popular-service-home-subtitle">Discover our premium offerings</p>
            </div>

            {!isServicesLoading && !servicesError && (
              <div className="popular-service-home-slider-wrapper">
                <div className="popular-service-home-slider-container">
                  <Swiper {...sliderSettings} className="popular-service-home-slider">
                    {servicesTwo.map((service) => (
                      <SwiperSlide key={service.id} className="popular-service-slide">
                        <div
                          className="popular-service-home-card featured-card"
                          onClick={() => handleServiceClick(service)}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="popular-service-home-card-image">
                            <img
                              src={getImageUrlService(service.service_image)}
                              alt={service.service}
                              // loading="lazy"
                              // decoding="async"
                            />
                            <div className="popular-service-home-card-overlay"></div>
                            <div className="popular-service-home-card-badge">
                              {service.service}
                            </div>
                          </div>
                          {/* <div className="popular-service-home-card-content">
                            <h3 className="service-title">{service.service}</h3>
                            <div className="popular-service-home-card-cta">
                              <span>Explore Now</span>
                              <Icon.ArrowRight size={16} />
                            </div>
                          </div> */}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className={`swiper-button-prev ${isBeginning ? 'swiper-button-disabled' : ''}`}></div>
                  <div className={`swiper-button-next ${isEnd ? 'swiper-button-disabled' : ''}`}></div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal remains unchanged */}
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
                              // loading="lazy"
                              // decoding="async"
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
    </>
  );
};

export default PopularService;