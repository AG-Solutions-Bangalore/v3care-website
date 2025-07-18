import React from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
interface breadCrumbProps {
  title: string;
  item1?: string;
  item2?: string;
}
const BreadCrumb: React.FC<breadCrumbProps> = ({ title, item1, item2 }) => {
  const routes = all_routes;
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <h1 className="breadcrumb-title mb-2">{title}</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.index}>
                 {/* changed  */}
                      <i className="ri-home-8-line"></i>
                  

                    </Link>
                  </li>
                  {item2 ? (
                    <>
                      <li className="breadcrumb-item "   aria-current="page">{item1}</li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {item2}
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="breadcrumb-item active">{item1}</li>
                    </>
                  )}
                </ol>
              </nav>
            </div>
          </div>
          <div className="breadcrumb-bg">
            <img
              src="assets/img/bg/breadcrumb-bg-01.png"
              className="breadcrumb-bg-1"
              alt="Img"
            />
            <img
              src="assets/img/bg/breadcrumb-bg-02.png"
              className="breadcrumb-bg-2"
              alt="Img"
            />
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
    </>
  );
};

export default BreadCrumb;
