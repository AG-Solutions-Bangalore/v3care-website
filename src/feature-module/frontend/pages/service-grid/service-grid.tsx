/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Icon from 'react-feather';

import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';
import './ServiGrid.css'
import DefaultHelmet from '../../common/helmet/DefaultHelmet';


interface ServiceSuper {
  id: number;
  serviceSuper: string;
  serviceSuper_image: string | null;
  total: number;
  serviceSuper_url:string;
}

interface Service {
  id: number;
  service: string;
  service_image: string | null;
}

interface ServiceSub {
  id: number;
  service_sub: string;
  service_sub_image: string | null;
}

const ServiceGrid = () => {
    
  const navigate = useNavigate();
  const branchId = localStorage.getItem("branch_id")
  const city = localStorage.getItem("city")
  const [serviceSupers, setServiceSupers] = useState<ServiceSuper[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const [activeSuperCategory, setActiveSuperCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<ServiceSub[]>([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  

  // Filter services based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  // Fetch super categories
  const fetchServiceSupers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      setServiceSupers(response.data.serviceSuper || []);
      if (response.data.serviceSuper?.length > 0) {
        setActiveSuperCategory(response.data.serviceSuper[0].id);
        fetchServicesBySuperCategory(response.data.serviceSuper[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch service supers:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch services by super category
  const fetchServicesBySuperCategory = async (superCategoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-out/${superCategoryId}/${branchId}`);
      setServices(response.data.service || []);
      setFilteredServices(response.data.service || []);
      setSelectedItems(Array(response.data.service?.length || 0).fill(false));
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sub-services
  const fetchSubServices = async (serviceId: number, serviceName: string, superCategory: string, superCategoryId: number) => {
    try {
      setSubServiceLoading(true);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-sub-out/${serviceId}/${branchId}`);
      
      if (response.data.servicesub && response.data.servicesub.length > 0) {
        setSubServices(response.data.servicesub);
        setShowSubServiceModal(true);
      } else {
        const superCategoryUrl = serviceSupers.find(cat => cat.id === superCategoryId)?.serviceSuper_url;
        navigate(`/pricing/${superCategoryUrl}/${superCategoryId}/${encodeURIComponent(serviceName)}/${serviceId}`, {
          state: {
            service_id: serviceId,
            service_name: serviceName
          }
        });
      }
    } catch (error) {
      console.error('Error fetching sub-services:', error);
      const superCategoryUrl = serviceSupers.find(cat => cat.id === superCategoryId)?.serviceSuper_url;
      navigate(`/pricing/${superCategoryUrl}/${superCategoryId}/${encodeURIComponent(serviceName)}/${serviceId}`, {
        state: {
          service_id: serviceId,
          service_name: serviceName
        }
      });
    } finally {
      setSubServiceLoading(false);
    }
  };

  const handleServiceClick = (service: Service) => {
    // setSelectedService(service);
    // fetchSubServices(service.id, service.service);
    setSelectedService(service);
    const superCategory = serviceSupers.find(superCat => superCat.id === activeSuperCategory);
    if (superCategory) {
        fetchSubServices(service.id, service.service, superCategory.serviceSuper, superCategory.id );
    }
  };

  const handleSuperCategoryClick = (superCategoryId: number) => {
    setActiveSuperCategory(superCategoryId);
    fetchServicesBySuperCategory(superCategoryId);
    setSearchQuery(''); 
  };

  const getImageUrl = (imageName: string | null, isSubService = false) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  const handleItemClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItems(prev => {
      const newSelected = [...prev];
      newSelected[index] = !newSelected[index];
      return newSelected;
    });
  };

  useEffect(() => {
    fetchServiceSupers();
  }, []);

 
  const categoryColors = [
    'bg-primary',
    'bg-info',
    'bg-purple',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-primary',
    'bg-info',
  ];

  if (loading && serviceSupers.length === 0) {
    return (
      <>
        <DefaultHelmet/>
      <HomeHeader  />
        <BreadCrumb title="Services" item1="Services" />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading services...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DefaultHelmet/>
           <HomeHeader  />
        <BreadCrumb title="Services" item1="Services" />
        <div className="d-flex justify-content-center align-items-center vh-50">
          <div className="alert alert-danger d-flex align-items-center mt-4" role="alert">
            <Icon.AlertCircle className="me-2" size={18} />
            <div>{error}</div>
            <button 
              className="btn btn-sm btn-outline-danger ms-3"
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
     <HomeHeader  />
      <BreadCrumb title="Services" item1="Services" />
      
      <div  >
        <div className="content">
          <div className="container-fluid px-lg-4 px-xl-5">


           
     {/* Super Categories Tabs + Search Bar */}
<div className="row mt-0">
  <div className="col-12">
    <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2 bg-white rounded shadow-sm p-2 mb-3">
      {/* Super Categories - Responsive Grid */}
      <div className="w-100 w-lg-auto flex-grow-1 mb-2 mb-lg-0">
        <div className="row g-1 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-8">
          {serviceSupers.map((superCat, index) => (
            <div key={superCat.id} className="col">
              <button
                className={`position-relative btn btn-sm w-100 super-category-btn ${
                  activeSuperCategory === superCat.id 
                    ? `${categoryColors[index % categoryColors.length]} text-white shadow-sm active`
                    : `btn-outline-light text-dark`
                }`}
                onClick={() => handleSuperCategoryClick(superCat.id)}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0.25rem 0.5rem'
                }}
              >
                <span className="d-inline-block text-truncate" style={{ maxWidth: '100%' }}>
                  {superCat.serviceSuper}
                </span>
                {activeSuperCategory === superCat.id && (
                  <span className="active-indicator"></span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="flex-shrink-0" style={{ minWidth: '200px', maxWidth: '280px', width: '100%' }}>
        <div className="input-group input-group-sm">
          <span className="input-group-text bg-transparent border-end-0">
            <Icon.Search className="text-secondary" size={16} />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-sm btn-outline-secondary border-start-0"
              onClick={() => setSearchQuery('')}
            >
              <Icon.X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
           
           

            {/* Services Count */}
            <div className="text-center mb-4">
              <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                Showing <span className="fw-medium text-primary">{filteredServices.length}</span> services
              </span>
            </div>

            {/* Services Grid */}
            {loading && filteredServices.length === 0 ? (
              <div className="row justify-content-center py-5">
                <div className="col-12 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading services...</p>
                </div>
              </div>
            ) : error && filteredServices.length === 0 ? (
              <div className="row justify-content-center py-5">
                <div className="col-12 col-md-8 col-lg-6 text-center">
                  <div className="alert alert-danger d-flex align-items-center justify-content-center">
                    <Icon.AlertCircle className="me-2" size={18} />
                    <span>{error}</span>
                    <button
                      className="btn btn-sm btn-outline-danger ms-3"
                      onClick={() => activeSuperCategory && fetchServicesBySuperCategory(activeSuperCategory)}
                    >
                      <Icon.RefreshCw className="me-1" size={14} />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="row justify-content-center py-5">
                <div className="col-12 text-center">
                  <div className="empty-state">
                  
                
                    <p className="text-muted mb-4">
                      {searchQuery 
                        ? `No results for "${searchQuery}"`
                        : "We couldn't find any services in this category."}
                    </p>
                    {searchQuery && (
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {filteredServices.map((service, index) => (
                  <div key={service.id} className="col-xl-3 col-lg-4 col-md-6">
                    <div 
                      className="card h-100 border-0 overflow-hidden position-relative"
                      onClick={() => handleServiceClick(service)}
                  
                      style={{
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.transform = '';
                      }}
                    >
                      <div className="position-relative" style={{ height: '160px' }}>
                        <img
                          src={getImageUrl(service.service_image)}
                          className="w-100 h-100"
                          loading="lazy"
  decoding="async"
                          alt={service.service}
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `${NO_IMAGE_URL}`;
                          }}
                        />
                       
                        {/* <button
                          type="button"
                          className={`btn position-absolute top-0 end-0 mt-2 me-2 ${
                            selectedItems[index] ? 'text-danger' : 'text-white'
                          }`}
                          onClick={(e) => handleItemClick(index, e)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0
                          }}
                        >
                          <Icon.Heart 
                            size={14} 
                            fill={selectedItems[index] ? 'currentColor' : 'none'} 
                          />
                        </button> */}
                      </div>
                      <div className="card-body p-3">
                        <h5 className="card-title mb-1 fs-15 fw-medium text-truncate">{service.service}</h5>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="small text-muted d-flex align-items-center">
                            <Icon.MapPin className="me-1" size={12} />
                            <span>{city}</span>
                          </span>
                          {/* <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '0.75rem' }}>
                            <Icon.Star className="me-1" size={10} fill="#fd7e14" />
                            4.5
                          </span> */}
                          <button 
 className='book-now-btn'
  onClick={() => handleServiceClick(service)} 
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
      </div>

      {/* Sub-Service Modal - Converted to Bootstrap */}
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
              {/* Modal Header - Pink Theme */}
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
                  onClick={() => setShowSubServiceModal(false)}
                  aria-label="Close"
                />
              </div>

              {/* Modal Body - Bootstrap Version */}
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
                          // onClick={() => navigate(`/pricing/${selectedService?.service}/${subService.service_sub}`, {
                          //   state: {
                          //     service_id: selectedService?.id,
                          //     service_name: selectedService?.service,
                          //     service_sub_id: subService.id,
                          //     service_sub_name: subService.service_sub
                          //   }
                          // })}
                          onClick={() => {
                            const superCategory = serviceSupers.find(superCat => superCat.id === activeSuperCategory);
                            if (superCategory) {
                                navigate(`/pricing/${superCategory.serviceSuper_url}/${superCategory.id}/${selectedService?.service}/${selectedService?.id}/${encodeURIComponent(subService.service_sub)}/${subService?.id}`, {
                                    state: {
                                        service_id: selectedService?.id,
                                        service_name: selectedService?.service,
                                        service_sub_id: subService.id,
                                        service_sub_name: subService.service_sub
                                    }
                                });
                            }
                        }}
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
                              loading="lazy"
  decoding="async"
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
  );
};

export default ServiceGrid;