import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import axios from 'axios';
import { BASE_URL, TESTIMONIAL_IMAGE_URL, NO_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import SkeletonTestimonials from '../../../skeletonLoader/SkeletonTestimonials';

interface Testimonial {
  testimonial_description: string;
  testimonial_user: string;
  testimonial_image: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-testimonial-out`);
      setTestimonials(response.data.testimonial || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      setError('Failed to load testimonials. Please try again.');
    } finally {
      setIsLoading(false);
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

  return (
    <section className="testimonals-seven-section pt-5">
      <div className="container">
        <div className="section-heading section-heading-seven">
          <div className="row">
            <div className="col-md-6">
              <h2>Top Testimonials</h2>
              <p>
                Description highlights the value of client feedback,
                showcases real testimonials
              </p>
            </div>
            <div className="col-md-6 text-md-end">
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
          {isLoading && <SkeletonTestimonials />}
            
            {error && !isLoading && (
              <div className="alert alert-danger d-flex align-items-center justify-content-center">
                <Icon.AlertCircle className="me-2" size={18} />
                <span>{error}</span>
                <button 
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={fetchTestimonials}
                >
                  <Icon.RefreshCw className="me-1" size={14} />
                  Try Again
                </button>
              </div>
            )}
            
            {!isLoading && !error && testimonials.length > 0 && (
              <Slider {...testimonialSlider} className="testimonals-seven-slider">
                {testimonials.map((testimonial, index) => (
                  <div className="testimonials-main-ryt" key={index}>
                    <div className="testimonials-content-seven">
                      <div className="testimonials-seven-img">
                        <img
                          src={getTestimonialImageUrl(testimonial.testimonial_image)}
                          alt={testimonial.testimonial_user}
                          className="img-fluid"
                          loading="lazy"
  decoding="async"
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
                        style={{
                          color:"#000"
                        }}
                        loading="lazy"
  decoding="async"
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
  );
};

export default TestimonialsSection;