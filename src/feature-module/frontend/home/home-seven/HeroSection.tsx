import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import axios from 'axios';
import { BASE_URL, SERVICE_SUPER_IMAGE_URL, NO_IMAGE_URL } from '../../../baseConfig/BaseUrl';

import './HeroSection.css';
import { encryptId } from '../../../../core/encyrption/Encyrption';

interface Category {
  id: number;
  name: string;
  image: string | null;
  url: string;
}

const HeroSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const branchId = localStorage.getItem("branch_id");

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
      console.error('Failed to fetch super categories:', error);
      setError('Failed to load super categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (image: string | null) => {
    if (!image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${SERVICE_SUPER_IMAGE_URL}/${image}`;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const SkeletonLoader = () => {
    return (
      <div className="hero-section-services">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className="hero-section-service-item skeleton-item"
          >
            <div className="hero-section-service-icon skeleton-icon"></div>
            <span className="hero-section-service-title skeleton-title"></span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="hero-section">
      <div className="hero-section-container">
        <div className="hero-section-header">
          <h1 className="hero-section-title">
            Professional Cleaning Services at Your Doorstep
          </h1>
        </div>
        
        <div className="hero-section-content-wrapper">
          <div className="hero-section-left">
            <div className="hero-section-search">
              <h3 className="hero-section-search-title">Pick the service you need today</h3>
              {isLoading || error ? (
                <SkeletonLoader />
              ) : (
                <div className="hero-section-services">
                  {categories.map((category, index) => (
                    <React.Fragment key={index}>
                      <Link 
                        to={`/${encodeURIComponent(category.url)}`}
                        className="hero-section-service-item"
                      >
                        <div className="hero-section-service-icon">
                          <img
                            src={getImageUrl(category.image)}
                            alt={category.name}
                            // loading="lazy"
                            // decoding="async"
                          />
                        </div>
                        <span className="hero-section-service-title">{category.name}</span>
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            
            <div className="hero-section-stats">
              <div className="hero-section-stat">
                <div className="hero-section-stat-icon">⭐</div>
                <div className="hero-section-stat-content">
                  <span className="hero-section-stat-number">4.8</span>
                  <span className="hero-section-stat-text">Service Rating*</span>
                </div>
              </div>
              <div className="hero-section-stat">
                <div className="hero-section-stat-icon">
                  <i className="ri-group-line"></i>
                </div>
                <div className="hero-section-stat-content">
                  <span className="hero-section-stat-number">12M+</span>
                  <span className="hero-section-stat-text">Customers Globally*</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-section-right">
            <div className="hero-section-images">
              <div className="hero-section-image hero-section-image-1">
                <img src="assets/img/services/h1.jpeg" alt="Salon Service"  />
              </div>
              <div className="hero-section-image hero-section-image-2">
                <img src="assets/img/services/h2.jpeg" alt="Massage Service" />
              </div>
              <div className="hero-section-image hero-section-image-3">
                <img src="assets/img/services/h3.jpeg" alt="Home Repair"  />
              </div>
              <div className="hero-section-image hero-section-image-4">
                <img src="assets/img/services/h4.jpeg" alt="AC Repair"  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;