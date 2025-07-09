import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { Helmet } from 'react-helmet-async';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import HomeHeader from '../../home/header/home-header';
import { BASE_URL, BLOG_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import DefaultHelmet from '../../common/helmet/DefaultHelmet';
import axios from 'axios';

interface Blog {
  id: number;
  blogs_heading: string;
  blogs_description: string;
  blogs_image: string;
  blogs_created_date: string;
}

interface BlogApiResponse {
  blogs: Blog | null;
  otherblogs: Blog[];
}

const BlogDetails = () => {
 const routes = all_routes;

 const { id, blog_heading } = useParams<{ id?: string, blog_heading?: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [otherBlogs, setOtherBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
 useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get<BlogApiResponse>(
          `${BASE_URL}/api/panel-fetch-web-blogs-out-by-id/${blog_heading}`
        );
        setBlog(response.data.blogs || null);
        setOtherBlogs(response.data.otherblogs || []);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Blog not found');
      }
    };

    if (blog_heading) fetchBlogDetails();
  }, [blog_heading]);


  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           
      .replace(/[^\w-]+/g, '')       
      .replace(/--+/g, '-')           
      .replace(/^-+|-+$/g, '');      
  };


  if (error || !blog) {
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
                        {otherBlogs.map((item) => (
                          <li key={item.id}>
                            <div className="post-thumb">
                             <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                                <img
                                  className="img-fluid"
                                  src={`${BLOG_IMAGE_URL}/${item.blogs_image}`}
                                  alt="Blog Image"
                                />
                              </Link>
                            </div>
                            <div className="post-info">
                            <p>{item.blogs_created_date}</p>
                              <h4>
                              <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                                                                    {item.blogs_heading}
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
      <Helmet>
          <title>
            {blog?.blogs_meta_title && blog?.blogs_meta_title !== "null"
              ? blog.blogs_meta_title
              : "Best house cleaning service | V3 Care"}
          </title>
          {(blog?.blogs_meta_title &&
            blog?.blogs_meta_title !== "null") && (
            <meta name="title" content={blog.blogs_meta_title} />
          )}
          {(blog?.blogs_meta_description &&
            blog?.blogs_meta_description !== "null") && (
            <meta name="description" content={blog.blogs_meta_description} />
          )}
          
        </Helmet>
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
                        {/* changed  */}
                        <i className="ri-calendar-line me-2"></i>
                        {blog.blogs_created_date}
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
                  <h4 className="mb-3">{blog.blogs_heading}</h4>
                </div>
                <div className="card blog-list shadow-none">
                  <div className="card-body">
                    <div className="blog-image">
                      <img
                        className="img-fluid"
                        src={`${BLOG_IMAGE_URL}/${blog.blogs_image}`}
  //                       loading="lazy"
  // decoding="async"
                        alt="Post Image"
                      />
                    </div>
                    {/* <div className="blog-content">*/} 
                    <ReactQuill
  value={blog.blogs_description}
  readOnly={true}
  theme={null} 
  modules={{ toolbar: false }} 
  className="read-only-quill" 
/>
                  {/*</div>*/} 
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 blog-sidebar theiaStickySidebar">
                <StickyBox>
                  <div className="card post-widget">
                    <div className="card-body">
                      <h4 className="side-title">Latest News</h4>
                      <ul className="latest-posts">
                        {otherBlogs.map((item) => (
                          <li key={item.id}>
                            <div className="post-thumb">
                            <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                                <img
                                  className="img-fluid"
                                  src={`${BLOG_IMAGE_URL}/${item.blogs_image}`}
                                  alt="Blog Image"
  //                                 loading="lazy"
  // decoding="async"
                                />
                              </Link>
                            </div>
                            <div className="post-info">
                            <p>{item.blogs_created_date}</p>
                              <h4>
                              <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                                                                {item.blogs_heading}
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