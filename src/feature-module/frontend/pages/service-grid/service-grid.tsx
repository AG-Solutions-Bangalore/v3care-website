import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import * as Icon from 'react-feather';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL, SERVICE_SUPER_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';
import './ServiGrid.css';
import DefaultHelmet from '../../common/helmet/DefaultHelmet';

interface ServiceSuper {
  id: number;
  serviceSuper: string;
  serviceSuper_image: string | null;
  total: number;
  serviceSuper_url: string;
}

interface Service {
  id: number;
  service: string;
  service_image: string | null;
  service_slug: string;
}

interface ServiceSub {
  id: number;
  service_sub: string;
  service_sub_image: string | null;
  service_sub_slug: string;
}

const ServiceGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const branchId = localStorage.getItem("branch_id");
  const city = localStorage.getItem("city");
  const [activeSuperCategory, setActiveSuperCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [fetchSubServicesEnabled, setFetchSubServicesEnabled] = useState(false);

  
  const { 
    data: serviceSupers, 
    isLoading: isServiceSupersLoading, 
    error: serviceSupersError,
    refetch: refetchServiceSupers
  } = useQuery({
    queryKey: ['serviceSupers', branchId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      return response.data.serviceSuper || [];
    },
    staleTime: 60 * 60 * 1000, 
    retry: 2,
  });

  
  const { 
    data: servicesData, 
    isLoading: isServicesLoading, 
    error: servicesError,
    refetch: refetchServices 
  } = useQuery({
    queryKey: ['services', activeSuperCategory, branchId],
    queryFn: async () => {
      if (!activeSuperCategory) return { services: [], serviceSuper: null };
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-out/${activeSuperCategory}/${branchId}`);
      return {
        services: response.data.service || [],
        serviceSuper: response.data.serviceSuper || null
      };
    },
    enabled: !!activeSuperCategory,
    staleTime: 60 * 60 * 1000, 
    retry: 2,
  });

 
  const { 
    data: subServices, 
    isLoading: isSubServicesLoading,
    isFetching: isSubServicesFetching,
    error: subServicesError
  } = useQuery({
    queryKey: ['subServices', selectedService?.service_slug, branchId],
    queryFn: async () => {
      if (!selectedService) return [];
      const response = await axios.get<{ servicesub: ServiceSub[] }>(
        `${BASE_URL}/api/panel-fetch-web-service-sub-out/${selectedService.service_slug}/${branchId}`
      );
      return response.data.servicesub || [];
    },
    enabled: fetchSubServicesEnabled && !!selectedService, 
    retry: 2,
  });

 
  useEffect(() => {
    if (serviceSupers && serviceSupers.length > 0 && !activeSuperCategory) {
      setActiveSuperCategory(serviceSupers[0].serviceSuper_url);
    }
  }, [serviceSupers, activeSuperCategory]);

 
  useEffect(() => {
    if (fetchSubServicesEnabled && selectedService && subServices !== undefined) {
      if (subServices && subServices.length > 0) {
        setShowSubServiceModal(true);
      } else {
       
        navigateToServiceDetails(selectedService.id, selectedService.service, selectedService.service_slug);
      }
      setFetchSubServicesEnabled(false); 
    }
  }, [subServices, fetchSubServicesEnabled, selectedService]);

  
  useEffect(() => {
    if (fetchSubServicesEnabled && selectedService && subServicesError) {
    
      navigateToServiceDetails(selectedService.id, selectedService.service, selectedService.service_slug);
      setFetchSubServicesEnabled(false); 
    }
  }, [subServicesError, fetchSubServicesEnabled, selectedService]);

  const SkeletonLoader = () => {
    return (
      <div className="service-grid-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="service-grid-card skeleton">
            <div className="service-grid-card-image shimmer"></div>
            <div className="service-grid-card-content">
              <div className="service-grid-card-title shimmer"></div>
              <div className="service-grid-card-footer shimmer">
                <div className="shimmer-circle"></div>
                <div className="shimmer-button"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowSubServiceModal(false);
    setFetchSubServicesEnabled(true); 
  };

  const navigateToServiceDetails = (serviceId: number, serviceName: string, serviceUrl: string) => {
    navigate(`/${activeSuperCategory}/${encodeURIComponent(serviceUrl)}/pricing`);
  };

  const navigateToSubServiceDetails = (subService: ServiceSub) => {
    if (!selectedService || !activeSuperCategory) return;
    
    navigate(`/${activeSuperCategory}/${encodeURIComponent(selectedService.service_slug)}/${encodeURIComponent(subService.service_sub_slug)}/pricing`);
  };

  const handleSuperCategoryClick = (superCategoryId: string) => {
    setActiveSuperCategory(superCategoryId);
    setShowSubServiceModal(false);
    setSelectedService(null);
    setFetchSubServicesEnabled(false); 
  };

  const handleCloseModal = () => {
    setShowSubServiceModal(false);
    setSelectedService(null);
    setFetchSubServicesEnabled(false); 
  };

  const getImageUrl = (imageName: string | null, isSubService = false) => {
    if (!imageName) return `${NO_IMAGE_URL}`;
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  const getImageUrlCategory = (image: string | null) => {
    if (!image) return `${NO_IMAGE_URL}`;
    return `${SERVICE_SUPER_IMAGE_URL}/${image}`;
  };

  if (isServiceSupersLoading) {
    return (
      <>
        <DefaultHelmet/>
        <HomeHeader />
        <div className="service-grid-loading-container">
          <div className="service-grid-loading-content">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="service-grid-loading-text">Loading services...</p>
          </div>
        </div>
      </>
    );
  }

  if (serviceSupersError) {
    return (
      <>
        <DefaultHelmet/>
        <HomeHeader />
        <div className="service-grid-error-container">
          <div className="service-grid-error-content">
            <Icon.AlertCircle className="service-grid-error-icon" size={18} />
            <div className="service-grid-error-message">{(serviceSupersError as Error).message}</div>
            <button 
              className="service-grid-error-button"
              onClick={() => refetchServiceSupers()}
            >
              <Icon.RefreshCw className="me-1" size={14} />
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DefaultHelmet/>
      <HomeHeader />
      
      <div className="service-grid-container">
        <div className="service-grid-content">
          <div className="service-grid-header">
            <div className="service-grid-title-wrapper">
              <h1 className="service-grid-main-title">{servicesData?.serviceSuper?.serviceSuper || "Our Services"}</h1>
              <p className="service-grid-subtitle">Choose from our wide range of professional services</p>
            </div>
            <div className="service-grid-nav-and-list">
              <div className="service-grid-nav">
                <button className="service-grid-nav-button" onClick={() => {
                  const container = document.querySelector('.service-grid-list');
                  if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                }}>
                  <Icon.ChevronLeft size={16} />
                </button>
                <button className="service-grid-nav-button" onClick={() => {
                  const container = document.querySelector('.service-grid-list');
                  if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                }}>
                  <Icon.ChevronRight size={16} />
                </button>
              </div>
              <div className="service-grid-list">
                {serviceSupers?.map((superCat) => (
                  <div 
                    key={superCat.id}
                    className={`service-grid-category-item ${activeSuperCategory === superCat.serviceSuper_url ? 'active' : ''}`}
                    onClick={() => handleSuperCategoryClick(superCat.serviceSuper_url)}
                  >
                    <div className="service-grid-category-card">
                      <LazyLoadImage
                        src={getImageUrlCategory(superCat.serviceSuper_image)}
                        alt={superCat.serviceSuper}
                        className="service-grid-category-image"
                        effect="blur"
                        width="100%"
                        height="100%"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `${NO_IMAGE_URL}`;
                        }}
                      />
                      <span className="service-grid-category-name">{superCat.serviceSuper}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isServicesLoading ? (
            <SkeletonLoader />
          ) : servicesError ? (
            <div className="service-grid-error-container">
              <div className="service-grid-error-content">
                <Icon.AlertCircle className="service-grid-error-icon" size={18} />
                <div className="service-grid-error-message">{(servicesError as Error).message}</div>
                <button
                  className="service-grid-error-button"
                  onClick={() => refetchServices()}
                >
                  <Icon.RefreshCw className="me-1" size={14} />
                  Try Again
                </button>
              </div>
            </div>
          ) : servicesData?.services?.length === 0 ? (
            <div className="service-grid-empty-container">
              <div className="service-grid-empty-content">
                <LazyLoadImage
                  src={`${NO_IMAGE_URL}`}
                  alt="No services found"
                  effect="blur"
                  className="service-grid-empty-image"
                />
                <h4 className="service-grid-empty-title">No services found</h4>
                <p className="service-grid-empty-text">We could not find any services in this category.</p>
              </div>
            </div>
          ) : (
            <div className="service-grid-grid">
              {servicesData?.services?.map((service) => (
                <div key={service.id} className="service-grid-card-wrapper">
                  <div 
                    className="service-grid-card"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="service-grid-card-image-container">
                      <LazyLoadImage
                        src={getImageUrl(service.service_image)}
                        className="service-grid-card-image"
                        alt={service.service}
                        effect="blur"
                        width="100%"
                        height="100%"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `${NO_IMAGE_URL}`;
                        }}
                      />
                    </div>
                    <div className="service-grid-card-content">
                      <h1 className="service-grid-card-title">{service.service}</h1>
                      <div className="service-grid-card-footer">
                        <span className="service-grid-card-city">
                          <Icon.MapPin className="service-grid-card-icon" size={12} />
                          <span>{city}</span>
                        </span>
                        <button 
                          className="service-grid-book-now-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceClick(service);
                          }} 
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sub-Service Modal */}
      {showSubServiceModal && selectedService && (
        <div className="modal fade show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.3)',
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
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  <Icon.Grid className="me-2" size={18} />
                  Select {selectedService.service}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body p-3" style={{ 
                maxHeight: '65vh',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
              }}>
                {(isSubServicesLoading || isSubServicesFetching) ? (
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
                    {subServices?.map((subService) => (
                      <div key={subService.id} className="col-6 col-sm-4 col-md-3">
                        <div 
                          className="card h-100 border-0 overflow-hidden position-relative"
                          onClick={() => navigateToSubServiceDetails(subService)}
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
                            <LazyLoadImage
                              src={getImageUrl(subService.service_sub_image, true)}
                              alt={subService.service_sub}
                              className="img-fluid object-fit-cover"
                              effect="blur"
                              width="100%"
                              height="100%"
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
                borderTop: '1px solid rgba(236, 72, 153, 0.1)'
              }}>
                <button 
                  type="button" 
                  className="btn btn-sm px-3 fw-medium"
                  onClick={handleCloseModal}
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

export default ServiceGrid;