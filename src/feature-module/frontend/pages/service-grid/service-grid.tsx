import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
   service_slug:string;
}

interface ServiceSub {
  id: number;
  service_sub: string;
  service_sub_image: string | null;
  service_sub_slug:string
}

const ServiceGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const branchId = localStorage.getItem("branch_id");
  const city = localStorage.getItem("city");
  const [serviceSupers, setServiceSupers] = useState<ServiceSuper[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [activeSuperCategory, setActiveSuperCategory] = useState<number | null>(
    location.state?.activeSuperCategory || null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(
    location.state?.selectedService || null
  );
  const [subServices, setSubServices] = useState<ServiceSub[]>([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(
    location.state?.keepModalOpen || false
  );
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  const [serviceSuper, setServiceSuper] = useState<any>(null);

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

  const fetchServiceSupers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      setServiceSupers(response.data.serviceSuper || []);
      
      if (!activeSuperCategory && response.data.serviceSuper?.length > 0) {
        const initialCategory = response.data.serviceSuper[0].serviceSuper_url;
        setActiveSuperCategory(initialCategory);
        fetchServicesBySuperCategory(initialCategory);
      } else if (activeSuperCategory) {
        fetchServicesBySuperCategory(activeSuperCategory);
      }
    } catch (error) {
      console.error('Failed to fetch service supers:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesBySuperCategory = async (superCategoryId: string) => {
    try {
      setCategoryLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-out/${superCategoryId}/${branchId}`);
      setServices(response.data.service || []);
      setFilteredServices(response.data.service || []);
      setServiceSuper(response.data.serviceSuper || null);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.keepModalOpen && location.state?.selectedService && activeSuperCategory) {
      const { selectedService } = location.state;
      setSelectedService(selectedService);
      const superCategory = serviceSupers.find(superCat => superCat.serviceSuper_url === activeSuperCategory);
      if (superCategory) {
        fetchSubServices(selectedService.id, selectedService.service,selectedService.service_slug ,superCategory.serviceSuper, activeSuperCategory);
      }
    }
  }, [ activeSuperCategory, serviceSupers]);




  const fetchSubServices = async (serviceId: number,  serviceName: string,serviceUrl:string, superCategory: string, superCategoryId: number) => {
    try {
      setSubServiceLoading(true);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-sub-out/${serviceUrl}/${branchId}`);
      
      if (response.data.servicesub && response.data.servicesub.length > 0) {
        setSubServices(response.data.servicesub);
        setShowSubServiceModal(true);
        
        navigate('.', {
          state: {
            keepModalOpen: true,
            selectedService: services.find(s => s.service_slug === serviceUrl),
            activeSuperCategory: superCategoryId,
            from: 'service-grid'
          },
          replace: true
        });
      } else {
        navigateToServiceDetails(serviceId, serviceName ,serviceUrl,superCategoryId);
      }
    } catch (error) {
      console.error('Error fetching sub-services:', error);
      navigateToServiceDetails(serviceId, serviceName,serviceUrl, superCategoryId);
    } finally {
      setSubServiceLoading(false);
    }
  };

  const navigateToServiceDetails = (serviceId: number, serviceName: string,serviceUrl:string, superCategoryId: number) => {
    const superCategoryUrl = serviceSupers.find(cat => cat.id === superCategoryId)?.serviceSuper_url;
    navigate(`/pricing/${superCategoryUrl}/${encodeURIComponent(serviceUrl)}`, {
      state: {
        service_id: serviceId,
        service_name: serviceUrl,
        from: 'service-only'
      }
    });
  };

  const navigateToSubServiceDetails = (subService: ServiceSub) => {
    
    if (!selectedService || !activeSuperCategory) return;
    
    const superCategory = serviceSupers.find(cat => cat.serviceSuper_url === activeSuperCategory);
    if (superCategory) {
      navigate(`/pricing/${superCategory.serviceSuper_url}/${encodeURIComponent(selectedService.service_slug)}/${encodeURIComponent(subService.service_sub_slug)}`, {
        state: {
          keepModalOpen: true,
          selectedService,
          activeSuperCategory,
          from: 'subservice-modal'
        }
      });
    }
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    const superCategory = serviceSupers.find(superCat => superCat.serviceSuper_url === activeSuperCategory);
    if (superCategory) {
      fetchSubServices(service.id, service.service,service.service_slug, superCategory.serviceSuper, superCategory.id);
    }
  };

  const handleSuperCategoryClick = (superCategoryId: string) => {
    setActiveSuperCategory(superCategoryId);
    setCategoryLoading(true); 
    fetchServicesBySuperCategory(superCategoryId);
    setShowSubServiceModal(false);
    setSelectedService(null);
  };

  const handleCloseModal = () => {
    setShowSubServiceModal(false);
    setSelectedService(null);
    navigate('.', {
      state: {
        keepModalOpen: false,
        selectedService: null,
        activeSuperCategory,
        from: 'service-grid'
      },
      replace: true
    });
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

  useEffect(() => {
    fetchServiceSupers();
  }, []);

  if (loading && serviceSupers.length === 0) {
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

  if (error) {
    return (
      <>
        <DefaultHelmet/>
        <HomeHeader />
        <div className="service-grid-error-container">
          <div className="service-grid-error-content">
            <Icon.AlertCircle className="service-grid-error-icon" size={18} />
            <div className="service-grid-error-message">{error}</div>
            <button 
              className="service-grid-error-button"
              onClick={fetchServiceSupers}
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
              <h2 className="service-grid-main-title">{serviceSuper?.serviceSuper || "Our Services"}</h2>
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
                {serviceSupers.map((superCat) => (
                  <div 
                    key={superCat.id}
                    className={`service-grid-category-item ${activeSuperCategory === superCat.serviceSuper_url ? 'active' : ''}`}
                    onClick={() => handleSuperCategoryClick(superCat.serviceSuper_url)}
                  >
                    <div className="service-grid-category-card">
                      <img
                        src={getImageUrlCategory(superCat.serviceSuper_image)}
                        alt={superCat.serviceSuper}
                        className="service-grid-category-image"
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

          {categoryLoading ? (
            <SkeletonLoader />
          ) : error && filteredServices.length === 0 ? (
            <div className="service-grid-error-container">
              <div className="service-grid-error-content">
                <Icon.AlertCircle className="service-grid-error-icon" size={18} />
                <span>{error}</span>
                <button
                  className="service-grid-error-button"
                  onClick={() => activeSuperCategory && fetchServicesBySuperCategory(activeSuperCategory)}
                >
                  <Icon.RefreshCw className="me-1" size={14} />
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="service-grid-empty-container">
              <div className="service-grid-empty-content">
                <img
                  src={`${NO_IMAGE_URL}`}
                  alt="No services found"
                  className="service-grid-empty-image"
                />
                <h4 className="service-grid-empty-title">No services found</h4>
                <p className="service-grid-empty-text">We could not find any services in this category.</p>
              </div>
            </div>
          ) : (
            <div className="service-grid-grid">
              {filteredServices.map((service) => (
                <div key={service.id} className="service-grid-card-wrapper">
                  <div 
                    className="service-grid-card"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="service-grid-card-image-container">
                      <img
                        src={getImageUrl(service.service_image)}
                        className="service-grid-card-image"
                        alt={service.service}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `${NO_IMAGE_URL}`;
                        }}
                      />
                    </div>
                    <div className="service-grid-card-content">
                      <h5 className="service-grid-card-title">{service.service}</h5>
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
      {showSubServiceModal && (
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
                  Select {selectedService?.service}
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
                            <img
                              src={getImageUrl(subService.service_sub_image, true)}
                              alt={subService.service_sub}
                              className="img-fluid"
                              style={{ 
                                objectFit: 'cover',
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