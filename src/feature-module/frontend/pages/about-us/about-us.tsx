import React, { useEffect, useState } from 'react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';

import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import axios from 'axios';
import * as Icon from 'react-feather';
import { BASE_URL, NO_IMAGE_URL, TESTIMONIAL_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';

interface Testimonial {
  testimonial_description: string;
  testimonial_user: string;
  testimonial_image: string;
}
const AboutUs = () => {

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState<string | null>(
    null,
  );
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

  const getTestimonialImageUrl = (testimonial_image: string) => {
    if (!testimonial_image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${TESTIMONIAL_IMAGE_URL}/${testimonial_image}`;
  };

  useEffect(() => {
   
    fetchTestimonials();
  }, []);
  const clientSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  return (
    <>
    <HomeHeader />
      <BreadCrumb title='About Us'  item1='About Us' />
      <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content p-0">
      {/* About */}
      <div className="about-sec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-img d-none d-md-block">
                <div className="about-exp">
                  <span>12+ years of experiences</span>
                </div>
                <div className="abt-img">
                  <ImageWithBasePath
                    src="assets/img/providers/about1.jpg"
                    className="img-fluid"
                    alt="img"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <h6>ABOUT V3 CARE</h6>
                <h2>Best Solution For Cleaning Services</h2>
                <p style={{
                  textAlign:"justify"
                }}>
                  Welcome to V3 care. the best cleaning service provider from South India- Bangalore. We take great pride in offering all of our clients a reliable, trustworthy and affordable service. we’ve steadily grown and built a reputation for excellence. We guarantee that you will receive the highest standard of service for the best possible price. V3 care offers impeccable service from start to finish. We offer a broad range of cleaning services for Residential, corporate ,Industrial and others, throughout the Bangalore.
                  
                </p>
                <p style={{
                  textAlign:"justify"
                }}>
                We take the time to understand each of our client’s needs, in order to ensure that they receive the best possible bespoke cleaning services for their premises. Our cleaning staff are well trained, motivated and supported by a team of local, knowledgable and experienced operational managers.
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <ul>
                      <li className="text-truncate">
      
                        <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        We prioritize quality and reliability
                      </li>
                      <li className="text-truncate">
                      <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        WeSaving your time and effort.
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul>
                      <li className="text-truncate">
                      <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        Clear, detailed service listings &amp; reviews
                      </li>
                      <li className="text-truncate">
                      <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        Smooth and satisfactory experience.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /About */}
      {/* Work Section */}
      <section className="work-section px-0 my-0 work-bg">
        <div className="work-bg-2 d-none d-md-block">
          <ImageWithBasePath src="assets/img/bg/dotted.png" alt="img" className="img-fluid" />
        </div>
        <div className="work-bg-1 d-none d-md-block">
          <ImageWithBasePath src="assets/img/bg/bg-13.png" alt="img" className="img-fluid" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="section-heading">
                <h2>How It Works</h2>
                <p>
                  Straightforward process designed to make your experience
                  seamless and hassle-free.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 d-flex">
              <div className=" card work-box flex-fill">
                <div className="card-body">
                  <div className="work-icon">
                    <span>
                      <ImageWithBasePath src="assets/img/icons/about-hands.svg" alt="img" />
                    </span>
                  </div>
                  <h5>Employess</h5>
                  <p>
                    Customers can browse or search for specific products or
                    services using categories, filters, or search bars.
                  </p>
                  <h4>01</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 d-flex">
              <div className=" card work-box flex-fill">
                <div className="card-body">
                  <div className="work-icon">
                    <span>
                      <ImageWithBasePath
                        src="assets/img/icons/about-documents.svg"
                        alt="img"
                      />
                    </span>
                  </div>
                  <h5>Offices</h5>
                  <p>
                    Customers can add items to their shopping cart. For
                    services, they may select a service and proceed to book.
                  </p>
                  <h4>02</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 d-flex">
              <div className=" card work-box flex-fill">
                <div className="card-body">
                  <div className="work-icon">
                    <span>
                      <ImageWithBasePath src="assets/img/icons/about-book.svg" alt="img" />
                    </span>
                  </div>
                  <h5>Clients</h5>
                  <p>
                    The Customer fulfills the order by either providing the
                    service to the buyer.
                  </p>
                  <h4>03</h4>
                </div>
              </div>
            </div>


            <div className="col-md-3 d-flex">
              <div className=" card work-box flex-fill">
                <div className="card-body">
                  <div className="work-icon">
                    <span>
                      <ImageWithBasePath src="assets/img/icons/about-book.svg" alt="img" />
                    </span>
                  </div>
                  <h5>Completed</h5>
                  <p>
                    The Customer fulfills the order by either providing the
                    service to the buyer.
                  </p>
                  <h4>04</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Work Section */}
      {/* Choose Us Section */}
      <div className="chooseus-sec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="choose-content">
                <h2>V3 care Promises</h2>
                <p>
                  Choose us for reliable, personalized service and exceptional
                  results.
                </p>
                <div className="accordion" id="faq_accordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseOne"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                      >
                        Trained Staff  
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseOne"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#faq_accordion"
                    >
                      <div className="accordion-body">
                        <p>
                          Access round-the-clock support through our dedicated
                          helpdesk, available 24/7 to address any issues or
                          queries you may have. Whether it’s day or night, our
                          team is here to ensure you receive timely assistance
                          and seamless service.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseTwo"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseTwo"
                      >
                        Complete Background Check
                      
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseTwo"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faq_accordion"
                    >
                      <div className="accordion-body">
                        <p>
                          Access round-the-clock support through our dedicated
                          helpdesk, available 24/7 to address any issues or
                          queries you may have. Whether it’s day or night, our
                          team is here to ensure you receive timely assistance
                          and seamless service.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseThree"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseThree"
                      >
                        Complete Staff Profiling
                       
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseThree"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faq_accordion"
                    >
                      <div className="accordion-body">
                        <p>
                          Access round-the-clock support through our dedicated
                          helpdesk, available 24/7 to address any issues or
                          queries you may have. Whether it’s day or night, our
                          team is here to ensure you receive timely assistance
                          and seamless service.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapse4"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseThree"
                      >
                        Complete Character Check
                       
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapse4"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faq_accordion"
                    >
                      <div className="accordion-body">
                        <p>
                          Access round-the-clock support through our dedicated
                          helpdesk, available 24/7 to address any issues or
                          queries you may have. Whether it’s day or night, our
                          team is here to ensure you receive timely assistance
                          and seamless service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="chooseus-img">
                <ImageWithBasePath
                  src="assets/img/providers/promisesabout.jpg"
                  className="img-fluid"
                  alt="img"
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="choose-icon">
                <ImageWithBasePath
                  src="assets/img/icons/group-stars.svg"
                  className="img-fluid"
                  alt="img"
                />
                <div className="choose-info">
                  <h3>2583+</h3>
                  <p>Satisfied Clients</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="choose-icon">
                <ImageWithBasePath
                  src="assets/img/icons/expert-team.svg"
                  className="img-fluid"
                  alt="img"
                />
                <div className="choose-info">
                  <h3>2583+</h3>
                  <p>Expert Team</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="choose-icon">
                <ImageWithBasePath
                  src="assets/img/icons/about-documents.svg"
                  className="img-fluid"
                  alt="img"
                />
                <div className="choose-info">
                  <h3>2583+</h3>
                  <p>Project Completed</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="choose-icon border-0">
                <ImageWithBasePath
                  src="assets/img/icons/expereience.svg"
                  className="img-fluid"
                  alt="img"
                />
                <div className="choose-info">
                  <h3>2583+</h3>
                  <p>Years of experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Our Team */}
      <div className="about-sec">
        <div className="container">
          <div className="row align-items-center">

          <div className="col-lg-6">
              <div className="about-content">
                <h6>OUR TEAM</h6>
                <h2>Best Solution For Cleaning Services</h2>
                <p style={{
                  textAlign:"justify"
                }}>
                Our team are highly trained, full-time professional cleaners,totally reliable,providing quality cleaning services in Bangalore at affordable prices. We pride ourselves in listening to our customers, ensuring they receive a cleaning service they can trust and rely on whether it is Residential, commercial or corporate clean, we will be there when you need us.You need a professional service which provides consistent high quality cleaning to meet your own very high standards. We can customize our services based on your needs.
                  
                </p>
               
                <div className="row">
                  <div className="col-md-6">
                    <ul>
                      <li className="text-truncate">
                      <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        We prioritize quality and reliability
                      </li>
                      <li className="text-truncate">
                      <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        WeSaving your time and effort.
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul>
                      <li className="text-truncate">
                      <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        Clear, detailed service listings &amp; reviews
                      </li>
                      <li className="text-truncate">
                      <i className="ri-checkbox-circle-line text-dark me-1 fs-4"></i>
                        Smooth and satisfactory experience.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>




            <div className="col-lg-6">
              <div className="about-img d-none d-md-block">
                <div className="about-exp">
                  <span>12+ years of experiences</span>
                </div>
                <div className="abt-img">
                  <ImageWithBasePath
                    src="assets/img/providers/teamabout.jpg"
                    className="img-fluid"
                    alt="img"
                  />
                </div>
              </div>
            </div>


            
          </div>
        </div>
      </div>



      {/* /Providers Section */}
      {/* Client Section */}
      <section className="client-section client-section-about">
        <div className="container">
          <div className="overlay-img d-none d-md-block">
            <div className="overlay-img-left">
              <ImageWithBasePath
                src="assets/img/bg/transperent-circle.png"
                alt="img"
                className="img-fluid"
              />
            </div>
            <div className="overlay-img-right">
              <ImageWithBasePath
                src="assets/img/bg/bg-graphics.png"
                alt="img"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="section-heading">
                <h2>Testimonials</h2>
                <p>
                  Our clients rave about our seamless service, exceptional
                  quality, and unmatched customer support.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
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
              <Slider className="  testimonial-slider-3" {...clientSlider}>
                   {testimonials.map((testimonial, index) => (
                <div className=" card client-widget" key={index}>
                  <div className="card-body">
                    <div className="client-img">
                     
                      <img
                            src={getTestimonialImageUrl(testimonial.testimonial_image)}
                            alt={testimonial.testimonial_user}
                            loading="lazy"
  decoding="async"
                            className="img-fluid rounded-circle"
                          />
                    </div>
                    <div className="client-content">
                    <p>{testimonial.testimonial_description}</p>
                 
                    </div>
                  </div>
                </div>
                 ))}
                </Slider>
                  )}
            </div>
          </div>
        </div>
      </section>
     
    </div>
  </div>
  {/* /Page Wrapper */}
</>

    </>
  );
};

export default AboutUs;
