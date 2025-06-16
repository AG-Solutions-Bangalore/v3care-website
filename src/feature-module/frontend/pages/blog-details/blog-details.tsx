import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { blogDetailsData } from '../../../../core/data/json/blog_details';
import { blogCardData } from '../../../../core/data/json/blog_card';

import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import HomeHeader from '../../home/header/home-header';
import { BLOG_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import DefaultHelmet from '../../common/helmet/DefaultHelmet';



const BlogDetails = () => {
  const routes = all_routes;
  const { id } = useParams();
  const blog = blogDetailsData.find(item => item.id === id);
  const latestBlogs = blogCardData.slice(0, 5); 

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (!blog) {
    return (
      <>
        <DefaultHelmet/>
        <HomeHeader  />
        <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12 blog-details">
                <div className="blog-head">
                  <div className="blog-category">
                    <ul>
                      <li>
                        <span className="badge badge-light text-dark">
                          Cleaning
                        </span>
                      </li>
                
                      <li>
                        <div className="post-author">
                          <Link to="#">
                            <ImageWithBasePath
                              src="assets/img/services/v3logo.png"
                              alt="Post Author"
                            />
                            <span>V3 Care</span>
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
               
                </div>
                <div className="card blog-list shadow-none">
                  <div className="card-body">
                  BLOG NOT FOUND
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 blog-sidebar theiaStickySidebar">
                <StickyBox>
                  <div className="card post-widget">
                    <div className="card-body">
                      <h4 className="side-title">Latest News</h4>
                      <ul className="latest-posts">
                        {latestBlogs.map((latestBlog) => (
                          <li key={latestBlog.id}>
                            <div className="post-thumb">
                              <Link to={`${routes.blogDetails}/${latestBlog.id}`}>
                                <img
                                  className="img-fluid"
                                  src={`${BLOG_IMAGE_URL}/${latestBlog.img}`}
                                  alt="Blog Image"
                                />
                              </Link>
                            </div>
                            <div className="post-info">
                              <p>{latestBlog.date}</p>
                              <h4>
                                <Link to={`${routes.blogDetails}/${latestBlog.id}`}>
                                  {latestBlog.title}
                                </Link>
                              </h4>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </StickyBox>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <DefaultHelmet/>
     <HomeHeader  />
      {/* <BreadCrumb title='Blog Details' item1='Home' item2='Blog Details'/> */}
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12 blog-details">
                <div className="blog-head">
                  <div className="blog-category">
                    <ul>
                      <li>
                        <span className="badge badge-light text-dark">
                          Cleaning
                        </span>
                      </li>
                      <li>
                        {/* <i className="feather icon-calendar me-1" /> */}
                        changed 
                        <i className="ri-calendar-line me-2"></i>
                        {blog.date}
                      </li>
                      <li>
                        <div className="post-author">
                          <Link to="#">
                            <ImageWithBasePath
                                 src="assets/img/services/v3logo.png"
                              alt="Post Author"
                            />
                            <span>V3 Care</span>
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <h4 className="mb-3">{blog.title}</h4>
                </div>
                <div className="card blog-list shadow-none">
                  <div className="card-body">
                    <div className="blog-image">
                      <img
                        className="img-fluid"
                        src={`${BLOG_IMAGE_URL}/${blog.img}`}
                        loading="lazy"
  decoding="async"
                        alt="Post Image"
                      />
                    </div>
                    <div className="blog-content">
                      {blog.description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 blog-sidebar theiaStickySidebar">
                <StickyBox>
                  <div className="card post-widget">
                    <div className="card-body">
                      <h4 className="side-title">Latest News</h4>
                      <ul className="latest-posts">
                        {latestBlogs.map((latestBlog) => (
                          <li key={latestBlog.id}>
                            <div className="post-thumb">
                              <Link to={`${routes.blogDetails}/${latestBlog.id}`}>
                                <img
                                  className="img-fluid"
                                  src={`${BLOG_IMAGE_URL}/${latestBlog.img}`}
                                  alt="Blog Image"
                                  loading="lazy"
  decoding="async"
                                />
                              </Link>
                            </div>
                            <div className="post-info">
                              <p>{latestBlog.date}</p>
                              <h4>
                                <Link to={`${routes.blogDetails}/${latestBlog.id}`}>
                                  {latestBlog.title}
                                </Link>
                              </h4>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </StickyBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;