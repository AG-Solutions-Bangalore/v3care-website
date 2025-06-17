import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { blogCardData } from '../../../../core/data/json/blog_card';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { BLOG_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import './BlogSection.css';

const BlogSection = () => {
  const routes = all_routes;

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

  return (
    <section className="home-blog-section">
      <div className="home-blog-container">
        <div className="home-blog-row">
          <div className="home-blog-header-col">
            <div className="home-blog-header">
              <h2 className="home-blog-title">Cleaning Tips, Trends & Service Guides from Our Experts</h2>
              <p className="home-blog-subtitle">
                Stay informed with expert insights, practical cleaning tips, and the latest updates from the home and office cleaning industry in India. Whether you are looking for deep cleaning guides, seasonal maintenance tips, or hygiene best practices for apartments, villas, or workspaces — our blog brings you valuable content that helps you make cleaner, healthier living choices.
              </p>
            </div>
          </div>
        </div>
        <div className="home-blog-row">
          <div className="home-blog-slider-col">
            <Slider {...recentBlog} className="home-blog-slider">
              {blogCardData.slice(0, 6).map((blog) => (
                <div className="home-blog-slide" key={blog.id}>
                  <div className="home-blog-card">
                    <div className="home-blog-card-body">
                      <div className="home-blog-img-container">
                        <Link to={`${routes.blogDetails}/${blog.id}`}>
                          <img
                            src={`${BLOG_IMAGE_URL}/${blog.img}`}
                            className="home-blog-img"
                            alt="img"
                            loading="lazy"
                            decoding="async"
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
                            <span className="home-blog-date-text">{blog.date}</span>
                          </div>
                        </div>
                        <div>
                          <h5 className="home-blog-post-title">
                            <Link to={`${routes.blogDetails}/${blog.id}`}>
                              {blog.title}
                            </Link>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;