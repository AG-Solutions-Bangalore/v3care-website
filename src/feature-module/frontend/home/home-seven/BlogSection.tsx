import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { blogCardData } from '../../../../core/data/json/blog_card';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { BASE_URL, BLOG_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import './BlogSection.css';
import axios from 'axios';
import moment from 'moment'

const BlogSection = () => {
  const routes = all_routes;
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-blogs-out`);
      setBlogs(response.data.blogs || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           
      .replace(/[^\w-]+/g, '')       
      .replace(/--+/g, '-')           
      .replace(/^-+|-+$/g, '');      
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
          dots: false,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  // Skeleton loader component
  const BlogSkeleton = () => (
    <div className="home-blog-slide">
      <div className="home-blog-card">
        <div className="home-blog-card-body">
          <div className="home-blog-img-container skeleton-box" style={{ height: '200px' }}></div>
          <div className="home-blog-content">
            <div className="home-blog-meta">
              <div className="home-blog-author">
                <span className="home-blog-avatar skeleton-box" style={{ width: '30px', height: '30px', borderRadius: '50%' }}></span>
                <h6 className="home-blog-author-name skeleton-box" style={{ width: '80px', height: '16px' }}></h6>
              </div>
              <div className="home-blog-date">
                <span className="skeleton-box" style={{ width: '100px', height: '16px' }}></span>
              </div>
            </div>
            <div>
              <h5 className="home-blog-post-title">
                <span className="skeleton-box" style={{ width: '100%', height: '24px', marginBottom: '8px' }}></span>
                <span className="skeleton-box" style={{ width: '80%', height: '24px' }}></span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div className="home-blog-error">
      <div className="home-blog-error-message">
        <p>{error}</p>
        <button 
          className="home-blog-error-button" 
          onClick={fetchBlogs}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <section className="home-blog-section">
      <div className="home-blog-container">
        <div className="home-blog-row">
          <div className="home-blog-header-col">
            <div className="home-blog-header">
              <h1 className="home-blog-title">Cleaning Tips, Trends & Service Guides from Our Experts</h1>
              <p className="home-blog-subtitle">
                Stay informed with expert insights, practical cleaning tips, and the latest updates from the home and office cleaning industry in India.
              </p>
            </div>
          </div>
        </div>
        <div className="home-blog-row">
          <div className="home-blog-slider-col">
            {error ? (
              <ErrorComponent />
            ) : loading ? (
              <Slider {...recentBlog} className="home-blog-slider">
                {[...Array(6)].map((_, index) => (
                  <BlogSkeleton key={index} />
                ))}
              </Slider>
            ) : (
              <Slider {...recentBlog} className="home-blog-slider">
                {blogs.slice(0, 6).map((blog) => (
                  <div className="home-blog-slide" key={blog.id}>
                    <div className="home-blog-card">
                      <div className="home-blog-card-body">
                        <div className="home-blog-img-container">
                          <Link to={`${routes.blogDetails}/${blog.blogs_slug}`}>
                            <img
                              src={`${BLOG_IMAGE_URL}/${blog.blogs_image}`}
                              className="home-blog-img"
                              alt={blog.blogs_heading}
                                                            // loading="lazy"
                              // decoding="async"
                            />
                          </Link>
                        </div>
                        <div className="home-blog-content">
                          <div className="home-blog-meta">
                            <div className="home-blog-author">
                              <span className="home-blog-avatar">
                                <ImageWithBasePath
                                  src="assets/img/services/v3logo.png"
                                  className="home-blog-avatar-img"
                                  alt="user"
                                />
                              </span>
                              <h6 className="home-blog-author-name">V3 Care</h6>
                            </div>
                            <div className="home-blog-date">
                              <span>
                                <i className="ri-calendar-line home-blog-date-icon"></i>
                              </span>
                              <span className="home-blog-date-text">       {moment(blog.blogs_created_date).format("DD-MMM-YYYY")}</span>
                            </div>
                          </div>
                          <div>
                            <h5 className="home-blog-post-title">
                              <Link to={`${routes.blogDetails}/${blog.blogs_slug}`}>
                                {blog.blogs_heading}
                              </Link>
                            </h5>
                          </div>
                        </div>
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
  );
};

export default BlogSection;