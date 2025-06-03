import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';

import * as Icon from 'react-feather';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';


import axios from 'axios';
import {BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL} from '../../../baseConfig/BaseUrl';
import SkeletonPopularService from '../../../skeletonLoader/SkeletonPopularService';


interface Service {
  id: number;
  service: string;
  service_image: string | null;
  service_show_website: string;
}

interface ServiceSub {
  id: number;
  service_sub: string;
  service_sub_image: string | null;
}

const PopularService = () => {
    const navigate =useNavigate()
      const branchId = localStorage.getItem("branch_id")
    
    
        const [services, setServices] = useState<Service[]>([]);
    const [isServicesLoading, setIsServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [subServices, setSubServices] = useState<ServiceSub[]>([]);
    const [showSubServiceModal, setShowSubServiceModal] = useState(false);
    const [subServiceLoading, setSubServiceLoading] = useState(false);
    
    
    
    
      const fetchServices = async () => {
        try {
          setIsServicesLoading(true);
          setServicesError(null);
          const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-all-out`);
         
          const filteredServices = response.data.service.filter((service: Service) => 
            service.service_show_website.includes("1")
          );
        
          setServices(filteredServices);
      
        } catch (error) {
          console.error('Failed to fetch services:', error);
          setServicesError('Failed to load services. Please try again.');
        } finally {
          setIsServicesLoading(false);
        }
      };
      
      const fetchSubServices = async (serviceId: number, serviceName: string) => {
        try {
          setSubServiceLoading(true);
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-web-service-sub-out/${serviceId}/${branchId}`
          );
          
          if (response.data.servicesub && response.data.servicesub.length > 0) {
            setSubServices(response.data.servicesub);
            setShowSubServiceModal(true);
          } else {
            navigate(`/service-details/${encodeURIComponent(serviceName)}`, {
              state: {
                service_id: serviceId,
                service_name: serviceName
              }
            });
          }
        } catch (error) {
          console.error('Error fetching sub-services:', error);
          navigate(`/service-details/${encodeURIComponent(serviceName)}`, {
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
        fetchSubServices(service.id, service.service);
      };

  const popularService = {
    dots: false,
    autoplay: true,
    arrows: true,
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };
  
  return (
    <>
    <section className="popular-service-seven-section">
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <div
            className="section-heading section-heading-seven "
            
          >
            <h2>Most Popular Services</h2>
            <p>What do you need to find?</p>
          </div>
        </div>
      </div>
  
      {/* Loading State */}
      {isServicesLoading && (
        <SkeletonPopularService/>
      )}
  
      {/* Error State */}
      {servicesError && !isServicesLoading && (
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            <div className="alert alert-danger d-flex align-items-center justify-content-center">
              <Icon.AlertCircle className="me-2" size={18} />
              <span>{servicesError}</span>
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={fetchServices}
              >
                <Icon.RefreshCw className="me-1" size={14} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Services Slider */}
      {!isServicesLoading && !servicesError && services.length > 0 && (
        <div className="row">
          <div className="col-md-12">
            <Slider {...popularService}  className="owl-carousel categories-slider-seven">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-widget service-two service-seven  "
                  
                  onClick={() => handleServiceClick(service)}
                
                >
                  <div className="service-img" >
                    <img
                      className="img-fluid serv-img"
                      alt="Service Image"
                      src={getImageUrlService(service.service_image)}
                      loading="lazy"
  decoding="async"
                    />
                    <div className="fav-item">
                      <span className="item-cat">{service.service}</span>
                    
                    </div>
                    {/* <div className="item-info">
                      <span className="item-img">
                        <img
                          src="assets/img/profiles/avatar-01.jpg"
                          className="avatar"
                          alt="image"
                        />
                      </span>
                    </div> */}
                  </div>
                  <div  style={{
                    cursor:"pointer"
                  }}  className="service-content service-content-seven">
                    <h3 className="title">
                      {service.service}
                    </h3>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  </section>
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
          {/* Modal Header - Pink Theme */}
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
  
          {/* Modal Body */}
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
                  style={{ color: '#ec4899' }}
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
                         onClick={() => navigate(`/service-details/${selectedService?.service}/${subService.service_sub}`, {
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
                        border: '2px solid rgba(236, 72, 153, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 15px rgba(236, 72, 153, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.1)';
                      }}
                    >
                      <div className="ratio ratio-1x1" style={{ backgroundColor: '#fdf2f8' }}>
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
  
          {/* Modal Footer - Pink Theme */}
          <div className="modal-footer py-2 px-3" style={{
            background: 'linear-gradient(to right, #ffffff, #a5a7fa)',
            borderTop: '1px solid rgba(236, 72, 153, 0.1)'
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
                // boxShadow: '0 2px 5px rgba(236, 72, 153, 0.3)'
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
  )
}

export default PopularService