import React, {  useState } from 'react';
import { Link } from 'react-router-dom';

import { all_routes } from '../../../../core/data/routes/all_routes';
import { blogCardData } from '../../../../core/data/json/blog_card';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import HomeHeader from '../../home/header/home-header';
import { BLOG_IMAGE_URL } from '../../../baseConfig/BaseUrl';


const BlogGrid = () => {
  const routes = all_routes;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;



  // Calculate current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogCardData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(blogCardData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(blogCardData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Display only a subset of page numbers
  const maxPageNumbers = 4;
  let displayPageNumbers = [];

  if (pageNumbers.length <= maxPageNumbers) {
    displayPageNumbers = pageNumbers;
  } else {
    if (currentPage <= 2) {
      displayPageNumbers = [1, 2, 3, '...', pageNumbers.length];
    } else if (currentPage >= pageNumbers.length - 1) {
      displayPageNumbers = [
        1,
        '...',
        pageNumbers.length - 2,
        pageNumbers.length - 1,
        pageNumbers.length,
      ];
    } else {
      displayPageNumbers = [
        1,
        currentPage - 1 > 2 ? '...' : 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2 < pageNumbers.length - 1
          ? '...'
          : pageNumbers.length - 1,
        pageNumbers.length,
      ].filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  
  return (
    <>
     <HomeHeader  />
      <BreadCrumb title="Blog"  item1="Blog" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              {currentItems.map((blog) => (
                <div
                  className="col-xl-4 col-md-6"
                  key={blog.id}
            
                >
                  <div className="card p-0">
                    <div className="card-body p-0">
                      <div className="img-sec w-100">
                        <Link to={`${routes.blogDetails}/${blog.id}`}>
                          <img
                          
                            src={`${BLOG_IMAGE_URL}/${blog.img}`}
                            className="img-fluid rounded-top w-100"
                            loading="lazy"
  decoding="async"
                            alt="img"
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
                            <h6 className="fs-14 text-gray-6">
                              V3 Care
                            </h6>
                          </div>
                          <div className="d-flex align-items-center ps-2">
                            <span>
                            <i className="ri-calendar-line me-2"></i>
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
            </div>
            <div className="table-paginate d-flex justify-content-center align-items-center flex-wrap row-gap-3">
              <div className="d-flex align-items-center justify-content-center">
                <nav aria-label="Page navigation">
                  <ul className="paginations d-flex justify-content-center align-items-center">
                    <li className="page-item me-2">
                      <Link
                        className="d-flex justify-content-center align-items-center"
                        to="#"
                        onClick={prevPage}
                      >
                 
                        <i className="ri-arrow-left-line me-2 "></i>
                        Prev
                      </Link>
                    </li>
                    {displayPageNumbers.map((number, index) => (
                      <li className="page-item me-2" key={index}>
                        {number === '...' ? (
                          <span className="page-link-1 d-flex justify-content-center align-items-center">
                            {number}
                          </span>
                        ) : (
                          <Link
                            className={`page-link-1 d-flex justify-content-center align-items-center ${
                              currentPage === number ? 'active' : ''
                            }`}
                            to="#"
                            onClick={() => paginate(number)}
                          >
                            {number}
                          </Link>
                        )}
                      </li>
                    ))}
                    <li className="page-item me-2">
                      <Link
                        className="d-flex justify-content-center align-items-center"
                        to="#"
                        onClick={nextPage}
                      >
                        Next <i className="ri-arrow-right-fill ms-2"></i>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogGrid;
