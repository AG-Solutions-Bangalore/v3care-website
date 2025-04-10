import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Slider, SliderSingleProps } from 'antd';
import { Dropdown } from 'primereact/dropdown';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import StickyBox from 'react-sticky-box';

const ServiceGrid = () => {
  const routes = all_routes;
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedItems, setSelectedItems] = useState(Array(13).fill(false));

  const [isExpanded, setIsExpanded] = useState(false);
  const filterCheckboxStyle = {
    height: isExpanded ? 'auto' : '150px',
  };
  const onChange = (value: number | number[]) => {
    console.log('onChange: ', value);
  };
  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `$${value}`;
  const onChangeComplete = (value: number | number[]) => {
    console.log('onChangeComplete: ', value);
  };
  const value1 = [
    { name: 'All Sub Category' },
    { name: 'Computer' },
    { name: 'Construction' },
  ];
  const toggleHeight = () => {
    setIsExpanded(!isExpanded);
  };
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };


  return (
    <>
      <BreadCrumb title='Services' item1='Services'/>

      <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      <div className="container">
      
        <div className="">
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
              <h4>
                Found <span className="text-primary">11 Services</span>
              </h4>
              <div className="d-flex align-items-center">
                <span className="text-dark me-2">Sort</span>
                <div className="dropdown me-2">
                  <Link
                    to="#"
                    className="dropdown-toggle bg-light-300 "
                    data-bs-toggle="dropdown"
                  >
                    Price Low to High
                  </Link>
                  <div className="dropdown-menu">
                    <Link
                      to="#"
                      className="dropdown-item active"
                    >
                      Price Low to High
                    </Link>
                    <Link to="#" className="dropdown-item">
                      Price High to Low
                    </Link>
                  </div>
                </div>
                <Link
                  to={routes.serviceGrid}
                  className="tags d-flex justify-content-center align-items-center bg-primary rounded me-2"
                >
                  <i className="ti ti-layout-grid" />
                </Link>
                <Link
                  to={routes.serviceList}
                  className="tags d-flex justify-content-center align-items-center border rounded"
                >
                  <i className="ti ti-list" />
                </Link>
              </div>
            </div>
            <div className="row justify-content-center align-items-center">
              <div className="col-xl-3 col-md-4">
                <div className="card p-0">
                  <div className="card-body p-0">
                    <div className="img-sec w-100">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          src="assets/img/providers/provider-13.jpg"
                          className="img-fluid rounded-top w-100"
                          alt="img"
                        />
                      </Link>
                      <div className="image-tag d-flex justify-content-end align-items-center">
                        <span className="trend-tag">Car Wash</span>
                        <Link
                          to="#"
                          onClick={() => handleItemClick(1)}
                          className={`fav-icon like-icon ${selectedItems[1] ? 'selected' : ''}`}
                        >
                          <i className="ti ti-heart" />
                        </Link>
                      </div>
                      <span className="image-logo avatar avatar-md border rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/providers/provider-01.jpg"
                          className="img-fluid rounded-circle "
                          alt="logo"
                        />
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="mb-2">
                        <Link to={routes.serviceDetails1}>Car Repair Service</Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fs-14 mb-0">
                          <i className="ti ti-map-pin me-2" />
                          Maryland City, MD, USA
                        </p>
                        <span className="rating text-gray fs-14">
                          <i className="fa fa-star filled me-1" />
                          4.9
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>
                          $25.00{" "}
                          <span className="fs-13 text-gray">
                            <del>$30.00/hr</del>
                          </span>
                        </h5>
                        <Link
                          to={routes.booking}
                          className="btn bg-primary-transparent"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="card p-0">
                  <div className="card-body p-0">
                    <div className="img-sec w-100">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          src="assets/img/providers/provider-14.jpg"
                          className="img-fluid rounded-top w-100"
                          alt="img"
                        />
                      </Link>
                      <div className="image-tag d-flex justify-content-end align-items-center">
                        <span className="trend-tag">Construction</span>
                        <Link
                          to="#"
                          onClick={() => handleItemClick(2)}
                          className={`fav-icon like-icon ${selectedItems[2] ? 'selected' : ''}`}
                        >
                          <i className="ti ti-heart" />
                        </Link>
                      </div>
                      <span className="image-logo avatar avatar-md border rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/providers/provider-01.jpg"
                          className="img-fluid rounded-circle "
                          alt="logo"
                        />
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="mb-2">
                        <Link to={routes.serviceDetails1}>
                          Toughened Glass Fitting
                        </Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fs-14 mb-0">
                          <i className="ti ti-map-pin me-2" />
                          New Jersey, USA
                        </p>
                        <span className="rating text-gray fs-14">
                          <i className="fa fa-star filled me-1" />
                          4.7
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>
                          $20.00{" "}
                          <span className="fs-13 text-gray">
                            <del>$25.00/hr</del>
                          </span>
                        </h5>
                        <Link
                          to={routes.booking}
                          className="btn bg-primary-transparent"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="card p-0">
                  <div className="card-body p-0">
                    <div className="img-sec w-100">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          src="assets/img/providers/provider-15.jpg"
                          className="img-fluid rounded-top w-100"
                          alt="img"
                        />
                      </Link>
                      <div className="image-tag d-flex justify-content-end align-items-center">
                        <span className="trend-tag">Computer</span>
                        <Link
                          to="#"
                          onClick={() => handleItemClick(3)}
                          className={`fav-icon like-icon ${selectedItems[3] ? 'selected' : ''}`}
                        >
                          <i className="ti ti-heart" />
                        </Link>
                      </div>
                      <span className="image-logo avatar avatar-md border rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/providers/provider-01.jpg"
                          className="img-fluid rounded-circle "
                          alt="logo"
                        />
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="mb-2 text-truncate">
                        <Link to={routes.serviceDetails1}>
                          Computer Hardware Service
                        </Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fs-14 mb-0">
                          <i className="ti ti-map-pin me-2" />
                          California, USA
                        </p>
                        <span className="rating text-gray fs-14">
                          <i className="fa fa-star filled me-1" />
                          4.5
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>
                          $20.00{" "}
                          <span className="fs-13 text-gray">
                            <del>$35.00/hr</del>
                          </span>
                        </h5>
                        <Link
                          to={routes.booking}
                          className="btn bg-primary-transparent"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="card p-0">
                  <div className="card-body p-0">
                    <div className="img-sec w-100">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          src="assets/img/providers/provider-16.jpg"
                          className="img-fluid rounded-top w-100"
                          alt="img"
                        />
                      </Link>
                      <div className="image-tag d-flex justify-content-end align-items-center">
                        <span className="trend-tag">Interior</span>
                        <Link
                          to="#"
                          onClick={() => handleItemClick(4)}
                          className={`fav-icon like-icon ${selectedItems[4] ? 'selected' : ''}`}
                        >
                          <i className="ti ti-heart" />
                        </Link>
                      </div>
                      <span className="image-logo avatar avatar-md border rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/providers/provider-01.jpg"
                          className="img-fluid rounded-circle "
                          alt="logo"
                        />
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="mb-2">
                        <Link to={routes.serviceDetails1}>Interior Designing</Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fs-14 mb-0">
                          <i className="ti ti-map-pin me-2" />
                          Maryland, USA
                        </p>
                        <span className="rating text-gray fs-14">
                          <i className="fa fa-star filled me-1" />
                          4.8
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>
                          $30.00{" "}
                          <span className="fs-13 text-gray">
                            <del>$35.00/hr</del>
                          </span>
                        </h5>
                        <Link
                          to={routes.booking}
                          className="btn bg-primary-transparent"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="card p-0">
                  <div className="card-body p-0">
                    <div className="img-sec w-100">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          src="assets/img/providers/provider-17.jpg"
                          className="img-fluid rounded-top w-100"
                          alt="img"
                        />
                      </Link>
                      <div className="image-tag d-flex justify-content-end align-items-center">
                        <span className="trend-tag">Car Wash</span>
                        <Link
                          to="#"
                          onClick={() => handleItemClick(5)}
                          className={`fav-icon like-icon ${selectedItems[5] ? 'selected' : ''}`}
                        >
                          <i className="ti ti-heart" />
                        </Link>
                      </div>
                      <span className="image-logo avatar avatar-md border rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/providers/provider-01.jpg"
                          className="img-fluid rounded-circle "
                          alt="logo"
                        />
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="mb-2">
                        <Link to={routes.serviceDetails1}>Steam Car Wash</Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fs-14 mb-0">
                          <i className="ti ti-map-pin me-2" />
                          Montana, USA
                        </p>
                        <span className="rating text-gray fs-14">
                          <i className="fa fa-star filled me-1" />
                          4.2
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>
                          $20.00{" "}
                          <span className="fs-13 text-gray">
                            <del>$25.00/hr</del>
                          </span>
                        </h5>
                        <Link
                          to={routes.booking}
                          className="btn bg-primary-transparent"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="card p-0">
                  <div className="card-body p-0">
                    <div className="img-sec w-100">
                      <Link to={routes.serviceDetails1}>
                        <ImageWithBasePath
                          src="assets/img/providers/provider-18.jpg"
                          className="img-fluid rounded-top w-100"
                          alt="img"
                        />
                      </Link>
                      <div className="image-tag d-flex justify-content-end align-items-center">
                        <span className="trend-tag">Electrical</span>
                        <Link
                          to="#"
                          onClick={() => handleItemClick(6)}
                          className={`fav-icon like-icon ${selectedItems[6] ? 'selected' : ''}`}
                        >
                          <i className="ti ti-heart" />
                        </Link>
                      </div>
                      <span className="image-logo avatar avatar-md border rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/providers/provider-01.jpg"
                          className="img-fluid rounded-circle "
                          alt="logo"
                        />
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="mb-2">
                        <Link to={routes.serviceDetails1}>
                          Electric Panel Repairing
                        </Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fs-14 mb-0">
                          <i className="ti ti-map-pin me-2" />
                          Texas, USA
                        </p>
                        <span className="rating text-gray fs-14">
                          <i className="fa fa-star filled me-1" />
                          4.9
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>
                          $40.00{" "}
                          <span className="fs-13 text-gray">
                            <del>$45.00/hr</del>
                          </span>
                        </h5>
                        <Link
                          to={routes.booking}
                          className="btn bg-primary-transparent"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
         
            
            
             
            
            </div>
            <nav aria-label="Page navigation">
              <ul className="paginations d-flex justify-content-center align-items-center">
                <li className="page-item me-3">
                  <Link to="#" className="page-link">
                    <i className="ti ti-arrow-left me-2" />
                    Prev
                  </Link>
                </li>
                <li className="page-item me-2">
                  <Link
                    className="page-link-1 active d-flex justify-content-center align-items-center "
                    to="#"
                  >
                    1
                  </Link>
                </li>
                <li className="page-item me-2">
                  <Link
                    className="page-link-1 d-flex justify-content-center align-items-center "
                    to="#"
                  >
                    2
                  </Link>
                </li>
                <li className="page-item me-3">
                  <Link
                    className="page-link-1 d-flex justify-content-center align-items-center "
                    to="#"
                  >
                    3
                  </Link>
                </li>
                <li className="page-item ">
                  <Link className="page-link" to="#">
                    Next
                    <i className="ti ti-arrow-right ms-2" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

    </>
  );
};

export default ServiceGrid;
