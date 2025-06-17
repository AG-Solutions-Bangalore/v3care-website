import React from 'react';
import HomeHeader from '../../home/header/home-header';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { RootState } from '../../../../core/redux/store';
import { clearCart, removeFromCart, updateCartItems } from '../../../../core/redux/slices/CartSlice';
import axios from 'axios';
import './cart.css';
import { BASE_URL } from '../../../baseConfig/BaseUrl';
import DefaultHelmet from '../../common/helmet/DefaultHelmet';
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 600);
  // const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = React.useState(false);
  const [notifications, setNotifications] = React.useState<{ 
    id: string, 
    message: string, 
    type: 'success' | 'error',
    persistent?: boolean 
  }[]>([]);
  const [query, setQuery] = React.useState('');
  const branch_id = localStorage.getItem('branch_id');
  const autoCompleteRef = React.useRef<HTMLInputElement>(null);

  const REACT_APP_GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  const REACT_APP_RAZARPAY_KEY = process.env.REACT_APP_RAZARPAY_KEY;
  let autoComplete: any;

  React.useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group items by service and service sub
  const groupedItems = cartItems.reduce((acc: any, item) => {
    const key = `${item.service_id}-${item.service_sub_id || 'none'}`;
    if (!acc[key]) {
      acc[key] = {
        service_name: item.service_name,
        service_sub_name: item.service_sub_name,
        items: [],
        total: 0,
        originalTotal: 0
      };
    }
    acc[key].items.push(item);
    acc[key].total += parseFloat(item.service_price_amount);
    acc[key].originalTotal += parseFloat(item.service_price_rate);
    return acc;
  }, {});

  // Calculate overall totals
  const totalPrice = Object.values(groupedItems).reduce((sum: number, group: any) => sum + group.total, 0);
  const totalOriginalPrice = Object.values(groupedItems).reduce((sum: number, group: any) => sum + group.originalTotal, 0);

  const [formData, setFormData] = React.useState({
    order_date: new Date().toISOString().split('T')[0],
    order_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    order_refer_by: 'website',
    order_customer: '',
    order_customer_mobile: '',
    order_customer_email: '',
    order_service_date: '',
    order_service: '',
    order_service_sub: '',
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
    order_payment_amount: '',
    order_payment_type: "",
    order_transaction_details: "",
  });

  const showNotification = (message: string, type: 'success' | 'error', persistent = false) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type, persistent }]);
  
    // Only set auto-remove timeout for non-persistent notifications
    if (!persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const validateForm = () => {
    const requiredFields = [
      'order_customer',
      'order_customer_mobile',
      'order_customer_email',
      'order_service_date',
      'order_time',
      'order_address'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        showNotification(`Please fill in the ${field.replace('order_', '').replace('_', ' ')} field`, 'error');
        return false;
      }
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.order_customer_mobile)) {
      showNotification('Please enter a valid 10-digit Indian mobile number', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.order_customer_email)) {
      showNotification('Please enter a valid email address', 'error');
      return false;
    }

    if (cartItems.length === 0) {
      showNotification('Please add at least one service to your cart', 'error');
      return false;
    }

    return true;
  };

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

  React.useEffect(() => {
    const loadScript = (url: string, callback: () => void) => {
      const script = document.createElement("script");
      script.type = "text/javascript";

      script.onload = () => callback();

       (script as any).onreadystatechange = function() {
      if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
        callback();
      }
    };
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    };

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);
  const fetchPricesForAllServices = async (date: string) => {
    if (cartItems.length === 0) return;

    setIsLoadingPrices(true);

    try {

      const serviceRequests = Object.keys(groupedItems).map(async (key) => {
        const group = groupedItems[key];
        const payload = {
          branch_id: branch_id,
          order_service: group.items[0].service_id,
          order_service_sub: group.items[0].service_sub_id || '',
          order_service_date: date
        };

        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-web-service-price-out`,
          payload
        );

        return {
          service_id: group.items[0].service_id,
          service_sub_id: group.items[0].service_sub_id || '',
          prices: response.data.serviceprice || []
        };
      });

      const priceResults = await Promise.all(serviceRequests);


      const updatedCartItems = cartItems.map(item => {
        const priceResult = priceResults.find(result =>
          result.service_id === item.service_id &&
          result.service_sub_id === (item.service_sub_id || '')
        );

        if (priceResult) {
          const matchedPrice = priceResult.prices.find((price: { service_price_for: string; }) =>
            price.service_price_for === item.service_price_for
          );

          if (matchedPrice) {
            return {
              ...item,
              service_price_rate: matchedPrice.service_price_rate,
              service_price_amount: matchedPrice.service_price_amount,
              service_label : matchedPrice.status_label
            };
          }
        }
        return item;
      });


      dispatch(updateCartItems(updatedCartItems));

    } catch (error) {
      console.error('Error fetching prices:', error);
      showNotification('Failed to update prices for selected date', 'error');
    } finally {
      setIsLoadingPrices(false);
    }
  };
  const validateOnlyDigits = (inputtxt: string): boolean => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

 
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "order_service_date") {

      fetchPricesForAllServices(value);
    }

    if ((name === "order_customer_mobile") && !validateOnlyDigits(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error("Razorpay SDK failed to load");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  const handleSubmitPayLater = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const bookingData = cartItems.map(item => ({
      order_service_price_for: item.id,
      order_service_price: item.service_price_rate,
      order_amount: item.service_price_amount,
      order_remarks: formData.order_remarks,
      order_service: item.service_id || '', 
      order_service_sub: item.service_sub_id || '', 
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) =>
          !['order_service_price_for', 'order_service_price', 'order_amount', 'order_service', 'order_service_sub'].includes(key)
        )
      )
    }));
    try {
    

      const finalFormData = {
        booking_data: bookingData,
      };

      const response = await axios.post(
        `${BASE_URL}/api/panel-create-web-booking-out`,
        finalFormData,
      );

      if (response.data.code == 200) {
        showNotification(response.data.msg || "Booking successful", 'success');
        dispatch(clearCart());
        navigate('/payment-success', {
          // state: {
          //   amount: totalPrice,
          //   service_name: cartItems[0]?.service_name,
          //   service_sub_name: cartItems[0]?.service_sub_name,
          //   payment_mode: 'pay_later',
          //   payment_status: 'pending',
          //   booking_status: 'confirmed',
          //   booking_data: bookingData,
          //   selected_prices: cartItems
          // }
          state: {
            amount: totalPrice,
            originalAmount: totalOriginalPrice,
            payment_mode: 'pay_later',
            payment_status: 'pending',
            booking_status: 'confirmed',
            booking_data: bookingData,
            selected_prices: cartItems,
            groupedItems: groupedItems, 
            customer_details: formData 
          }
        });
      } else {
        console.error(response.data.msg || 'Failed to create booking');
        navigate('/booking-failed', {
          // state: {
          //   error: response.data.msg || 'Booking creation failedSS',
          //   amount: totalPrice,
          //   service_name: cartItems[0]?.service_name,
          //   service_sub_name: cartItems[0]?.service_sub_name
          // }
          state: {
            error: response.data.msg || 'Booking creation failed',
            amount: totalPrice,
            originalAmount: totalOriginalPrice,
            service_name: cartItems[0]?.service_name,
            service_sub_name: cartItems[0]?.service_sub_name,
            booking_data: bookingData,
            selected_prices: cartItems,
            groupedItems: groupedItems,
            customer_details: formData
          }
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      navigate('/booking-failed', {
        // state: {
        //   error: error instanceof Error ? error.message : 'Booking failed',
        //   amount: totalPrice,
        //   service_name: cartItems[0]?.service_name,
        //   service_sub_name: cartItems[0]?.service_sub_name
        // }
        state: {
          error: error instanceof Error ? error.message : 'Booking failed',
          amount: totalPrice,
         
          booking_data: bookingData,
          selected_prices: cartItems,
          groupedItems: groupedItems,
          customer_details: formData
        }
      });
    }
  };

  const handleSubmitPayNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      showNotification('Razorpay SDK failed to load', 'error');
      return;
    }

    try {
      const bookingDataTemplate = cartItems.map(item => ({
        order_service_price_for: item.id,
        order_service_price: item.service_price_rate,
        order_amount: item.service_price_amount,
        order_payment_amount: item.service_price_amount,
        order_remarks: formData.order_remarks,
        order_service: item.service_id, 

        order_service_sub: item.service_sub_id || '',
        ...Object.fromEntries(
          Object.entries(formData).filter(([key]) =>
            !['order_service_price_for', 'order_service_price', 'order_amount', 'order_payment_amount', 'order_service', 'order_service_sub'].includes(key)
          )
        )
      }));

    

      // Razorpay options
      const options = {
        key: REACT_APP_RAZARPAY_KEY,
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        name: formData.order_customer || "V3 Care",
        description: `Payment for ${cartItems[0]?.service_name || 'Service'}`,
        config: {
          display: {
            preferences: {
              show_default_blocks: true 
            }
          }
        },
        handler: async function (response: any) {
          const finalBookingData = bookingDataTemplate.map(data => ({
            ...data,
            order_transaction_details: response.razorpay_payment_id,
            order_payment_type: response.razorpay_method || 'Online'
          }));
          try {
          

            const bookingResponse = await axios.post(
              `${BASE_URL}/api/panel-create-web-booking-out`,
              { booking_data: finalBookingData }
            );

            if (bookingResponse.data.code === 200) {
              dispatch(clearCart());
              navigate('/payment-success', {
                // state: {
                //   payment_id: response.razorpay_payment_id,
                //   amount: totalPrice,
                //   service_name: cartItems[0]?.service_name,
                //   service_sub_name: cartItems[0]?.service_sub_name,
                //   payment_mode: response.razorpay_method || 'Online',
                //   payment_status: 'success',
                //   booking_status: 'confirmed',
                //   booking_data: finalBookingData,
                //   selected_prices: cartItems,
                //   payment_details: {
                //     method: response.razorpay_method,
                //     transaction_id: response.razorpay_payment_id,
                //     order_id: response.razorpay_order_id
                //   }
                // }
                state: {
                  payment_id: response.razorpay_payment_id,
                  amount: totalPrice,
                  originalAmount: totalOriginalPrice, 
                  service_name: cartItems[0]?.service_name,
                  service_sub_name: cartItems[0]?.service_sub_name,
                  payment_mode: response.razorpay_method || 'Online',
                  payment_status: 'success',
                  booking_status: 'confirmed',
                  booking_data: finalBookingData,
                  selected_prices: cartItems,
                  groupedItems: groupedItems, 
                  customer_details: formData, 
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
                  originalAmount: totalOriginalPrice, 
                  service_name: cartItems[0]?.service_name,
                  service_sub_name: cartItems[0]?.service_sub_name,
                  payment_mode: response.razorpay_method || 'Online',
                  payment_status: 'success',
                  booking_status: 'failed',
                  booking_data: finalBookingData,
                  selected_prices: cartItems,
                  groupedItems: groupedItems, 
                  customer_details: formData, 
                  payment_details: {
                    method: response.razorpay_method,
                    transaction_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id
                  }
                }
              });
            }
          } catch (error) {
            console.error("Booking creation failed after payment:", error);

            //its not use -- figure out later 
            navigate('/payment-success', {
              state: {
                payment_id: response.razorpay_payment_id,
                amount: totalPrice,
                originalAmount: totalOriginalPrice, 
                service_name: cartItems[0]?.service_name,
                service_sub_name: cartItems[0]?.service_sub_name,
                payment_mode: response.razorpay_method || 'Online',
                payment_status: 'success',
                booking_status: 'failed',
                booking_data: finalBookingData,
                selected_prices: cartItems,
                groupedItems: groupedItems, 
                customer_details: formData, 
                payment_details: {
                  method: response.razorpay_method,
                  transaction_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id
                }
              }
            })
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
          ondismiss: async function () {
            console.log('Payment modal was closed. No payment was made.');
           
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (response: {
        error: {
          description: string;
          code: string;
          source: string;
          metadata: {
            payment_id?: string;
            order_id?: string;
          };
        };
      }) {
        let errorMessage = response.error.description;
       
        const paymentMethod = response.error.source;
       
        if (response.error.code === 'BAD_REQUEST_ERROR') {
          errorMessage = 'Payment failed. Payment could not be completed';
          console.log(errorMessage)
        } else if (response.error.code === 'PAYMENT_FAILED') {
          errorMessage = 'Payment failed. Please try again or use another method';
              console.log(errorMessage)
        }
        showNotification(`Error:${errorMessage} , PaymentId:${response.error.metadata?.payment_id} , Payment_method: ${paymentMethod}`, 'error',true);
        // navigate('/booking-failed', {
        //   state: {
        //     error: errorMessage,
        //     payment_id: response.error.metadata?.payment_id,
        //     payment_method: paymentMethod
        //   }
          
        // });
      }); // handle this 

      rzp.open();

    } catch (error) {
      console.error('Payment initiation failed:', error);
      // navigate('/booking-failed', {
      //   state: {
      //     error: error instanceof Error ? error.message : 'Payment initialization failed',
      //     amount: totalPrice,
      //     originalAmount: totalOriginalPrice,
      //     service_name: cartItems[0]?.service_name,
      //     service_sub_name: cartItems[0]?.service_sub_name,
      //     selected_prices: cartItems,
      //     groupedItems: groupedItems,
      //     customer_details: formData
      //   }
      // });
      showNotification(`Error:${error instanceof Error ? error.message :'Payment initialization failed' }` , 'error',true);
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleContinueShopping = () => {
    navigate('/service');
  };

  return (
    <>
      <DefaultHelmet/>
      <HomeHeader />
      <style>
        {`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}
      </style>
      <div
        style={{
          position: 'fixed',
        top: isSmallScreen ? '105px' : '110px',
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







      <div className="cart-container">
        <div className="container-fluid">
          <div className="row g-2">
            {/* Left Column - Booking Form */}
            <div className="col-lg-8 col-xl-8">
              <div className="booking-form-card">
                <div className="card-header">
                  <h2 className="mb-0">Booking Details</h2>
                </div>

                <div className="card-body">
                  

                  <form className="booking-form">
                    <div className="form-section">
                     

                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Customer Name <span className="required">*</span></label>
                            <input
                              type="text"
                              name="order_customer"
                              value={formData.order_customer}
                              onChange={handleInputChange}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Mobile Number <span className="required">*</span></label>
                            <input
                              type="tel"
                              name="order_customer_mobile"
                              value={formData.order_customer_mobile}
                              onChange={handleInputChange}
                              minLength={10}
                              maxLength={10}
                              placeholder="Your contact number"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Email <span className="required">*</span></label>
                            <input
                              type="email"
                              name="order_customer_email"
                              value={formData.order_customer_email}
                              onChange={handleInputChange}
                              placeholder="Your email address"
                              required
                            />
                          </div>
                        </div>

                      
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Service Date <span className="required">*</span></label>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="date"
                                name="order_service_date"
                                value={formData.order_service_date}
                                onChange={handleInputChange}
                                required
                                disabled={isLoadingPrices}
                                // onClick={(e) => e.currentTarget.showPicker()}
                              />
                              {isLoadingPrices && (
                                <div style={{
                                  position: 'absolute',
                                  right: '10px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  pointerEvents: 'none'
                                }}>
                                  <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Service Time <span className="required">*</span></label>
                            <input
                              type="time"
                              name="order_time"
                              value={formData.order_time}
                              onChange={(e) => setFormData({ ...formData, order_time: e.target.value })}
                              required
                              // onClick={(e) => e.currentTarget.showPicker()}
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label>Address <span className="required">*</span></label>
                            <input
                              type="text"
                              ref={autoCompleteRef}
                              onChange={(event) => setQuery(event.target.value)}
                              placeholder="Search for your address..."
                              value={query}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Flat/Apartment</label>
                            <input
                              type="text"
                              name="order_flat"
                              value={formData.order_flat}
                              onChange={handleInputChange}
                              placeholder="Flat number, building name, etc."
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Landmark</label>
                            <input
                              type="text"
                              name="order_landmark"
                              value={formData.order_landmark}
                              onChange={handleInputChange}
                              placeholder="Nearby landmark"
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label>Remarks</label>
                            <textarea
                              name="order_remarks"
                              value={formData.order_remarks}
                              onChange={handleInputChange}
                              placeholder="Any special instructions or notes"
                              rows={3}
                            ></textarea>
                          </div>
                        </div>

                    
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Cart */}
            <div className="col-lg-4 col-xl-4">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <div className="cart-sidebar">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h2 className="mb-0">Your Cart</h2>
                      {cartItems.length > 0 && (
                        <button
                          className="btn-clear-cart"
                          onClick={() => dispatch(clearCart())}
                        >
                          Clear Cart
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
               
                    {cartItems.length === 0 ? (
                      <div className="empty-cart">
                        <div className="empty-cart-icon">
              
                          <i className="ri-shopping-cart-2-line"></i>
                        </div>
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven&apos;t added any services to your cart yet.</p>
                        <button
                          className="btn-continue-shopping"
                          onClick={handleContinueShopping}
                        >
                          Browse Services
                        </button>
                      </div>
                    ) : (
                      <div className="cart-items">
                           <div className="summary-header">
                            <h4>Order Summary</h4>

                          </div>
                        {Object.entries(groupedItems).map(([key, group]: [string, any]) => (
                          <div className="cart-service-group" key={key}>
                            {/* <div className="group-header">
                              <h4>
                                {group.service_name}
                                {group.service_sub_name && ` - ${group.service_sub_name}`}
                              </h4>
                              <span className="group-total">₹{group.total.toFixed(2)}</span>
                            </div> */}

                            <div className="group-items">

                           

                              {group.items.map((item: any) => (
                                <div className="cart-item" key={item.id}>
                                  <div className="item-details">
                                    <h5>{group.service_name} - {item.service_price_for}</h5>
                                    {group.service_sub_name && (
                                      <p className="service-sub-name">{group.service_sub_name}</p>
                                    )}
                            
{(item.service_label === "Weekend" || item.service_label === "Holiday") && (
  <span
    className="badge bg-warning text-dark rounded-pill"
    style={{ fontSize: '0.6rem', padding: '0.2em 0.5em', lineHeight: '1' }}
  >
    {item.service_label} Price
  </span>
)}




                                  </div>
                                  <div className="item-actions">
                                    {/* Original Price moved to right side, above current price */}
                                    {isLoadingPrices ? (
                                      <p className="original-price">
                                        <span className="price-placeholder" style={{ visibility: 'hidden' }}>
                                          Original Price: ₹{item.service_price_rate}
                                        </span>
                                        <div className="price-loading-spinner">
                                          <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                          </div>
                                        </div>
                                      </p>
                                    ) : (
                                      <p className="original-price">
                                      ₹{item.service_price_rate}
                                      </p>
                                    )}

                                    {/* Price and Remove button in a row */}
                                    <div className="price-remove-row">
                                      {isLoadingPrices ? (
                                        <span className="item-price">
                                          <span className="price-placeholder" style={{ visibility: 'hidden' }}>
                                            ₹{item.service_price_amount}
                                          </span>
                                          <div className="price-loading-spinner">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                              <span className="visually-hidden">Loading...</span>
                                            </div>
                                          </div>
                                        </span>
                                      ) : (
                                        <span className="item-price">₹{item.service_price_amount}</span>
                                      )}
                                      <button
                                        className="btn-remove-item"
                                        onClick={() => handleRemoveItem(item.id)}
                                        disabled={isLoadingPrices}
                                      >
                                    
                                        
                                        <i className="ri-delete-bin-6-line " style={{fontSize:"14px"}}></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="order-summary">
                       

                        <div className="price-summary">
  {totalOriginalPrice === 0 ? (
    <div className="no-price-message" style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
      <span className="savings-message" style={{ color: '#065f46', fontWeight: '600', fontSize: '1rem', display: 'inline-block' }}>
        Your final price will be provided after the inspection.
      </span>
    </div>
  ) : (
    <>
      <div className="price-row">
        <span className="price-label">Total Amount</span>
        <div className="price-values">
          {totalOriginalPrice > 0 && (
            <span className="original-price">₹{totalOriginalPrice.toFixed(2)}</span>
          )}
          <span className="current-price">₹{totalPrice.toFixed(2) || '0'}</span>
        </div>
      </div>

      {totalOriginalPrice > 0 && (
        <div className="savings-row">
          <div className="savings-content">
            <span className="discount-badge">
              {Math.round((1 - (totalPrice / totalOriginalPrice)) * 100)}% OFF
            </span>
            <span className="savings-message">
              Congrats! 🎉 You Saved ₹{(totalOriginalPrice - totalPrice).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </>
  )}
</div>
                           <div className="col-12 form-actions">
                           {totalOriginalPrice > 0 && (
                          <button
                            type="button"
                            className="btn btn-pay-now"
                            onClick={handleSubmitPayNow}
                            disabled={cartItems.length === 0 || isLoadingPrices}
                          >
                            Pay Now
                          </button>
                             )}
                          <button
                            type="button"
                            className="btn btn-pay-later"
                            onClick={handleSubmitPayLater}
                            disabled={cartItems.length === 0 || isLoadingPrices} 
                          >
                                  {totalOriginalPrice === 0 ? 'Book Inspection' : 'Pay Later'}
                          </button>
                        </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </StickyBox>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;