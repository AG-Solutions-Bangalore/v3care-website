import React, { useEffect, useMemo, useState } from 'react';
import {  useParams, useNavigate, Link,useLocation } from 'react-router-dom';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import axios from 'axios';
import * as Icon from 'react-feather';
import {BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL, SERVICE_SUPER_IMAGE_URL} from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';
import { Helmet } from 'react-helmet-async';
import './Categories.css';
import '../../home/home-seven/PopularService.css'
import { decryptId, encryptId } from '../../../../core/encyrption/Encyrption';
import './ServiceGrid.css'
interface Service {
  id: number;
  service: string;
  service_image: string | null;
  serviceSuper: string;
}

interface ServiceSub {
  id: number;
  service_sub: string;
  service_sub_image: string | null;
}
interface Category {
  id: number;
  name: string;
  image: string | null;
  url: string ;
}
const Categories = () => {
  const { id, category_name } = useParams<{ id?: string, category_name?: string }>();
  const decryptedId = useMemo(() => {
    return id ? decryptId(id) : null; 
  }, [id]);
 const location = useLocation();
  const branchId = localStorage.getItem("branch_id")
  const city = localStorage.getItem("city")
  /* category start */
   const [categories, setCategories] = useState<Category[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [errorCategory, setErrorCategory] = useState<string | null>(null);
  /* category end */
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<ServiceSub[]>([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  const [serviceSuper, setServiceSuper] = useState<any>(null);
  const navigate = useNavigate();

  
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      setCategories(response.data.serviceSuper?.map((item: any) => ({
        id: item.id,
        name: item.serviceSuper,
        image: item.serviceSuper_image,
        url: item.serviceSuper_url
      })) || []);
    } catch (error) {
      console.error('Failed to fetch  categories:', error);
      setError('Failed to load  categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = id 
        ? `${BASE_URL}/api/panel-fetch-web-service-out/${decryptedId}/${branchId}`
        : `${BASE_URL}/api/panel-fetch-web-service-out/2/2`;
      
      const response = await axios.get<{
        serviceSuper: null; service: Service[] 
      }>(url);
      setServices(response.data.service || []);
      setServiceSuper(response.data.serviceSuper || null);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubServices = async (serviceId: number, serviceName: string) => {
    try {
      setSubServiceLoading(true);
      const response = await axios.get<{ servicesub: ServiceSub[] }>(
        `${BASE_URL}/api/panel-fetch-web-service-sub-out/${serviceId}/${branchId}`
      );
      
      if (response.data.servicesub && response.data.servicesub.length > 0) {
        setSubServices(response.data.servicesub);
        setShowSubServiceModal(true);
      } else {
        navigate(`/pricing/${category_name}/${decryptedId}/${encodeURIComponent(serviceName)}/${serviceId}`, {
          state: {
            service_id: serviceId,
            service_name: serviceName
          }
        });
      }
    } catch (error) {
      console.error('Error fetching sub-services:', error);
      navigate(`/pricing/${category_name}/${decryptedId}/${encodeURIComponent(serviceName)}/${serviceId}`, {
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
    setSelectedService(service);
    fetchSubServices(service.id, service.service);
  };

  const getImageUrl = (imageName: string | null, isSubService = false) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  const getImageUrlCategory = (image: string | null) => {
    if (!image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${SERVICE_SUPER_IMAGE_URL}/${image}`;
  };
 useEffect(() => {
      fetchCategories();
    }, []);
  useEffect(() => {
    fetchServices();
  }, [id]);

  const SkeletonLoader = () => {
    return (
      <div className="categories-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="categories-card skeleton">
            <div className="categories-card-image shimmer"></div>
            <div className="categories-card-content">
              <div className="categories-card-title shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <>
        <HomeHeader />
 
        <div className="categories-error-container">
          <div className="categories-error-content">
            <i className="ri-error-warning-line categories-error-icon"></i>
            <div className="categories-error-message">{error}</div>
            <button 
              className="categories-error-button"
              onClick={fetchServices}
            >
              <i className="ri-loop-right-line me-1"></i>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (services.length === 0 && !loading) {
    return (
      <>
        <Helmet>
          <title>
            {serviceSuper?.serviceSuper && serviceSuper?.serviceSuper !== "null"
              ? serviceSuper.serviceSuper
              : "Best house cleaning service | V3 Care"}
          </title>
          {(serviceSuper?.serviceSuper_meta_title &&
            serviceSuper?.serviceSuper_meta_title !== "null") && (
            <meta name="title" content={serviceSuper.serviceSuper_meta_title} />
          )}
          {(serviceSuper?.serviceSuper_meta_description &&
            serviceSuper?.serviceSuper_meta_description !== "null") && (
            <meta name="description" content={serviceSuper.serviceSuper_meta_description} />
          )}
          {(serviceSuper?.serviceSuper_keywords &&
            serviceSuper?.serviceSuper_keywords !== "null") && (
            <meta name="keywords" content={serviceSuper.serviceSuper_keywords} />
          )}
          {(serviceSuper?.serviceSuper_meta_tags &&
            serviceSuper?.serviceSuper_meta_tags !== "null") && (
            <meta name="tags" content={serviceSuper.serviceSuper_meta_tags} />
          )}
        </Helmet>
        <HomeHeader />
        <div className="categories-container">
          <div className="categories-content">
            <div className="categories-header">
              <div className="categories-title-wrapper">
                <h2 className="categories-main-title">{serviceSuper?.serviceSuper || "Our Services"}</h2>
                <p className="categories-subtitle">Choose from our wide range of professional services</p>
              </div>
              <div className="categories-nav-and-list">
                <div className="categories-nav">
                  <button className="categories-nav-button" onClick={() => {
                    const container = document.querySelector('.categories-list');
                    if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                  }}>
                    <Icon.ChevronLeft size={16} />
                  </button>
                  <button className="categories-nav-button" onClick={() => {
                    const container = document.querySelector('.categories-list');
                    if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                  }}>
                    <Icon.ChevronRight size={16} />
                  </button>
                </div>
                <div className="categories-list">


                  {categories.map((category) => (
                    <Link 
                      key={category.id}
                      to={`/${encodeURIComponent(category.url)}/${encryptId(category.id)}`}
                      className="category-item"
                    >
                      <div className="category-card">
                        <img
                          src={getImageUrlCategory(category.image)}
                          alt={category.name}
                          className="category-image"
                          // loading="lazy"
                          // decoding="async"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `${NO_IMAGE_URL}`;
                          }}
                        />
                        <span className="category-name">{category.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="categories-empty-container">
              <div className="categories-empty-content">
                <img
                  src={`${NO_IMAGE_URL}`}
                  alt="No services found"
                  // loading="lazy"
                  // decoding="async"
                  className="categories-empty-image"
                />
                <h4 className="categories-empty-title">No services found</h4>
                <p className="categories-empty-text">We couldn not find any services matching your criteria.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {serviceSuper?.serviceSuper && serviceSuper?.serviceSuper !== "null"
            ? serviceSuper.serviceSuper
            : "Best house cleaning service | V3 Care"}
        </title>
        {(serviceSuper?.serviceSuper_meta_title &&
          serviceSuper?.serviceSuper_meta_title !== "null") && (
          <meta name="title" content={serviceSuper.serviceSuper_meta_title} />
        )}
        {(serviceSuper?.serviceSuper_meta_description &&
          serviceSuper?.serviceSuper_meta_description !== "null") && (
          <meta name="description" content={serviceSuper.serviceSuper_meta_description} />
        )}
        {(serviceSuper?.serviceSuper_keywords &&
          serviceSuper?.serviceSuper_keywords !== "null") && (
          <meta name="keywords" content={serviceSuper.serviceSuper_keywords} />
        )}
        {(serviceSuper?.serviceSuper_meta_tags &&
          serviceSuper?.serviceSuper_meta_tags !== "null") && (
          <meta name="tags" content={serviceSuper.serviceSuper_meta_tags} />
        )}
      </Helmet>

      <HomeHeader />
    
      
      <div className="categories-container">
        <div className="categories-content">
        <div className="categories-header">
  <div className="categories-title-wrapper">
    <h2 className="categories-main-title">{serviceSuper?.serviceSuper || "Our Services"}</h2>
    <p className="categories-subtitle">Choose from our wide range of professional services</p>
  </div>
  {/*<div className="categories-nav-and-list">
    <div className="categories-nav">
      <button className="categories-nav-button" onClick={() => {
        const container = document.querySelector('.categories-list');
        if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
      }}>
        <Icon.ChevronLeft size={16} />
      </button>
      <button className="categories-nav-button" onClick={() => {
        const container = document.querySelector('.categories-list');
        if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
      }}>
        <Icon.ChevronRight size={16} />
      </button>
    </div>
    <div className="categories-list">
      {categories.map((category) => (
        <Link 
          key={category.id}
          to={`/${encodeURIComponent(category.url)}/${encryptId(category.id)}`}
          className="category-item"
        >
          <div className="category-card">
            <img
              src={getImageUrlCategory(category.image)}
              alt={category.name}
              className="category-image"
              // loading="lazy"
              // decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `${NO_IMAGE_URL}`;
              }}
            />
            <span className="category-name">{category.name}</span>
            
          </div>
        </Link>
      ))}


    </div>
  </div>*/}
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
    {categories.map((category) => (
      <div 
        key={category.id}
        className={`service-grid-category-item ${decryptedId === category.id.toString() ? 'active' : ''}`}
      >
        <Link 
          to={`/${encodeURIComponent(category.url)}/${encryptId(category.id)}`}
          className="service-grid-category-card"
        >
          <img
            src={getImageUrlCategory(category.image)}
            alt={category.name}
            className="service-grid-category-image"
            // loading="lazy"
            // decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `${NO_IMAGE_URL}`;
            }}
          />
          <span className="service-grid-category-name">{category.name}</span>
        </Link>
      </div>
    ))}
  </div>
</div>




</div>
          
        {/*  {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="categories-grid">
              {services.map((service: Service) => (
                <div 
                  key={service.id} 
               className="popular-service-home-card featured-card"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="popular-service-home-card-image">
                    <img
                      src={getImageUrl(service.service_image)}
                     
                      alt={service.service}
                      // loading="lazy"
                      // decoding="async"
                    />
                  </div>
                  <div className="popular-service-home-card-overlay"></div>
                    <div className="popular-service-home-card-badge">
                      {service.service}
                    </div>
                </div>
              ))}
              {services.map((service: Service) => (
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
                 //                         loading="lazy"
                 // decoding="async"
                                         alt={service.service}
                                         style={{ objectFit: 'cover' }}
                                         onError={(e) => {
                                           const target = e.target as HTMLImageElement;
                                           target.src = `${NO_IMAGE_URL}`;
                                         }}
                                       />
                                      
                                     
                                     </div>
                                     <div className="card-body p-3">
                                       <h5 className="card-title mb-1 fs-15 fw-medium text-truncate">{service.service}</h5>
                                       <div className="d-flex justify-content-between align-items-center mt-2">
                                         <span className="small text-muted d-flex align-items-center">
                                           <Icon.MapPin className="me-1" size={12} />
                                           <span>{city}</span>
                                         </span>
                                       
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
          )}*/}

{loading ? (
  <SkeletonLoader />
) : (
  <div className="categories-grid">
              {services.map((service) => (
                <div key={service.id} className="categories-card-wrapper">
                  <div 
                    className="categories-card"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="categories-card-image-container">
                      <img
                        src={getImageUrl(service.service_image)}
                        className="categories-card-image"
                        // loading="lazy"
                        // decoding="async"
                        alt={service.service}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `${NO_IMAGE_URL}`;
                        }}
                      />
                    </div>
                    <div className="categories-card-content">
                      <h5 className="categories-card-title">{service.service}</h5>
                      <div className="categories-card-footer">
                        <span className="categories-card-city">
                          <Icon.MapPin className="categories-card-icon" size={12} />
                          <span>{city}</span>
                        </span>
                        <button 
                          className="categories-book-now-btn"
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
                      style={{ color: '#ec4899' }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row g-2">
                    {subServices.map((subService) => (
                      <div key={subService.id} className="col-6 col-sm-4 col-md-3" >
                        <div 
                          className="card h-100 border-0 overflow-hidden transition-all position-relative"
                          onClick={() => navigate(`/pricing/${category_name}/${decryptedId}/${selectedService?.service}/${selectedService?.id}/${subService.service_sub}/${subService?.id}`, {
                            state: {
                              service_id: selectedService?.id,
                              service_name: selectedService?.service,
                              service_sub_id: subService.id,
                              service_sub_name: subService.service_sub
                            }
                          })}
                          // onClick={() => {
                          //   if (selectedService) {
                          //     navigate(`/pricing/${category_name}/${id}/${selectedService.service}/${encryptId(selectedService.id)}/${subService.service_sub}/${encryptId(subService.id)}`, {
                          //       state: {
                          //         service_id: selectedService.id,
                          //         service_name: selectedService.service,
                          //         service_sub_id: subService.id,
                          //         service_sub_name: subService.service_sub
                          //       }
                          //     });
                          //   }
                          // }}
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
                          <div className="ratio ratio-1x1" style={{ backgroundColor: '#fdf2f8', }}>
                          <img
                              src={getImageUrl(subService.service_sub_image, true)}
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

export default Categories;



//sajid d