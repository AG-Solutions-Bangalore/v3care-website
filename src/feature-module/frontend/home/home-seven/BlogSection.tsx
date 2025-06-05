import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { blogCardData } from '../../../../core/data/json/blog_card';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { BLOG_IMAGE_URL } from '../../../baseConfig/BaseUrl';
// import logoNav from "../../../../logo/v3.png";
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
    <section className="price-sections-seven blog-sec-seven">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="section-heading section-heading-seven">
              <h2>Our Recent Blog</h2>
              <p>
                Here&apos;s a compelling blog description designed to attract
                readers and provide a clear idea of what they can expect
                from your blog:
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Slider {...recentBlog} className="our-recent-blog">
              {blogCardData.slice(0, 6).map((blog) => (
                <div className="col-xl-4 col-md-6" key={blog.id}>
                  <div className="card p-0">
                    <div className="card-body p-0">
                      <div className="img-sec w-100">
                        <Link to={`${routes.blogDetails}/${blog.id}`}>
                          <img
                            src={`${BLOG_IMAGE_URL}/${blog.img}`}
                            className="img-fluid rounded-top w-100"
                            alt="img"
                            loading="lazy"
  decoding="async"
                          />
                        </Link>
                      </div>
                      <div className="p-3">
                        <div className="d-flex align-items-center mb-3">
                          <div className="d-flex align-items-center border-end pe-2">
                            <span className="avatar avatar-sm me-2">
                              <ImageWithBasePath
                                src="assets/img/services/v3logo.png"
                                className="rounded-circle"
                                alt="user"
                                
                              />
                            </span>
                            <h6 className="fs-14 text-gray-6">V3 Care</h6>
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
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;