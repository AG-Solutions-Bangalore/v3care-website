import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import Slider from 'react-slick';
import axios from 'axios';
import { BASE_URL, SERVICE_SUPER_IMAGE_URL, NO_IMAGE_URL } from '../../../baseConfig/BaseUrl';

interface ServiceSuper {
  id: number;
  serviceSuper: string;
  serviceSuper_image: string | null;
}

const FeaturedCategories = () => {
  const [serviceSupers, setServiceSupers] = useState<ServiceSuper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceSupers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out`);
      setServiceSupers(response.data.serviceSuper || []);
    } catch (error) {
      console.error('Failed to fetch service supers:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (serviceSuper_image: string | null) => {
    if (!serviceSuper_image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${SERVICE_SUPER_IMAGE_URL}/${serviceSuper_image}`;
  };

  useEffect(() => {
    fetchServiceSupers();
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

  // Skeleton loader component that matches the categories UI
  const SkeletonLoader = () => (
    <Slider
      {...categoriesSuperSlider}
      className="owl-carousel categories-slider-seven"
    >
      {[...Array(4)].map((_, index) => (
        <div key={index} className="feature-box feature-box-seven">
          <div className="feature-icon feature-icon-seven">
            <span>
              <div className="skeleton-image" style={{
                width: '100%',
                height: '100px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            </span>
          </div>
          <div className="skeleton-text" style={{
            height: '20px',
            width: '80%',
            backgroundColor: '#e0e0e0',
            margin: '10px auto',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      ))}
    </Slider>
  );

  return (
    <section className="service-section-seven">
      <div className="container">
        <div className="section-heading section-heading-seven">
          <div className="row">
            <div className="col-md-6">
              <h2>Featured Categories</h2>
              <p>What do you need to find?</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="owl-nav mynav mynav-seven" />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="row">
            <div className="col-md-12">
              <SkeletonLoader />
            </div>
          </div>
        )}

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
                    to={`/categories/${encodeURIComponent(serviceSuper.serviceSuper)}/${serviceSuper.id}`}
                    className="feature-box feature-box-seven"
                  >
                    <div className="feature-icon feature-icon-seven">
                      <span>
                        <img
                          src={getImageUrl(serviceSuper.serviceSuper_image)}
                          alt={serviceSuper.serviceSuper}
                          loading="lazy"
  decoding="async"
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
      
      {/* Add pulsing animation for skeleton loader */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          .skeleton-image, .skeleton-text {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default FeaturedCategories;