import React, { useEffect, useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import VideoModal from '../../../../core/hooks/video-modal';
import StickyBox from 'react-sticky-box';
import axios from 'axios';
import BASE_URL from '../../../baseConfig/BaseUrl';

const ServiceDetails1 = () => {
  const routes = all_routes;
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const branch_id = localStorage.getItem('branch_id');
  const city = localStorage.getItem('city');
  const [servicePrices, setServicePrices] = useState<any[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [selectedPrices, setSelectedPrices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    order_date: new Date().toISOString().split('T')[0],
    order_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    order_refer_by: 'website',
    order_customer: '',
    order_customer_mobile: '',
    order_customer_email: '',
    order_service_date: '',
    order_service: state?.service_id || '',
    order_service_sub: state?.service_sub_id || '',
    order_service_price_for: '',
    order_service_price: '',
    order_amount: '',
    order_time: '',
    branch_id: branch_id || '',
    order_km: '0',
    order_address: '',
    order_flat: '',
    order_landmark: '',
    order_remarks: '',
  });
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);
  // Get data from localStorage

  const [showModal, setShowModal] = useState(false);
  const videoUrl = 'https://www.youtube.com/watch?v=Vdp6x7Bibtk';
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [open, setOpen] = React.useState(false);

  const fetchServicePrices = async () => {
    try {
      setPriceLoading(true);
      setPriceError(null);

      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-web-service-price-out`,
        {
          branch_id: branch_id,
          order_service: state?.service_id,
          order_service_sub: state?.service_sub_id,
        },
      );

      setServicePrices(response.data.serviceprice || []);
      // Select first price by default
      if (response.data.serviceprice?.length > 0) {
        setSelectedPrice(response.data.serviceprice[0]);
      }
    } catch (error) {
      console.error('Error fetching service prices:', error);
      setPriceError('Failed to load service prices. Please try again.');
    } finally {
      setPriceLoading(false);
    }
  };
  useEffect(() => {
    if (state?.service_id && branch_id) {
      fetchServicePrices();
    }
  }, [state?.service_id, state?.service_sub_id, branch_id]);
  useEffect(() => {
    if (servicePrices.length > 0) {
      setSelectedPrices([servicePrices[0]]); // Auto-select first price
    }
  }, [servicePrices]);

  /*------------------------------------------------start----------------- */

  const [timeOptions, setTimeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedTime, setSelectedTime] = useState<{
    label: string;
    value: string;
  } | null>(null);

  // Generate time options for dropdown
  useEffect(() => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push({
          label: timeString,
          value: timeString,
        });
      }
    }
    setTimeOptions(times);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (e: { value: { label: string; value: string } }) => {
    setSelectedTime(e.value);
    setFormData((prev) => ({
      ...prev,
      order_time: e.value.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update form data with selected prices info
      const finalFormData = {
        ...formData,
        order_service_price_for:
          selectedPrices.length > 0 ? selectedPrices[0].service_price_for : '',
        order_service_price:
          selectedPrices.length > 0
            ? selectedPrices[0].service_price_amount
            : '',
        order_amount: totalOriginalPrice.toFixed(2),
        order_remarks:
          selectedPrices.length > 1
            ? `Selected services: ${selectedPrices.map((p) => p.service_price_for).join(', ')}`
            : formData.order_remarks,
      };

      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-out`,
        finalFormData,
      );

      if (response.data.success) {
        navigate('/');
      } else {
        console.error(response.data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };
  /*------------------------------------------------end----------------- */
  const two = {
    dots: false,
    autoplay: false,
    slidesToShow: 6,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };
  const settings1 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: nav2 || undefined, // Link to the second slider
    ref: (slider: any) => (sliderRef1.current = slider), // Assign the slider ref
  };

  const settings2 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    focusOnSelect: true,
    asNavFor: nav1 || undefined, // Link to the first slider
    ref: (slider: any) => (sliderRef2.current = slider), // Assign the slider ref
  };
  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
  }, []);

  const togglePriceSelection = (price: any) => {
    setSelectedPrices((prev) => {
      const isSelected = prev.some((p) => p.id === price.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== price.id);
      } else {
        return [...prev, price];
      }
    });
  };

  // Calculate total price
  const totalPrice = selectedPrices.reduce(
    (sum, price) => sum + parseFloat(price.service_price_amount),
    0,
  );
  const totalOriginalPrice = selectedPrices.reduce(
    (sum, price) => sum + parseFloat(price.service_price_rate),
    0,
  );

  return (
    <>
      {/* <BreadCrumb
        title="Service Details"
        item1="Service"
        item2="Service Details"
      /> */}

      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xl-8">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="service-head mb-2">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        {/* <h3 className="mb-2">Lighting Servicesedit</h3> */}
                        <h3 className="mb-2">
                          {state?.service_name || 'Service Name'}
                          {state?.service_id || 'Service Id'}---
                          {state?.service_sub_id || 'Service Sub id'}
                          {state?.service_sub_name || 'Service Sub'} ---
                          {city && ` (${city})`}
                          {branch_id && ` [Branch: ${branch_id}]`}
                        </h3>
                        <span className="badge badge-purple-transparent mb-2">
                          <i className="ti ti-calendar-check me-1" />
                          6000+ Bookings
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                        <div className="d-flex align-items-center flex-wrap">
                          <p className="me-3 mb-2">
                            <i className="ti ti-map-pin me-2" />
                            18 Boon Lay Way, Singapore{' '}
                            <Link
                              to="#"
                              className="link-primary text-decoration-underline"
                            >
                              View Location
                            </Link>
                          </p>
                          <p className="mb-2">
                            <i className="ti ti-star-filled text-warning me-2" />
                            <span className="text-gray-9">4.9</span>(255
                            reviews)
                          </p>
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                          <Link to="javscript:void(0);" className="me-3 mb-2">
                            <i className="ti ti-eye me-2" />
                            3050 Views
                          </Link>
                          <Link to="javscript:void(0);" className="me-3 mb-2">
                            <i className="ti ti-heart me-2" />
                            Add to Wishlist
                          </Link>
                          <Link to="javscript:void(0);" className="me-3 mb-2">
                            <i className="ti ti-share me-2" />
                            Share Now
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="accordion service-accordion">
                      <div className="accordion-item mb-4">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button p-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#overview"
                            aria-expanded="false"
                          >
                            Service Overview
                          </button>
                        </h2>
                        <div
                          id="overview"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body border-0 p-0 pt-3">
                            <div className="more-text">
                              <p>
                                Provides reliable and professional electrical
                                solutions for residential and commercial
                                clients. Our licensed electricians are dedicated
                                to delivering top-quality service, ensuring
                                safety, and meeting all your electrical needs.
                                Committed to providing high-quality electrical
                                solutions with a focus on safety and customer
                                satisfaction. Our team of licensed electricians
                                is equipped to handle both residential and
                                commercial projects with expertise and care.
                              </p>
                              <p>
                                Comprehensive overview of Electrical Services,
                                including the types of services offered, key
                                benefits, location, contact details, special
                                offers, and customer reviews.
                              </p>
                            </div>
                            <Link
                              to="#"
                              className="link-primary text-decoration-underline more-btn mb-4"
                            >
                              Read More
                            </Link>
                            <div className="bg-light-200 p-3 offer-wrap">
                              <h4 className="mb-3">Services Offered</h4>

                              {priceLoading ? (
                                <div className="text-center py-4">
                                  <div
                                    className="spinner-border text-primary"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                  <p className="mt-2">Loading prices...</p>
                                </div>
                              ) : priceError ? (
                                <div className="alert alert-danger d-flex align-items-center justify-content-between">
                                  <div>{priceError}</div>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={fetchServicePrices}
                                  >
                                    Try Again
                                  </button>
                                </div>
                              ) : servicePrices.length > 0 ? (
                                servicePrices.map((price) => (
                                  <div
                                    key={price.id}
                                    className={`offer-item d-md-flex align-items-center justify-content-between mb-2 ${selectedPrices.some((p) => p.id === price.id) ? 'bg-primary-light border-primary' : 'bg-white'}`}
                                    style={{
                                      cursor: 'pointer',
                                      transition: 'all 0.3s ease',
                                      border: selectedPrices.some(
                                        (p) => p.id === price.id,
                                      )
                                        ? '1px solid #0d6efd'
                                        : '1px solid #dee2e6',
                                      borderRadius: '8px',
                                      padding: '12px',
                                    }}
                                    onClick={() => togglePriceSelection(price)}
                                  >
                                    <div className="d-sm-flex align-items-center mb-2">
                                      <span className="avatar avatar-lg flex-shrink-0 me-2 mb-2">
                                        {selectedPrices.some(
                                          (p) => p.id === price.id,
                                        ) ? (
                                          <i className="fas fa-check-circle text-primary fs-4"></i>
                                        ) : (
                                          <i className="far fa-circle text-muted fs-4"></i>
                                        )}
                                      </span>
                                      <div className="mb-2">
                                        <h6 className="fs-16 fw-medium">
                                          {price.service_price_for}
                                        </h6>
                                        <p className="fs-14 text-muted">
                                          Original Price: &#8377;
                                          {price.service_price_rate}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="pb-3">
                                      <h6 className="fs-16 fw-medium text-primary mb-0">
                                        &#8377;{price.service_price_amount}
                                      </h6>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="alert alert-info">
                                  No pricing options available for this service
                                </div>
                              )}
                            </div>

                                      {/* booking form  */}
                                      <div className="bg-light-200 p-3 offer-wrap">
                              <h4 className="mb-3">Booking Form</h4>

                          
                            </div>

                                                  {/* booking form end */}
                           
                          </div>
                        </div>
                      </div>
                     {/* booking form  */}

                  
                     <div className="content">
                          <div className="container">
                            <div className="row">
                              <div className="col-xl-12">
                                <div className="card">
                                  <div className="card-header">
                                    <h4 className="card-title">Booking Form</h4>
                                  </div>
                                  <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                      <div className="row">
                                        {/* First Column */}
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Date
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={formData.order_date}
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Year
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={formData.order_year}
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Referral Source
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={formData.order_refer_by}
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Customer Name{' '}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="order_customer"
                                              value={formData.order_customer}
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Mobile Number{' '}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="tel"
                                              className="form-control"
                                              name="order_customer_mobile"
                                              value={
                                                formData.order_customer_mobile
                                              }
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Email{' '}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="email"
                                              className="form-control"
                                              name="order_customer_email"
                                              value={
                                                formData.order_customer_email
                                              }
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>
                                        </div>

                                        {/* Second Column */}
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Service Date{' '}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="date"
                                              className="form-control"
                                              name="order_service_date"
                                              value={
                                                formData.order_service_date
                                              }
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Service
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={`${state?.service_name || ''} (${formData.order_service})`}
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Service Subcategory
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={`${state?.service_sub_name || ''} (${formData.order_service_sub})`}
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Selected Service
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={
                                                selectedPrices.length > 0
                                                  ? selectedPrices[0]
                                                      .service_price_for
                                                  : 'None selected'
                                              }
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Service Price
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={
                                                selectedPrices.length > 0
                                                  ? `₹${selectedPrices[0].service_price_amount}`
                                                  : '₹0'
                                              }
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Time{' '}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            {/* // Replace the Dropdown with a native select */}
                                            <select
                                              className="form-control"
                                              value={formData.order_time}
                                              onChange={(e) =>
                                                setFormData({
                                                  ...formData,
                                                  order_time: e.target.value,
                                                })
                                              }
                                              required
                                            >
                                              <option value="">
                                                Select Time
                                              </option>
                                              {timeOptions.map((time) => (
                                                <option
                                                  key={time.value}
                                                  value={time.value}
                                                >
                                                  {time.label}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Branch ID
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={formData.branch_id}
                                              disabled
                                            />
                                          </div>

                                          <div className="mb-3">
                                            <label className="form-label">
                                              Distance (KM)
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={formData.order_km}
                                              disabled
                                            />
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Total Amount
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={`₹${totalPrice.toFixed(2)}`}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Address{' '}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="order_address"
                                              value={formData.order_address}
                                              onChange={handleInputChange}
                                              required
                                            />
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Flat/Apartment
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="order_flat"
                                              value={formData.order_flat}
                                              onChange={handleInputChange}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Landmark
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="order_landmark"
                                              value={formData.order_landmark}
                                              onChange={handleInputChange}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-md-12">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Remarks
                                            </label>
                                            <textarea
                                              className="form-control"
                                              name="order_remarks"
                                              value={
                                                selectedPrices.length > 1
                                                  ? `Selected services: ${selectedPrices.map((p) => p.service_price_for).join(', ')}`
                                                  : formData.order_remarks
                                              }
                                              // onChange={handleInputChange}
                                              rows={3}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-end">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Submit Booking
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                     {/* booking form end */}
                      <div className="accordion-item mb-4">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button p-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#include"
                            aria-expanded="false"
                          >
                            Includes
                          </button>
                        </h2>
                        <div
                          id="include"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body border-0 p-0 pt-3">
                            <div className="bg-light-200 p-3 pb-2 br-10">
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Haircut &amp; Hair Styles
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Shampoo &amp; Conditioning
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Beard Trim/Shave
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Neck Shave
                              </p>
                              <p className="d-inline-flex align-items-center mb-2 me-4">
                                <i className="feather icon-check-circle text-success me-2" />
                                Hot Towel Treatment
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item mb-0">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button p-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#faq"
                            aria-expanded="false"
                          >
                            FAQ’s
                          </button>
                        </h2>
                        <div
                          id="faq"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body border-0 p-0 pt-3">
                            <div
                              className="accordion accordion-customicon1 faq-accordion"
                              id="accordionfaq"
                            >
                              <div className="accordion-item bg-light-200 mb-3">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq1"
                                    aria-expanded="false"
                                  >
                                    What is included in a Classic Cut?
                                  </button>
                                </h2>
                                <div
                                  id="faq1"
                                  className="accordion-collapse collapse show"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                      The Classic Cut includes a consultation
                                      with your barber, a haircut tailored to
                                      your style, and final styling with
                                      product. It does not include a hair wash
                                      or beard trim.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion-item bg-light-200 mb-3">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq2"
                                    aria-expanded="false"
                                  >
                                    Do you offer services for children?
                                  </button>
                                </h2>
                                <div
                                  id="faq2"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                      The Classic Cut includes a consultation
                                      with your barber, a haircut tailored to
                                      your style, and final styling with
                                      product. It does not include a hair wash
                                      or beard trim.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion-item bg-light-200 mb-3">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq3"
                                    aria-expanded="false"
                                  >
                                    What is the difference between a Hot Towel
                                    Shave and a regular shave?
                                  </button>
                                </h2>
                                <div
                                  id="faq3"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                      The Classic Cut includes a consultation
                                      with your barber, a haircut tailored to
                                      your style, and final styling with
                                      product. It does not include a hair wash
                                      or beard trim.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion-item bg-light-200">
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button bg-light-200 br-10 fs-16 fw-medium collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq4"
                                    aria-expanded="false"
                                  >
                                    Can I get a haircut and beard trim together?
                                  </button>
                                </h2>
                                <div
                                  id="faq4"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionfaq"
                                >
                                  <div className="accordion-body border-0 pt-0">
                                    <p>
                                      The Classic Cut includes a consultation
                                      with your barber, a haircut tailored to
                                      your style, and final styling with
                                      product. It does not include a hair wash
                                      or beard trim.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 theiaStickySidebar">
                <StickyBox>
                  <div className="card border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between border-bottom mb-3">
                        <div className="d-flex align-items-center">
                          <div className="mb-3">
                            <p className="fs-14 mb-0">Starts From</p>

                            <h4>
                              <span className="display-6 fw-bold">
                                &#8377;{totalPrice.toFixed(2) || '0'}
                              </span>
                              {totalOriginalPrice > 0 && (
                                <span className="text-decoration-line-through text-default">
                                  {' '}
                                  &#8377;{totalOriginalPrice.toFixed(2)}
                                </span>
                              )}
                            </h4>
                          </div>
                        </div>
                        <span className="badge bg-success mb-3 d-inline-flex align-items-center fw-medium">
                          <i className="ti ti-circle-percentage me-1" />
                          50% Offer
                        </span>
                      </div>
                      <Link
                        to="#"
                        className="btn btn-lg btn-primary w-100 d-flex align-items-center justify-content-center mb-3"
                      >
                        <i className="ti ti-calendar me-2" />
                        Book Service
                      </Link>
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add-enquiry"
                        className="btn btn-lg btn-outline-light d-flex align-items-center justify-content-center w-100"
                      >
                        <i className="ti ti-mail me-2" />
                        Send Enquiry
                      </Link>
                    </div>
                  </div>

                  <div className="card border-0">
                    <div className="card-body">
                      <h4 className="mb-3">Business Hours</h4>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">Monday</h6>
                        <p>9:30 AM - 7:00 PM</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">Tuesday</h6>
                        <p>9:30 AM - 7:00 PM</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">Wednesday</h6>
                        <p>9:30 AM - 7:00 PM</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">Thursday</h6>
                        <p>9:30 AM - 7:00 PM</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">Friday</h6>
                        <p>9:30 AM - 7:00 PM</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">Saturday</h6>
                        <p>9:30 AM - 7:00 PM</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-0">
                        <h6 className="fs-16 fw-medium mb-0">Sunday</h6>
                        <p className="text-danger">Closed</p>
                      </div>
                    </div>
                  </div>
                  <div className="card border-0">
                    <div className="card-body">
                      <h4 className="mb-3">Location</h4>
                      <div className="map-wrap">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6509170.989457427!2d-123.80081967108484!3d37.192957227641294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1669181581381!5m2!1sen!2sin"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="contact-map"
                        />
                        <div className="map-location bg-white d-flex align-items-center">
                          <div className="d-flex align-items-center me-2">
                            <span className="avatar avatar-lg flex-shrink-0">
                              <ImageWithBasePath
                                src="assets/img/services/service-thumb-01.jpg"
                                alt="img"
                                className="br-10"
                              />
                            </span>
                            <div className="ms-2 overflow-hidden">
                              <p className="two-line-ellipsis">
                                12301 Lake Underhill Rd, Suite 126, Orlando,
                                32828
                              </p>
                            </div>
                          </div>
                          <span>
                            <i className="feather icon-send fs-16" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to="#" className="text-danger fs-14">
                    <i className="ti ti-pennant-filled me-2" />
                    Report Provider
                  </Link>
                </StickyBox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            src: '/assets/img/services/service-slider-02.jpg',
          },
          {
            src: '/assets/img/services/service-slider-03.jpg',
          },
          {
            src: '/assets/img/services/service-slider-01.jpg',
          },
          {
            src: '/assets/img/services/service-slider-04.jpg',
          },
          {
            src: '/assets/img/services/service-slider-05.jpg',
          },
        ]}
      />
    </>
  );
};

export default ServiceDetails1;
