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
import './blog-details.css';
import moment from "moment"
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

 const {  blogs_slug } = useParams<{  blogs_slug?: string }>();


  
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
          `${BASE_URL}/api/panel-fetch-web-blogs-out-by-id/${blogs_slug}`
        );
        setBlog(response.data.blogs || null);
        setOtherBlogs(response.data.otherblogs || []);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Blog not found');
      }
    };

    if (blogs_slug) fetchBlogDetails();
  }, [blogs_slug]);


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


            <script type="application/ld+json">
    {`
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://v3care.com/blog-details/${blog.blogs_slug}"
      },
      "headline": "${blog.blogs_meta_title}",
      "description": "${blog.blogs_meta_description}",
      "image": "https://v3care.com/crmapi/storage/app/public/blog/${blog.blogs_image}",
      "author": {
        "@type": "Organization",
        "name": "V3Care"
      },
      "publisher": {
        "@type": "Organization",
        "name": "V3Care",
        "logo": {
          "@type": "ImageObject",
          "url": "https://v3care.com/assets/img/services/v3logo.png"
        }
      },
      "datePublished": "${moment(blog.blogs_created_date).format('DD-MM-YYYY')}",
      "dateModified": "${moment(blog.blogs_created_date).format('DD-MM-YYYY')}"
    }
    `}
  </script>


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
                        {moment(blog.blogs_created_date).format("DD-MMM-YYYY")}
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
                  <h1 className="h4 mb-3">{blog.blogs_heading}</h1>
                </div>
                <div className="card blog-list shadow-none">
                  <div className="card-body">
                    <div className="blog-image">
                      <img
                        className="img-fluid"
                        src={`${BLOG_IMAGE_URL}/${blog.blogs_image}`}
  //                       loading="lazy"
  // decoding="async"
                        alt={blog.blogs_heading}
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
                      <h1 className=" h4 side-title">Latest News</h1>
                      <ul className="latest-posts">
                        {otherBlogs.map((item) => (
                          <li key={item.id}>
                            <div className="post-thumb">
                            <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                                <img
                                  className="img-fluid"
                                  src={`${BLOG_IMAGE_URL}/${item.blogs_image}`}
                                  alt= {item.blogs_heading}
  //                                 loading="lazy"
  // decoding="async"
                                />
                              </Link>
                            </div>
                            <div className="post-info">
                            <p>       {moment(blog.blogs_created_date).format("DD-MMM-YYYY")}</p>
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