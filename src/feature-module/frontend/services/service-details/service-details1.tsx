import React, { useEffect, useState ,useRef} from 'react';
import 'yet-another-react-lightbox/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import axios from 'axios';
import BASE_URL from '../../../baseConfig/BaseUrl';

const ServiceDetails1 = () => {
  const REACT_APP_GOOGLE_MAPS_KEY = "AIzaSyAk4WgZpl2DuYxnfgYLCXEQKvVLK3hJ7S0";
let autoComplete: any;

const [query, setQuery] = useState("");
const autoCompleteRef = useRef(null);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const branch_id = localStorage.getItem('branch_id');
  const city = localStorage.getItem('city');
  const [servicePrices, setServicePrices] = useState<any[]>([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [serviceCards, setServiceCards] = useState<any[]>([]);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [selectedPrices, setSelectedPrices] = useState<any[]>([]);
  const [primaryPrice, setPrimaryPrice] = useState<any>(null);
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
    order_url: "",
    order_flat: '',
    order_landmark: '',
    order_remarks: '',
    order_building: "",
    order_advance: "",
    order_comment: "",
    order_area: "",
    order_discount: "",
      order_custom: "",
  order_custom_price: "",
  });

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
    } catch (error) {
      console.error('Error fetching service prices:', error);
      setPriceError('Failed to load service prices. Please try again.');
    } finally {
      setPriceLoading(false);
    }
  };

  const fetchServiceCard = async () => {
    try {
      setCardLoading(true);
      setCardError(null);

      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-web-service-details-out`,
        {
          service_id: state?.service_id,
          service_sub_id: state?.service_sub_id,
        },
      );

      setServiceCards(response.data.serviceDetails || []);
    } catch (error) {
      console.error('Error fetching service card :', error);
      setCardError('Failed to load service card . Please try again.');
    } finally {
      setCardLoading(false);
    }
  };

  useEffect(() => {
    if (state?.service_id && branch_id) {
      fetchServicePrices();
    }
  }, [state?.service_id, state?.service_sub_id, branch_id]);

  useEffect(() => {
    if (state?.service_id) {
      fetchServiceCard();
    }
  }, [state?.service_id, state?.service_sub_id]);

  useEffect(() => {
    if (servicePrices.length > 0) {
      setSelectedPrices([servicePrices[0]]);
    }
  }, [servicePrices]);

// for google map 
const handleScriptLoad = (updateQuery: any, autoCompleteRef: any) => {
  autoComplete = new (window as any).google.maps.places.Autocomplete(
    autoCompleteRef.current,
    {
      componentRestrictions: { country: "IN" },
    }
  );

  autoComplete.addListener("place_changed", () => {
    handlePlaceSelect(updateQuery);
  });
};

const handlePlaceSelect = async (updateQuery: any) => {
  const addressObject = await autoComplete.getPlace();
  const query = addressObject.formatted_address;
  const url = addressObject.url;
  updateQuery(query);

  setFormData(prev => ({
    ...prev,
    order_address: query,
    order_url: url
  }));
};

useEffect(() => {
  const loadScript = (url: string, callback: () => void) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState === "loaded" || script.readyState === "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = () => callback();
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  loadScript(
    `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`,
    () => handleScriptLoad(setQuery, autoCompleteRef)
  );
}, []);

// google map end
  /*------------------------------------------------start----------------- */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const finalFormData = {
        ...formData,
        order_service_price_for: primaryPrice?.id || '',
        order_service_price: primaryPrice?.service_price_amount || '',
        order_amount: totalPrice.toFixed(2),
        order_remarks:
          selectedPrices.length > 1
            ? `Selected services: ${selectedPrices.map((p) => p.service_price_for).join(', ')}\n${formData.order_remarks}`
            : formData.order_remarks,
      };

      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-outD`,
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
  useEffect(() => {
    if (selectedPrices.length > 0) {
      // Find the price with the smallest index in servicePrices
      const primary = selectedPrices.reduce((prev, current) => {
        const prevIndex = servicePrices.findIndex((p) => p.id === prev.id);
        const currentIndex = servicePrices.findIndex(
          (p) => p.id === current.id,
        );
        return prevIndex < currentIndex ? prev : current;
      });
      setPrimaryPrice(primary);
    } else {
      setPrimaryPrice(null);
    }
  }, [selectedPrices, servicePrices]);
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
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item mb-4">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button p-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#include"
                            aria-expanded="false"
                          >
                            Booking Form
                          </button>
                        </h2>
                        <div
                          id="include"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body border-0 p-0 pt-3">
                            <div className="bg-light-200 p-3 pb-2 br-10">
                              <form onSubmit={handleSubmit}>
                                <div className="row">
                                  {/* First Column */}
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">Date</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={formData.order_date}
                                        disabled
                                      />
                                    </div>

                                    <div className="mb-3">
                                      <label className="form-label">Year</label>
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
                                        <span className="text-danger">*</span>
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
                                        <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="tel"
                                        className="form-control"
                                        name="order_customer_mobile"
                                        value={formData.order_customer_mobile}
                                        onChange={handleInputChange}
                                        required
                                      />
                                    </div>

                                    <div className="mb-3">
                                      <label className="form-label">
                                        Email{' '}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="email"
                                        className="form-control"
                                        name="order_customer_email"
                                        value={formData.order_customer_email}
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
                                        <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="order_service_date"
                                        value={formData.order_service_date}
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
                                          primaryPrice
                                            ? primaryPrice.service_price_for
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
                                          primaryPrice
                                            ? `₹${primaryPrice.service_price_amount}`
                                            : '₹0'
                                        }
                                        disabled
                                      />
                                    </div>

                                    <div className="mb-3">
                                      <label className="form-label">
                                        Time{' '}
                                        <span className="text-danger">*</span>
                                      </label>

                                      <input
                                        type="time"
                                        className="form-control"
                                        value={formData.order_time}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            order_time: e.target.value,
                                          })
                                        }
                                        required
                                      />
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
    Address <span className="text-danger">*</span>
  </label>
  <input
    className="form-control"
    ref={autoCompleteRef}
    id="order_address"
    required
    onChange={(event) => setQuery(event.target.value)}
    placeholder="Search Places ..."
    value={query}
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
                                        value={formData.order_remarks}
                                        onChange={handleInputChange}
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

                  {/* recommendation card  */}
                  {cardLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading service cards...</p>
                    </div>
                  ) : cardError ? (
                    <div className="alert alert-danger d-flex align-items-center justify-content-between">
                      <div>{cardError}</div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={fetchServiceCard}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : serviceCards.length > 0 ? (
                    serviceCards.map((card) => (
                      <>
                        <div key={card.id} className="card p-0 border-0">
                          <div className="card-body p-0">
                            <div className="img-sec w-100">
                              <img
                                src={`http://agscare.site/crmapi/public/storage/service_details/${card.serviceDetails_image}`}
                                className="img-fluid rounded-top w-100 "
                                alt="img"
                              />
                            </div>
                            <div className="p-3">
                              <div>
                                <h5 className="fs-16 mb-1 text-wrap">
                                  {card?.service}
                                </h5>

                                <p
                                  className="fs-12 "
                                  style={{
                                    textAlign: 'justify',
                                  }}
                                >
                                  {card?.serviceDetails}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))
                  ) : (
                    <div className="alert alert-info">
                      No pricing options available for this service
                    </div>
                  )}

                  {/* recommendation card end */}
                </StickyBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails1;
