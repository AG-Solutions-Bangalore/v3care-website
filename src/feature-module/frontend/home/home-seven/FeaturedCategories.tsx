import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import axios from 'axios';
import { BASE_URL, SERVICE_SUPER_IMAGE_URL, NO_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import './FeaturedCategories.css';

interface Category {
  id: number;
  name: string;
  total: number;
  image: string | null;
}

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const branchId = localStorage.getItem("branch_id")
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      setCategories(response.data.serviceSuper?.map((item: any) => ({
        id: item.id,
        name: item.serviceSuper,
        image: item.serviceSuper_image,
        total: item.total
      })) || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories. Please try again.');
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

  const SkeletonLoader = () => (
    <div className="row">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="category-card">
            <div className="category-icon">
              <div className="category-icon-inner">
                <div className="skeleton-image" style={{
                  width: '100%',
                  height: '100px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '8px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
              </div>
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
        </div>
      ))}
    </div>
  );

  return (
    <section className="featured-categories-section">
      <div className="container">
        <div className="categories-header">
          <div className="row">
            <div className="col-md-6">
              <h2>Featured Categories</h2>
              <p>What do you need to find?</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="categories-navigation" />
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
                  onClick={fetchCategories}
                >
                  <Icon.RefreshCw className="me-1" size={14} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && categories.length > 0 && (
          <div className="row">
            {categories.map((category) => (
              <div key={category.id} className="col-lg-3 col-md-4 col-sm-6 col-6">
                <Link
                  to={`/categories/${encodeURIComponent(category.name)}/${category.id}`}
                  className="category-card"
                >
                  <div className="category-icon">
                    <div className="category-icon-inner">
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        loading="lazy"
                        decoding="async"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <h3>{category.name}</h3>
                  {category.total > 0 && (
                  <span
                  
                  style={{
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              color: '#4A4A4A',
                              fontFamily: 'Segoe UI, Roboto, sans-serif',
                              letterSpacing: '0.5px',
                            }}
                  
                  >{category.total} Services Available</span>
                  
                )}
         

                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      
     
     
    </section>
  );
};

export default FeaturedCategories;