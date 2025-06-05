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
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="58" height="40">
<path d="M0 0 C19.14 0 38.28 0 58 0 C58 13.2 58 26.4 58 40 C38.86 40 19.72 40 0 40 C0 26.8 0 13.6 0 0 Z " fill="#ffffff" transform="translate(0,0)"/>
<path d="M0 0 C4.59177808 1.87845467 6.88802807 4.54139258 9 9 C10.12215908 16.85511359 9.09721239 24.1503658 5 31 C3.10841478 33.14952865 1.42763665 34.38157557 -1 36 C-1.639375 36.433125 -2.27875 36.86625 -2.9375 37.3125 C-5.96950105 38.32316702 -8.83392281 38.1217722 -12 38 C-12 36.35 -12 34.7 -12 33 C-10.906875 32.566875 -9.81375 32.13375 -8.6875 31.6875 C-5.93241228 30.49957756 -3.77866255 29.51105302 -2 27 C-2 26.01 -2 25.02 -2 24 C-3.5778125 23.87625 -3.5778125 23.87625 -5.1875 23.75 C-9.30271705 22.9404491 -11.02972998 21.88290914 -14 19 C-15.86233425 15.27533151 -15.57130829 11.05504687 -15 7 C-11.54601591 0.54311183 -6.97120356 -0.72532754 0 0 Z " fill="#000000" transform="translate(16,1)"/>
<path d="M0 0 C3.54130951 1.44871753 6.23994228 3.56576314 8.26953125 6.87109375 C10.44200532 13.20263581 10.16726894 21.37869996 7.4375 27.5 C4.53022087 32.32815998 0.35560153 36.21479949 -5 38 C-7.33299825 38.03954234 -9.66708189 38.04401732 -12 38 C-12 36.35 -12 34.7 -12 33 C-10.906875 32.566875 -9.81375 32.13375 -8.6875 31.6875 C-5.91203502 30.49320901 -3.85170763 29.46894351 -2 27 C-1.67 26.01 -1.34 25.02 -1 24 C-1.67546875 23.91363281 -2.3509375 23.82726562 -3.046875 23.73828125 C-7.20453457 23.08338979 -10.23659322 22.58164326 -13.625 20 C-15.63243458 15.62014272 -15.89929646 11.73075279 -15 7 C-11.49563853 0.56025088 -7.00539426 -0.72888495 0 0 Z " fill="#000000" transform="translate(48,1)"/>
<path d="M0 0 C4.62 0 9.24 0 14 0 C14 0.33 14 0.66 14 1 C12.7625 1.226875 11.525 1.45375 10.25 1.6875 C7.20514766 2.46892228 6.00408974 2.99643459 3.5625 5.125 C1.52757898 8.86925468 1.28733873 11.76175367 1 16 C0.67 16 0.34 16 0 16 C0 10.72 0 5.44 0 0 Z " fill="#ffffff" transform="translate(0,0)"/>
</svg>
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