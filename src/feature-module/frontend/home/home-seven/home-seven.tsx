import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import * as Icon from 'react-feather';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import FooterSeven from './footer-seven';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import HomeHeader from '../header/home-header';
import axios from 'axios';
import BASE_URL from '../../../baseConfig/BaseUrl';
import BASE_URL_IMAGE from '../../../baseConfig/BaseUrl';
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

const HomeSeven = () => {
  const routes = all_routes;
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
  AOS.init();

   
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
      return "http://agscare.site/crmapi/public/storage/no_image.jpg";
    }
    return `http://agscare.site/crmapi/public/storage/clients/${imageName}`;
  };
  const getImageUrl = (serviceSuper_image: string | null) => {
    if (!serviceSuper_image) {
      return `http://agscare.site/crmapi/public/storage/no_image.jpg`;
    }
    return `http://agscare.site/crmapi/public/storage/service_super/${serviceSuper_image}`;
  };
  const getTestimonialImageUrl = (testimonial_image: string) => {
    if (!testimonial_image) {
      return 'http://agscare.site/crmapi/public/storage/no_image.jpg';
    }
    return `http://agscare.site/crmapi/public/storage/testimonial/${testimonial_image}`;
  };
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
    fetchServiceSupers();
    fetchTestimonials();
    fetchClients();
  }, []);

  const handleScroll = () => {
    AOS.refresh();
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
        },
      },
    ],
  };
  const categoriesSlider = {
    dots: true,
    autoplay: false,
    slidesToShow: 5,
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
        },
      },
    ],
  };
  const popularService = {
    dots: true,
    autoplay: true,
    arrows: false,
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
  const recentProject = {
    dots: true,
    autoplay: false,
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
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      <HomeHeader type={8} />
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
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-06.jpg"
                                alt="User"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-07.jpg"
                                alt="image"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-08.jpg"
                                alt="image"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-09.jpg"
                                alt="User"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-10.jpg"
                                alt="User"
                              />
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
                          <ImageWithBasePath
                            src="assets/img/icons/suitcase.svg"
                            alt="image"
                          />
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
          <div className="search-box-two search-box-seven">
            <form action={routes.search}>
              <div className="search-input-new line">
                <i className="fas fa-tv bficon" />
                <div className="form-group mb-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What are you looking for?"
                  />
                </div>
              </div>
              <div className="search-input-new">
                <i className="fas fa-location-arrow bficon" />
                <div className="form-group mb-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Location"
                  />
                  <Link className="current-loc-icon current_location" to="#" />
                </div>
              </div>
              <div className="search-btn">
                <button className="btn btn-primary rounded-pill" type="submit">
                  <i className="feather icon-search" /> Search
                </button>
              </div>
            </form>
          </div>
          <div className="popularsearch-top">
            <h6>Popular Searches</h6>
            <ul>
              <li>
                <Link to={routes.search}>Electrical Works</Link>
              </li>
              <li>
                <Link to={routes.search}>Cleaning</Link>
              </li>
              <li>
                <Link to={routes.search}>AC Repair</Link>
              </li>
            </ul>
          </div>
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
                        to={`${routes.categories}/${serviceSuper.id}`}
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
        {/* popular service */}
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
            <div className="row">
              <div className="col-md-12">
                <Slider {...popularService} className="popular-service-seven">
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/f1.png"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Glass Fitting</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-01.jpg"
                              className="avatar"
                              alt="image"
                            />
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Toughened Glass Fitting Service
                        </Link>
                      </h3>
                      {/* <p>
                        <span className="rate">
                          <i className="feather icon-phone" />
                          28-62-76-32
                        </span>
                        <i className="feather icon-map-pin me-2" />
                        New Jersey, USA
                      </p> */}
                      {/* <div className="serv-info">
                        <div className="rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <span>(234)</span>
                        </div>
                        <h6>$25.00</h6>
                      </div> */}
                    </div>
                  </div>
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/f2.png"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Car Repair</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-06.jpg"
                              className="avatar"
                              alt="image"
                            />
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Car Repair Service
                        </Link>
                      </h3>
                      {/* <p>
                        <span className="rate">
                          <i className="feather icon-phone" />
                          28-62-76-32
                        </span>
                        <i className="feather icon-map-pin me-2" />
                        New Jersey, USA
                      </p>
                      <div className="serv-info">
                        <div className="rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <span>(234)</span>
                        </div>
                        <h6>$25.00</h6>
                      </div> */}
                    </div>
                  </div>
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/f3.png"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Computer Repair</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-11.jpg"
                              className="avatar"
                              alt="image"
                            />
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Computer Repairing &amp; Spares
                        </Link>
                      </h3>
                   
                    </div>
                  </div>
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/f4.png"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Car Repair</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-06.jpg"
                              className="avatar"
                              alt="image"
                            />
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Car Repair Service
                        </Link>
                      </h3>
                      {/* <p>
                        <span className="rate">
                          <i className="feather icon-phone" />
                          28-62-76-32
                        </span>
                        <i className="feather icon-map-pin me-2" />
                        New Jersey, USA
                      </p>
                      <div className="serv-info">
                        <div className="rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <span>(234)</span>
                        </div>
                        <h6>$86.00</h6>
                      </div> */}
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </section>

        <section className="service-section-seven">
          <div className="container">
            <div className="section-heading section-heading-seven">
              <div className="row">
                <div className="col-md-6 aos" data-aos="fade-up">
                  <h2>Popular Services</h2>
                  <p>What do you need to find?</p>
                </div>
                <div className="col-md-6 text-md-end aos" data-aos="fade-up">
                  <div className="owl-nav mynav mynav-seven" />
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <Slider
                {...categoriesSlider}
                className="owl-carousel categories-slider-seven"
              >
                <Link to={routes.categories} data-aos="fade-up">
                  <div
                    style={{
                      padding: '2px',
                      background: 'white',
                      border: '2px solid white',
                      // height: "250px",
                      borderRadius: '0.5rem', // Tailwind's rounded-lg = 0.5rem = 8px
                      // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Tailwind's shadow-md
                    }}
                  >
                    <img
                      src="assets/img/services/221.jpeg"
                      alt="img"
                      className="img-fluid"
                      style={{
                        // height: "210px",
                        borderRadius: '0.5rem', // Optional: if you want the image corners rounded too
                      }}
                    />
                    <h5
                      style={{
                        marginTop: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      Painting
                    </h5>
                  </div>
                </Link>
                <Link to={routes.categories} data-aos="fade-up">
                  <div
                    style={{
                      padding: '2px',
                      background: 'white',
                      border: '2px solid white',
                      // height: "250px",
                      borderRadius: '0.5rem', // Tailwind's rounded-lg = 0.5rem = 8px
                      // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Tailwind's shadow-md
                    }}
                  >
                    <img
                      src="assets/img/services/221.jpeg"
                      alt="img"
                      className="img-fluid"
                      style={{
                        // height: "210px",
                        borderRadius: '0.5rem', // Optional: if you want the image corners rounded too
                      }}
                    />
                    <h5
                      style={{
                        marginTop: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      Construction
                    </h5>
                  </div>
                </Link>
                <Link to={routes.categories} data-aos="fade-up">
                  <div
                    style={{
                      padding: '2px',
                      background: 'white',
                      border: '2px solid white',
                      // height: "250px",
                      borderRadius: '0.5rem', // Tailwind's rounded-lg = 0.5rem = 8px
                      // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Tailwind's shadow-md
                    }}
                  >
                    <img
                      src="assets/img/services/221.jpeg"
                      alt="img"
                      className="img-fluid"
                      style={{
                        // height: "210px",
                        borderRadius: '0.5rem', // Optional: if you want the image corners rounded too
                      }}
                    />
                    <h5
                      style={{
                        marginTop: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      Computer
                    </h5>
                  </div>
                </Link>
                <Link to={routes.categories} data-aos="fade-up">
                  <div
                    style={{
                      padding: '2px',
                      background: 'white',
                      border: '2px solid white',
                      // height: "250px",
                      borderRadius: '0.5rem', // Tailwind's rounded-lg = 0.5rem = 8px
                      // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Tailwind's shadow-md
                    }}
                  >
                    <img
                      src="assets/img/services/221.jpeg"
                      alt="img"
                      className="img-fluid"
                      style={{
                        // height: "210px",
                        borderRadius: '0.5rem', // Optional: if you want the image corners rounded too
                      }}
                    />
                    <h5
                      style={{
                        marginTop: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      Car Wash
                    </h5>
                  </div>
                </Link>
                <Link to={routes.categories} data-aos="fade-up">
                  <div
                    style={{
                      padding: '2px',
                      background: 'white',
                      border: '2px solid white',
                      // height: "250px",
                      borderRadius: '0.5rem', // Tailwind's rounded-lg = 0.5rem = 8px
                      // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Tailwind's shadow-md
                    }}
                  >
                    <img
                      src="assets/img/services/221.jpeg"
                      alt="img"
                      className="img-fluid"
                      style={{
                        // height: "210px",
                        borderRadius: '0.5rem', // Optional: if you want the image corners rounded too
                      }}
                    />
                    <h5
                      style={{
                        marginTop: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      Painting
                    </h5>
                  </div>
                </Link>
                <Link to={routes.categories} data-aos="fade-up">
                  <div
                    style={{
                      padding: '2px',
                      background: 'white',
                      border: '2px solid white',
                      // height: "250px",
                      borderRadius: '0.5rem', // Tailwind's rounded-lg = 0.5rem = 8px
                      // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Tailwind's shadow-md
                    }}
                  >
                    <img
                      src="assets/img/services/221.jpeg"
                      alt="img"
                      className="img-fluid"
                      style={{
                        // height: "210px",
                        borderRadius: '0.5rem', // Optional: if you want the image corners rounded too
                      }}
                    />
                    <h5
                      style={{
                        marginTop: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      Painting
                    </h5>
                  </div>
                </Link>
              </Slider>
            </div>
          </div>
        </section>

        {/* banner service  */}
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
                  height: '400px',
                  display: 'block',
                  objectFit: 'fill',
                  objectPosition: 'center',
                  borderRadius: '0.5rem',
                }}
              />
            </div>
          </div>
        </section>

       
        {/* popular service */}
        {/* <section className="popular-service-seven-section">
          <div className="container">
            <div className="section-heading section-heading-seven">
              <div className="row">
                <div className="col-md-6 aos" data-aos="fade-up">
                  <h2>Featured Categories</h2>
                  <p>What do you need to find?</p>
                </div>
                <div className="col-md-6 text-md-end aos" data-aos="fade-up">
                  <div className="owl-nav mynav-seven-two" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Slider {...recentProject} className="recent-projects-seven">
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/service-107.jpg"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Plumbing</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-06.jpg"
                              className="avatar"
                              alt="image"
                            />{' '}
                            Jeny Doe
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Repairing Pipes by latest Machines
                        </Link>
                      </h3>
                      <p>
                        <span className="rate">
                          <i className="feather icon-phone" />
                          28-62-76-32
                        </span>
                        <i className="feather icon-map-pin me-2" />
                        New Jersey, USA
                      </p>
                      <div className="serv-info">
                        <div className="rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <span>(234)</span>
                        </div>
                        <h6>
                          $25.00<span className="old-price">$35.00</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/service-108.jpg"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Interior Design</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-11.jpg"
                              className="avatar"
                              alt="image"
                            />{' '}
                            Jeny Doe
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Grinding Steel Metal
                        </Link>
                      </h3>
                      <p>
                        <span className="rate">
                          <i className="feather icon-phone" />
                          28-62-76-32
                        </span>
                        <i className="feather icon-map-pin me-2" />
                        New Jersey, USA
                      </p>
                      <div className="serv-info">
                        <div className="rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <span>(234)</span>
                        </div>
                        <h6>$25.00</h6>
                      </div>
                    </div>
                  </div>
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/service-109.jpg"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Pipe Installation</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-19.jpg"
                              className="avatar"
                              alt="image"
                            />{' '}
                            Jeny Doe
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Installing Pipes &amp; Water Supply
                        </Link>
                      </h3>
                      <p>
                        <span className="rate">
                          <i className="feather icon-phone" />
                          28-62-76-32
                        </span>
                        <i className="feather icon-map-pin me-2" />
                        New Jersey, USA
                      </p>
                      <div className="serv-info">
                        <div className="rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <span>(234)</span>
                        </div>
                        <h6>$35.00</h6>
                      </div>
                    </div>
                  </div>
                  <div
                    className="service-widget service-two service-seven aos"
                    data-aos="fade-up"
                  >
                    <div className="service-img">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          className="img-fluid serv-img"
                          alt="Service Image"
                          src="assets/img/services/service-107.jpg"
                        />
                      </Link>
                      <div className="fav-item">
                        <Link to={routes.categories}>
                          <span className="item-cat">Car Repair</span>
                        </Link>
                        <Link to="javascript:void(0)" className="fav-icon">
                          <i className="feather icon-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <Link to="#">
                          <span className="item-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-06.jpg"
                              className="avatar"
                              alt="image"
                            />{' '}
                            Jeny Doe
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="service-content service-content-seven">
                      <h3 className="title">
                        <Link to={routes.serviceDetails1}>
                          Repairing Pipes by latest Machines
                        </Link>
                      </h3>
                      <p>
                        <span className="rate">
                          <i className="feather icon-phone" />
                          28-62-76-32
                        </span>
                        <i className="feather icon-map-pin me-2" />
                        New Jersey, USA
                      </p>
                      <div className="serv-info">
                        <div className="rating">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <span>(234)</span>
                        </div>
                        <h6>
                          $25.00<span className="old-price">$35.00</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </section> */}
      
        {/* Testimonials Section */}
        <section className="testimonals-seven-section pt-0">
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
                            src={`https://agscare.site/crmapi/public/storage/blog//${blog.img}`}
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
      <FooterSeven />
    </>
  );
};

export default HomeSeven;
