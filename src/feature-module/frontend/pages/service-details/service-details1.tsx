import React, { useEffect, useState, useRef } from 'react';
import 'yet-another-react-lightbox/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {  useLocation, useNavigate } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import axios from 'axios';
import { BASE_URL, SERVICE_DETAILS_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';




const ServiceDetails1 = () => {
  const REACT_APP_GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  const REACT_APP_RAZARPAY_KEY = process.env.REACT_APP_RAZARPAY_KEY;
  let autoComplete: any;

  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const branch_id = localStorage.getItem('branch_id');
  
  const city = localStorage.getItem("city") || "your area";
const message = `We're not available in ${city} at the moment, but we're expanding and will be there soon!`;

  const [servicePrices, setServicePrices] = useState<any[]>([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [serviceCards, setServiceCards] = useState<any[]>([]);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [selectedPrices, setSelectedPrices] = useState<any[]>([]);
  const [primaryPrice, setPrimaryPrice] = useState<any>(null);
  const [showFullText, setShowFullText] = useState<Record<string | number, boolean>>({});
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [notifications, setNotifications] = useState<{
      id: string;
      message: string;
      type: 'success' | 'error';
    }[]>([]);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
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
    order_payment_amount:'',
    order_payment_type:"",
    order_transaction_details:"",
  });




    const showNotification = (message: string, type: 'success' | 'error') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    };
    
    const removeNotification = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    useEffect(() => {
      const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
/*---------------------------------vaildation----------------------- */
const validateForm = () => {
  const requiredFields = [
    'order_customer',
    'order_customer_mobile',
    'order_customer_email',
    'order_service_date',
    'order_time',
    'order_address'
  ];

  // Check if all required fields are filled
  for (const field of requiredFields) {
    if (!formData[field as keyof typeof formData]) {
      showNotification(`Please fill in the ${field.replace('order_', '').replace('_', ' ')} field`, 'error');
      return false;
    }
  }

  // Validate mobile number format (Indian mobile numbers)
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(formData.order_customer_mobile)) {
    showNotification('Please enter a valid 10-digit Indian mobile number','error');
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.order_customer_email)) {
    showNotification('Please enter a valid email address' ,'error');
    return false;
  }

  // Check if at least one service is selected
  if (selectedPrices.length === 0) {
    showNotification('Please select at least one service','error');
    return false;
  }

  return true;
};
/*---------------------------------------validation-end----------- */
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
      setCardError('Failed to load service card. Please try again.');
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
  const validateOnlyDigits = (inputtxt: string): boolean => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (
      (name === "order_customer_mobile") 
    
       
       &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };





const handleSubmitPayLater = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
 
 if (!validateForm()) {
  return;
}
  try {
    const bookingData = selectedPrices.map(price => ({
      order_service_price_for: price.id,
      order_service_price: price.service_price_rate,
      order_amount: price.service_price_amount,
     
      order_remarks: formData.order_remarks,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => !['order_service_price_for', 'order_service_price', 'order_amount'].includes(key))
      )
    }));

    const finalFormData = {
      booking_data: bookingData,
    };

    const response = await axios.post(
      `${BASE_URL}/api/panel-create-web-booking-out`,
      finalFormData,
    );

    if (response.data.code == 200) {
   
      showNotification(response.data.msg || "Payment successful", 'success');
      navigate('/payment-success', {
        state: {
          amount: totalPrice,
          service_name: state?.service_name,
          service_sub_name: state?.service_sub_name,
          payment_mode: 'pay_later',
          payment_status: 'pending',
          booking_status: 'confirmed',
          booking_data: bookingData,
          selected_prices: selectedPrices
        }
      });
    } else {
      console.error(response.data.message || 'Failed to create booking');
      navigate('/booking-failed', {
        state: {
          error: response.data.message || 'Booking creation failed',
          amount: totalPrice,
          service_name: state?.service_name,
          service_sub_name: state?.service_sub_name
        }
      });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    navigate('/booking-failed', {
      state: {
        error: error instanceof Error ? error.message : 'Booking failed',
        amount: totalPrice,
        service_name: state?.service_name,
        service_sub_name: state?.service_sub_name
      }
    });
  }
};


const loadScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
   

  
const handleSubmitPayNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

   if (!validateForm()) {
    return;
  }
  const res = await loadScript();
  if (!res) {
   
    showNotification('Razorpay SDK failed to load', 'error');
    return;
  }

  try {
    const bookingDataTemplate = selectedPrices.map(price => ({
      order_service_price_for: price.id,
      order_service_price: price.service_price_rate,
      order_amount: price.service_price_amount,
      order_payment_amount: price.service_price_amount,
      order_remarks: formData.order_remarks,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => 
          !['order_service_price_for', 'order_service_price', 'order_amount','order_payment_amount'].includes(key)
        )
      )
    }));

    const bookingDataTemplateModalClose = selectedPrices.map(price => ({
      order_service_price_for: price.id,
      order_service_price: price.service_price_rate,
      order_amount: price.service_price_amount,
      order_remarks: formData.order_remarks,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => 
          !['order_service_price_for', 'order_service_price', 'order_amount'].includes(key)
        )
      )
    }));
   
    // Calculate total price
    const totalPrice = selectedPrices.reduce(
      (sum, price) => sum + parseFloat(price.service_price_amount),
      0
    );
    
    // Razorpay options
    const options = {
      key: REACT_APP_RAZARPAY_KEY,
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      name: formData.order_customer ||   "V3 Care",
      description: `Payment for ${state?.service_name || 'Service'}`,
      handler: async function(response: any) {
        try {
         
          const finalBookingData = bookingDataTemplate.map(data => ({
            ...data,
            order_transaction_details: response.razorpay_payment_id,
            order_payment_type: response.razorpay_method || 'online' 
          }));

         
          const bookingResponse = await axios.post(
            `${BASE_URL}/api/panel-create-web-booking-out`,
            { booking_data: finalBookingData }
          );

          if (bookingResponse.data.code === 200) {
            navigate('/payment-success', {
              state: {
                payment_id: response.razorpay_payment_id,
                amount: totalPrice,
                service_name: state?.service_name,
                service_sub_name: state?.service_sub_name,
                payment_mode: response.razorpay_method || 'online',
                payment_status: 'success',
                booking_status: 'confirmed',
                booking_data: finalBookingData,
                selected_prices: selectedPrices,
                payment_details: {
                  method: response.razorpay_method,
                  transaction_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id
                }
              }
            });
          } else {
            navigate('/payment-success', {
              state: {
                payment_id: response.razorpay_payment_id,
                amount: totalPrice,
                service_name: state?.service_name,
                service_sub_name: state?.service_sub_name,
                payment_mode: response.razorpay_method || 'online',
                payment_status: 'success',
                booking_status: 'failed',
                payment_details: {
                  method: response.razorpay_method,
                  transaction_id: response.razorpay_payment_id
                }
              }
            });
          }
        } catch (error) {
          console.error("Booking creation failed after payment:", error);
            navigate('/payment-success', {
              state: {
                payment_id: response.razorpay_payment_id,
                amount: totalPrice,
                service_name: state?.service_name,
                service_sub_name: state?.service_sub_name,
                payment_mode: response.razorpay_method || 'online',
                payment_status: 'success',
                booking_status: 'failed',
                payment_details: {
                  method: response.razorpay_method,
                  transaction_id: response.razorpay_payment_id
                }
              }})
        }
      },
      prefill: {
        name: formData.order_customer || "",
        email: formData.order_customer_email || "",
        contact: formData.order_customer_mobile || "",
      },
      theme: {
        color: "#4361ee"
      },
      modal: {
        ondismiss: async function() {
         
          console.log("Payment modal dismissed");
          try {
            const bookingResponse =  await axios.post(
              `${BASE_URL}/api/panel-create-web-booking-out`,
              { booking_data: bookingDataTemplateModalClose }
            );
            
            if (bookingResponse.data.code === 200) {
              navigate('/payment-success', {
                state: {
                  amount: totalPrice,
                  service_name: state?.service_name,
                  service_sub_name: state?.service_sub_name,
                  payment_status: 'failed',
                  booking_status: 'confirmed',
                  selected_prices: selectedPrices,
                  booking_data: bookingDataTemplateModalClose
                }
              });
            } else {
              
              navigate('/booking-failed', {
                state: {
                  error: 'Payment was not completed and booking creation failed',
                  amount: totalPrice,
                  service_name: state?.service_name,
                  service_sub_name: state?.service_sub_name
                }
              });
            }
          } catch (error) {
            console.error("Failed to update booking status:", error);
            navigate('/booking-failed', {
              state: {
                error: 'Payment was not completed and booking creation failed',
                amount: totalPrice,
                service_name: state?.service_name,
                service_sub_name: state?.service_sub_name
              }
            });
          }
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    
    rzp.on('payment.failed', function(response: {
      error: {
        description: string;
        code: string;
        metadata: {
          payment_id?: string;
          order_id?: string;
        };
      };
    }) {
      let errorMessage = response.error.description;
    const paymentMethod = '';
      
      
      if (response.error.code === 'PAYMENT_CANCELLED') {
        errorMessage = 'Payment was cancelled by user';
      } else if (response.error.code === 'PAYMENT_FAILED') {
        errorMessage = 'Payment failed. Please try again or use another method';
      }

      navigate('/booking-failed', {
        state: {
          error: errorMessage,
          payment_id: response.error.metadata?.payment_id,
          payment_method: paymentMethod
        }
      });
    });
    
    rzp.open();
    
  } catch (error) {
    console.error('Payment initiation failed:', error);
    navigate('/booking-failed', {
      state: {
        error: error instanceof Error ? error.message : 'Payment initialization failed'
      }
    });
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
      <HomeHeader type={8} />
      <style>
        {`
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    `}
      </style>
      <style>
  {`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}
</style>
{/* <div style={{
  position: 'fixed',
  top: '90px',
  right: '20px',
  zIndex: 1000,
  maxWidth: '350px',
  width: '100%'
}}>
  {notifications.map((notification) => (
    <div 
      key={notification.id}
      className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show p-2 mb-2`}
      style={{
        width: '100%',
        borderRadius: '4px',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: 'slideDown 0.3s ease-out',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}
    >
      <span style={{ flex: 1 }}>{notification.message}</span>
      <button 
        type="button" 
        className="btn-close p-1" 
        style={{ fontSize: '10px' }}
        onClick={() => removeNotification(notification.id)}
        aria-label="Close"
      />
    </div>
  ))}
</div> */}
<div
style={{
  position: 'fixed',
  top: isSmallScreen ? '70px' : '90px',
  right: '20px',
  zIndex: 1000,
  maxWidth: '300px',
  width: '100%',
  left: isSmallScreen ? '50%' : 'auto',
  transform: isSmallScreen ? 'translateX(-50%)' : 'none',
}}
>
  {notifications.map((notification) => (
    <div 
      key={notification.id}
      className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show p-2 mb-2`}
      style={{
        width: '100%',
        borderRadius: '4px',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: 'slideDown 0.3s ease-out',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}
    >
      <span style={{ flex: 1 }}>{notification.message}</span>
      <button 
        type="button" 
        className="btn-close p-1" 
        style={{ fontSize: '10px' }}
        onClick={() => removeNotification(notification.id)}
        aria-label="Close"
      />
    </div>
  ))}
</div>


      <div className="page-wrapper">


      


        <div
          className="d-lg-none"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            background: 'linear-gradient(90deg, #4361ee 0%, #7209b7 100%)',
            color: 'white',
            zIndex: 1000,
            borderTopLeftRadius: showBreakdown ? '0' : '12px',
            borderTopRightRadius: showBreakdown ? '0' : '12px',
            boxShadow: '0 -3px 10px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            transition: 'border-radius 0.3s ease'
          }}
        >
          {/* Shine effect overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
              animation: 'shine 3s infinite'
            }}
          ></div>

          {/* Content container */}
          <div className="container-fluid py-2 px-3">
            <div className="row align-items-center" onClick={() => setShowBreakdown(!showBreakdown)}>
              <div className="col">
                <div className="d-flex align-items-center">
                  <span
                    className="badge rounded-pill me-2"
                    style={{
                      backgroundColor: '#ffe600',
                      color: '#7209b7',
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedPrices.length}
                  </span>
                  <div>
                    <span className="fw-bold">₹{totalPrice.toFixed(2)}</span>
                    {totalOriginalPrice > 0 && (
                      <small
                        className="ms-2"
                        style={{
                          textDecoration: 'line-through',
                          opacity: 0.75
                        }}
                      >
                        ₹{totalOriginalPrice.toFixed(2)}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <i className={`fas fa-chevron-${showBreakdown ? 'down' : 'up'} text-white`}></i>
              </div>
            </div>

            {showBreakdown && (
              <div className="mt-3 pt-2 border-top">
                {selectedPrices.map((price, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span>{price.service_price_for}</span>
                    <span>₹{price.service_price_amount}</span>
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>












        <div className="content">
          
          <div className="container">
            <div className="row">
              <div className="col-xl-8">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="service-head mb-2">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        {/* <h3 className="mb-2">Lighting Servicesedit</h3> */}
                        {/* <h3 className="mb-2">
                          {state?.service_name || 'Service Name'}
                          {state?.service_id || 'Service Id'}---
                          {state?.service_sub_id || 'Service Sub id'}
                          {state?.service_sub_name || 'Service Sub'} ---
                          {city && ` (${city})`}
                          {branch_id && ` [Branch: ${branch_id}]`}
                        </h3> */}
                        <h4 className="mb-2  text-primary"   >
                          <span> {state?.service_name || 'Service Name'}</span>

                          &nbsp;  <span>{state?.service_sub_name ? `-- ${state?.service_sub_name}` : ""}</span>

                        </h4>

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
                            Service Offered
                          </button>
                        </h2>
                        <div
                          id="overview"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body border-0 p-0 pt-3">
                            {/* <div className="more-text">
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
                            </div> */}
                            {/* <Link
                              to="#"
                              className="link-primary text-decoration-underline more-btn mb-4"
                            >
                              Read More
                            </Link> */}
                            <div className="bg-light-200 p-3 offer-wrap">
                              {/* <h4 className="mb-3">Services Offered</h4> */}

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
                                  {/* No pricing options available for this service */}
                                 {message}
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
                           {/* Notification Container - Add this right here */}
                           {/* <div style={{ position: 'relative', marginBottom: notifications.length ? '10px' : '0' }}>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show p-2 mb-2`}
          style={{
            width: '100%',
            borderRadius: '4px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'slideDown 0.3s ease-out',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ flex: 1 }}>{notification.message}</span>
          <button 
            type="button" 
            className="btn-close p-1" 
            style={{ fontSize: '10px' }}
            onClick={() => removeNotification(notification.id)}
            aria-label="Close"
          />
        </div>
      ))}
    </div>
  </div> */}
                          <div className="accordion-body border-0 p-0 pt-3">
                            <div className="bg-light-200 p-2 pb-2 br-10">
                              <form className="booking-form">
                                {/* Compact Info Display Section - Read-only information */}
                                {/* <div className="info-summary mb-4 p-2 rounded bg-light border">
                                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0 text-dark">Booking Summary</h5>
                                    <span className="badge bg-success px-3 py-2 rounded-pill">Total: ₹{totalPrice.toFixed(2)}</span>
                                  </div>

                                  <div className="row g-2">
                                    <div className="col-md-4 col-6">
                                      <div className="info-chip d-flex">
                                        <span className="text-muted me-2">Date:</span>
                                        <span className="fw-medium">{formData.order_date}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-6">
                                      <div className="info-chip d-flex">
                                        <span className="text-muted me-2">Year:</span>
                                        <span className="fw-medium">{formData.order_year}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-6">
                                      <div className="info-chip d-flex">
                                        <span className="text-muted me-2">Source:</span>
                                        <span className="fw-medium">{formData.order_refer_by}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-6">
                                      <div className="info-chip d-flex">
                                        <span className="text-muted me-2">Service:</span>
                                        <span className="fw-medium text-truncate">{state?.service_name || '-'}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-6">
                                      <div className="info-chip d-flex">
                                        <span className="text-muted me-2">Type:</span>
                                        <span className="fw-medium text-truncate">{state?.service_sub_name || '-'}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-6">
                                      <div className="info-chip d-flex">
                                        <span className="text-muted me-2">Branch:</span>
                                        <span className="fw-medium">{formData.branch_id}</span>
                                      </div>
                                    </div>
                                   
                                    <div className="col-md-6">
                                      <div className="info-chip">
                                        <span className="text-muted me-2">Selected Services:</span>
                                        <div className="mt-1">
                                          {selectedPrices.length > 0 ? (
                                            selectedPrices.map((price, index) => (
                                              <div key={index} className="d-flex justify-content-between">
                                                <span className="fw-medium">{price.service_price_for}</span>
                                                <span className="fw-medium">₹{price.service_price_amount}</span>
                                              </div>
                                            ))
                                          ) : (
                                            <span className="fw-medium">None</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="info-chip d-flex flex-column">
                                        <div className="d-flex justify-content-between">
                                          <span className="text-muted">Total Price:</span>
                                          <span className="fw-bold">₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                        {totalOriginalPrice > 0 && (
                                          <div className="d-flex justify-content-between">
                                            <span className="text-muted">Original Price:</span>
                                            <span className="text-decoration-line-through">₹{totalOriginalPrice.toFixed(2)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-4 col-6">
                                      <div className="info-chip d-flex">
                                        <span className="text-muted me-2">Distance:</span>
                                        <span className="fw-medium">{formData.order_km} KM</span>
                                      </div>
                                    </div>
                                  </div>
                                </div> */}

                                {/* All editable fields in one clean section */}
                                <div className="editable-fields p-4 rounded bg-white shadow-sm border">


                                  <div className="row g-3">
                                    {/* Personal Details */}
                                    <div className="col-md-4">
                                      <label className="form-label small text-muted">Customer Name <span className="text-danger">*</span></label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="order_customer"
                                        value={formData.order_customer}
                                        onChange={handleInputChange}
                                        placeholder="Your full name"
                                        required
                                      />
                                    </div>

                                    <div className="col-md-4">
                                      <label className="form-label small text-muted">Mobile Number <span className="text-danger">*</span></label>
                                      <input
                                        type="tel"
                                        className="form-control"
                                        name="order_customer_mobile"
                                        value={formData.order_customer_mobile}
                                        onChange={handleInputChange}
                                        minLength={10}
                                        maxLength={10}
                                        placeholder="Your contact number"
                                        required
                                      />
                                    </div>

                                    <div className="col-md-4">
                                      <label className="form-label small text-muted">Email <span className="text-danger">*</span></label>
                                      <input
                                        type="email"
                                        className="form-control"
                                        name="order_customer_email"
                                        value={formData.order_customer_email}
                                        onChange={handleInputChange}
                                        placeholder="Your email address"
                                        required
                                      />
                                    </div>

                                    {/* Schedule Details */}
                                    <div className="col-md-6">
                                      <label className="form-label small text-muted">Service Date <span className="text-danger">*</span></label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="order_service_date"
                                        value={formData.order_service_date}
                                        onChange={handleInputChange}
                                        required
                                      />
                                    </div>

                                    <div className="col-md-6">
                                      <label className="form-label small text-muted">Service Time <span className="text-danger">*</span></label>
                                      <input
                                        type="time"
                                        className="form-control"
                                        name="order_time"
                                        value={formData.order_time}
                                        onChange={(e) => setFormData({ ...formData, order_time: e.target.value })}
                                        required
                                      />
                                    </div>

                                    {/* Location Details */}
                                    <div className="col-12">
                                      <label className="form-label small text-muted">Address <span className="text-danger">*</span></label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        ref={autoCompleteRef}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search for your address..."
                                        value={query}
                                        required
                                      />
                                    </div>

                                    <div className="col-md-6">
                                      <label className="form-label small text-muted">Flat/Apartment</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="order_flat"
                                        value={formData.order_flat}
                                        onChange={handleInputChange}
                                        placeholder="Flat number, building name, etc."
                                      />
                                    </div>

                                    <div className="col-md-6">
                                      <label className="form-label small text-muted">Landmark</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="order_landmark"
                                        value={formData.order_landmark}
                                        onChange={handleInputChange}
                                        placeholder="Nearby landmark"
                                      />
                                    </div>

                                    <div className="col-12">
                                      <label className="form-label small text-muted">Remarks</label>
                                      <textarea
                                        className="form-control"
                                        name="order_remarks"
                                        value={formData.order_remarks}
                                        onChange={handleInputChange}
                                        placeholder="Any special instructions or notes"
                                        rows={3}
                                      ></textarea>
                                    </div>

                                    {/* <div className="col-12 mt-4">
                                      <button type="submit" className="btn btn-primary w-100 py-2">
                                        Book Service
                                      </button>
                                    </div> */}
                                    <div className="col-12 mt-4 d-flex gap-2">
  <button 
    type="button" 
    className="btn btn-primary flex-grow-1 py-2"
    onClick={handleSubmitPayNow} 
  >
    Pay Now
  </button>
  <button 
    type="button" 
    className="btn btn-outline-primary flex-grow-1 py-2"
    onClick={handleSubmitPayLater} 
  >
    Pay Later
  </button>
</div>
                                  </div>
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
                  <div className="card border-0 d-none d-lg-block ">
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
                                src={`${SERVICE_DETAILS_IMAGE_URL}/${card.serviceDetails_image}`}
                                className="img-fluid rounded-top w-100 "
                                alt="img"
                              />
                            </div>
                            <div className="p-3">
                              <div>
                                <h5 className="fs-16 mb-1 text-wrap">
                                  {card?.serviceDetails_name}
                                </h5>


                                <p className="fs-12" style={{ textAlign: 'justify' }}>
                                  {card?.serviceDetails && (
                                    <>
                                      {showFullText?.[card.id] ? (
                                        card.serviceDetails
                                      ) : (
                                        <>
                                          {card.serviceDetails.split(' ').slice(0, 25).join(' ')}
                                          {card.serviceDetails.split(' ').length > 25 && '...'}
                                        </>
                                      )}
                                      {card.serviceDetails.split(' ').length > 25 && (
                                        <span
                                          className="link-primary text-decoration-underline ms-1"
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => setShowFullText(prev => ({ ...prev, [card.id]: !prev?.[card.id] }))}
                                        >
                                          {showFullText?.[card.id] ? 'Read less' : 'Read more'}
                                        </span>
                                      )}
                                    </>
                                  )}
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
