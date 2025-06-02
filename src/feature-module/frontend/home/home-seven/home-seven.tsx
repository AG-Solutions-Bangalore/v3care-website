import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import * as Icon from 'react-feather';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
// import FooterSeven from './footer-seven';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import HomeHeader from '../header/home-header';
import axios from 'axios';
import {BASE_URL, BLOG_IMAGE_URL, CLIENT_IMAGE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL, SERVICE_SUPER_IMAGE_URL, TESTIMONIAL_IMAGE_URL} from '../../../baseConfig/BaseUrl';
import { blogCardData } from '../../../../core/data/json/blog_card';
interface ServiceSuper {
  id: number;
  serviceSuper: string;
  serviceSuper_image: string | null;
}
interface Testimonial {
  testimonial_description: string;
  testimonial_user: string;
  testimonial_image: string;
}
interface Client {
  client_name: string;
  client_image: string;
}
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
const HomeSeven = () => {
  const routes = all_routes;
  const navigate =useNavigate()
  const branchId = localStorage.getItem("branch_id")
  const [serviceSupers, setServiceSupers] = useState<ServiceSuper[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testimonialsError, setTestimonialsError] = useState<string | null>(
    null,
  );
  const [clients, setClients] = useState<Client[]>([]);
    const [isLoadingClient, setIsLoadingClient] = useState(true);
    const [errorClient, setErrorClient] = useState<string | null>(null);

    const [services, setServices] = useState<Service[]>([]);
    const [servicesTwo, setServicesTwo] = useState<Service[]>([]);
const [isServicesLoading, setIsServicesLoading] = useState(true);
const [servicesError, setServicesError] = useState<string | null>(null);
const [selectedService, setSelectedService] = useState<Service | null>(null);
const [subServices, setSubServices] = useState<ServiceSub[]>([]);
const [showSubServiceModal, setShowSubServiceModal] = useState(false);
const [subServiceLoading, setSubServiceLoading] = useState(false);


  AOS.init();

  const fetchServices = async () => {
    try {
      setIsServicesLoading(true);
      setServicesError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-all-out`);
      // Filter services where service_show_website includes "1"
      const filteredServices = response.data.service.filter((service: Service) => 
        service.service_show_website.includes("1")
      );
      const filteredServicesTwo = response.data.service.filter((service: Service) => 
        service.service_show_website.includes("2")
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

  const fetchServiceSupers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-web-service-super-out`,
      );
      setServiceSupers(response.data.serviceSuper || []);
    } catch (error) {
      console.error('Failed to fetch service supers:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setIsTestimonialsLoading(true);
      setTestimonialsError(null);
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-web-testimonial-out`,
      );
      setTestimonials(response.data.testimonial || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      setTestimonialsError('Failed to load testimonials. Please try again.');
    } finally {
      setIsTestimonialsLoading(false);
    }
  };
  const fetchClients = async () => {
    try {
      setIsLoadingClient(true);
      setErrorClient(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-clients-out`);
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setErrorClient('Failed to load partners. Please try again.');
    } finally {
      setIsLoadingClient(false);
    }
  };

  const getClientImageUrl = (imageName: string) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return `${CLIENT_IMAGE_URL}/${imageName}`;
  };
  const getImageUrl = (serviceSuper_image: string | null) => {
    if (!serviceSuper_image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${SERVICE_SUPER_IMAGE_URL}/${serviceSuper_image}`;
  };
  const getTestimonialImageUrl = (testimonial_image: string) => {
    if (!testimonial_image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${TESTIMONIAL_IMAGE_URL}/${testimonial_image}`;
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
    AOS.init({
      duration: 1000,
    });
    fetchServiceSupers();
    fetchTestimonials();
    fetchClients();
    fetchClients();
    fetchServices();
  }, []);

  const handleScroll = () => {
    AOS.refresh();
  };
  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    fetchSubServices(service.id, service.service);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const categoriesSuperSlider = {
    dots: true,
    autoplay: false,
    arrows: false,
    slidesToShow: 4,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
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
  

  const testimonialSlider = {
    dots: true,
    autoplay: true,
    slidesToShow: 1,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          autoplay: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          autoplay: true,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 1,
          dots: false,
          autoplay: true,
          arrows: false,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          dots: false,
          autoplay: true,
          arrows: false,
        },
      },
    ],
  };
  const recentBlog = {
    dots: true,
    autoplay: false,
    slidesToShow: 3,
    arrows: false,
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
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const partnersSlider = {
    autoplay: true,
    slidesToShow: 5,
    speed: 500,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
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
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  return (
    <>
      <HomeHeader  />
      <div className="home-seven-wrapper">
        {/* Hero Section */}
        <section className="hero-section-seven">
          <div className="hero-sectionseven-top pt-5 pt-lg-0 pb-5 pb-lg-0">
            <div className="container">
              <div className="home-banner homer-banner-seven">
                <div className="row align-items-center w-100">
                  <div className="col-lg-6 col-12">
                    <div className="section-search aos" data-aos="fade-up">
                      <p>Search From 150 Awesome Verified Ads!</p>
                      <h1>
                        Best Solution for Every
                        <span>House Problems</span>
                      </h1>
                      <div className="solution-seven">
                        <h6>2M+ Professionals registered</h6>
                        <ul className="total-client-avatar total-client-avatar-seven d-flex align-items-center mt-2">
  <li>
    <Link to="#">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#FF6B6B" />
        <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </Link>
  </li>
  <li>
    <Link to="#">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#4CAF50" />
        <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </Link>
  </li>
  <li>
    <Link to="#">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#2196F3" />
        <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </Link>
  </li>
  <li>
    <Link to="#">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#FFC107" />
        <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </Link>
  </li>
  <li>
    <Link to="#">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#9C27B0" />
        <path fill="#fff" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </Link>
  </li>
</ul>

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="hero-banner-ryt">
                      <ImageWithBasePath
                        src="assets/img/hero-section-seven-ryt.png"
                        alt="image"
                        className="img-fluid"
                      />
                      <div className="hero-banner-ryt-content">
                        <div className="hero-banner-ryt-top">
                          <h5>+21 k</h5>
                          <p>Services Completed</p>
                        </div>
                        <span>
                        <svg
  xmlns="http://www.w3.org/2000/svg"
  width="40"
  height="40"
  viewBox="0 0 24 24"
>

  <path
    fill="#9370DB"
    d="M6 7V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2zm2 0h8V6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v1z"
  />
  

  <path
    fill="#FFFFFF"
    d="M5 9h14v1H5V9zm0 3h14v1H5v-1zm0 3h14v1H5v-1z"
  />
</svg>


                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Hero Section */}
        {/* Service Section */}
        <section className="service-section-seven">
        
          <div className="container">
            <div className="section-heading section-heading-seven">
              <div className="row">
                <div className="col-md-6 aos" data-aos="fade-up">
                  <h2>Featured Categories</h2>
                  <p>What do you need to find?</p>
                </div>
                <div className="col-md-6 text-md-end aos" data-aos="fade-up">
                  <div className="owl-nav mynav mynav-seven" />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="row justify-content-center mb-5">
                <div className="col-12 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading categories...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 col-lg-6 text-center">
                  <div className="alert alert-danger d-flex align-items-center justify-content-center">
                    <Icon.AlertCircle className="me-2" size={18} />
                    <span>{error}</span>
                    <button
                      className="btn btn-sm btn-outline-danger ms-3"
                      onClick={fetchServiceSupers}
                    >
                      <Icon.RefreshCw className="me-1" size={14} />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Slider */}
            {!isLoading && !error && serviceSupers.length > 0 && (
              <div className="row">
                <div className="col-md-12">
                  <Slider
                    {...categoriesSuperSlider}
                    className="owl-carousel categories-slider-seven"
                  >
                    {serviceSupers.map((serviceSuper) => (
                      <Link
                        key={serviceSuper.id}
                        to={`${routes.categories}/${encodeURIComponent(serviceSuper.serviceSuper)}/${serviceSuper.id}`}
                        className="feature-box feature-box-seven aos"
                        data-aos="fade-up"
                      >
                        <div className="feature-icon feature-icon-seven">
                          <span>
                            <img
                              src={getImageUrl(serviceSuper.serviceSuper_image)}
                              alt={serviceSuper.serviceSuper}
                              className="img-fluid"
                            />
                          </span>
                        </div>
                        <h5>{serviceSuper.serviceSuper}</h5>
                      </Link>
                    ))}
                  </Slider>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* /Service Section */}
      
<section className="popular-service-seven-section">
  <div className="container">
    <div className="row">
      <div className="col-md-12 text-center">
        <div
          className="section-heading section-heading-seven aos"
          data-aos="fade-up"
        >
          <h2>Most Popular Services</h2>
          <p>What do you need to find?</p>
        </div>
      </div>
    </div>

    {/* Loading State */}
    {isServicesLoading && (
      <div className="row justify-content-center mb-5">
        <div className="col-12 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading services...</p>
        </div>
      </div>
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
                className="service-widget service-two service-seven aos "
                data-aos="fade-up"
                onClick={() => handleServiceClick(service)}
              
              >
                <div className="service-img" >
                  <img
                    className="img-fluid serv-img"
                    alt="Service Image"
                    src={getImageUrlService(service.service_image)}
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

        
     
        {/* New Banner Section */}
        <section
          className="popular-service-seven-section aos"
          data-aos="fade-up"
        >
          <div className="container">
            <div>
              <img
                src="assets/img/services/22.png"
                alt="Promotional Banner"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'fill',
                  objectPosition: 'center',
                  borderRadius: '0.5rem',
                }}
              />
            </div>
          </div>
        </section>

       
       
      
        {/* Testimonials Section */}
        <section className="testimonals-seven-section pt-5">
          <div className="container">
            <div className="section-heading section-heading-seven">
              <div className="row">
                <div className="col-md-6 aos" data-aos="fade-up">
                  <h2>Top Testimonials</h2>
                  <p>
                    Description highlights the value of client feedback,
                    showcases real testimonials
                  </p>
                </div>
                <div className="col-md-6 text-md-end aos" data-aos="fade-up">
                  <div className="owl-nav mynav-test" />
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-lg-6 col-12">
                <div className="testimonals-top-seven">
                  <ImageWithBasePath
                    src="assets/img/testimonials-seven.png"
                    alt="image"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-12">
               {/* Testimonials Loading State */}
               {isTestimonialsLoading && (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading testimonials...</p>
                </div>
              )}
              
              {/* Testimonials Error State */}
              {testimonialsError && !isTestimonialsLoading && (
                <div className="alert alert-danger d-flex align-items-center justify-content-center">
                  <Icon.AlertCircle className="me-2" size={18} />
                  <span>{testimonialsError}</span>
                  <button 
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={fetchTestimonials}
                  >
                    <Icon.RefreshCw className="me-1" size={14} />
                    Try Again
                  </button>
                </div>
              )}
              
              {/* Testimonials Slider */}
              {!isTestimonialsLoading && !testimonialsError && testimonials.length > 0 && (
                <Slider {...testimonialSlider} className="testimonals-seven-slider">
                  {testimonials.map((testimonial, index) => (
                    <div className="testimonials-main-ryt" key={index}>
                      <div className="testimonials-content-seven">
                        <div className="testimonials-seven-img">
                          <img
                            src={getTestimonialImageUrl(testimonial.testimonial_image)}
                            alt={testimonial.testimonial_user}
                            className="img-fluid"
                          />
                          <div className="testimonials-img-content">
                            <h6>{testimonial.testimonial_user}</h6>
                            <div className="rating">
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                            </div>
                          </div>
                        </div>
                        <img
                          src="assets/img/icons/test-quote.svg" 
                          alt="quote"
                          className="img-fluid"
                        />
                      </div>
                      <p>{testimonial.testimonial_description}</p>
                    </div>
                  ))}
                </Slider>
              )}
              </div>
            </div>
          </div>
        </section>
        {/* /Testimonials Section */}
        {/* pricing Section */}
        <section className="price-sections-seven  blog-sec-seven">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <div
                  className="section-heading section-heading-seven aos"
                  data-aos="fade-up"
                >
                  <h2>Our Recent Blog</h2>
                  <p>
                    Here’s a compelling blog description designed to attract
                    readers and provide a clear idea of what they can expect
                    from your blog:
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Slider {...recentBlog} className="our-recent-blog">
                 


                {
                 blogCardData.slice(0, 6).map((blog)=>(
  <div
                  className="col-xl-4 col-md-6"
                  key={blog.id}
                  data-aos="fade-up"
                >
                  <div className="card p-0">
                    <div className="card-body p-0">
                      <div className="img-sec w-100">
                        <Link to={`${routes.blogDetails}/${blog.id}`}>
                          <img
                            src={`${BLOG_IMAGE_URL}/${blog.img}`}
                            className="img-fluid rounded-top w-100"
                            alt="img"
                          />
                        </Link>
                      </div>
                      <div className="p-3">
                        <div className="d-flex align-items-center mb-3">
                          <div className="d-flex align-items-center border-end pe-2">
                            <span className="avatar avatar-sm me-2">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-55.jpg"
                                className="rounded-circle"
                                alt="user"
                              />
                            </span>
                            <h6 className="fs-14 text-gray-6">
                              V3 Care
                            </h6>
                          </div>
                          <div className="d-flex align-items-center ps-2">
                            <span>
                              <i className="ti ti-calendar me-2" />
                            </span>
                            <span className="fs-14">{blog.date}</span>
                          </div>
                        </div>
                        <div>
                          <h5
                            className="fs-16 mb-1 text-wrap"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '3em',
                            }}
                          >
                            <Link to={`${routes.blogDetails}/${blog.id}`}>
                              {blog.title}
                            </Link>
                          </h5>
                        
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                 )) 
                }


                </Slider>
              </div>
            </div>
          </div>
        </section>
     
      
        {/* Partners Section */}
<section className="our-partners-seven">
  <div className="container">
    <div className="row">
      <div className="col-md-12 text-center">
        <div
          className="section-heading section-heading-seven aos"
          data-aos="fade-up"
        >
          <h2>Our Clients</h2>
          <p>
            We are proud to partner with industry leaders and trusted brands
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingClient && (
        <div className="col-12 text-center mb-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading partners...</p>
        </div>
      )}

      {/* Error State */}
      {errorClient && !isLoadingClient && (
        <div className="col-12 text-center mb-5">
          <div className="alert alert-danger d-flex align-items-center justify-content-center">
            <Icon.AlertCircle className="me-2" size={18} />
            <span>{errorClient}</span>
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchClients}
            >
              <Icon.RefreshCw className="me-1" size={14} />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Partners Slider */}
      {!isLoadingClient && !errorClient && clients.length > 0 && (
        <Slider {...partnersSlider} className="partners-slider-seven aos">
          {clients.map((client, index) => (
            <div  key={index}>
              <img
                src={getClientImageUrl(client.client_image)}
                alt={client.client_name}
                className="img-fluid"
                style={{ maxHeight: '100px', objectFit: 'contain' }}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  </div>
</section>
        {/* Partners Section */}
      </div>
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
          background: '#6366f1',
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
              backgroundColor: '#6366f1',
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
      {/* <FooterSeven /> */}
    </>
  );
};

export default HomeSeven;
