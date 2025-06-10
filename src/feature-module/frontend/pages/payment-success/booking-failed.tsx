import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import HomeHeader from '../../home/header/home-header';
import './BookingFailed.css';

interface BookingData {
  order_customer: string;
  order_customer_mobile: string;
  order_customer_email: string;
  order_address: string;
  order_flat?: string;
  order_building?: string;
  order_landmark?: string;
  order_service_date?: string;
  order_time?: string;
  order_remarks?: string;
  [key: string]: any;
}

interface LocationState {
  error?: string;
  booking_id?: string;
  payment_id?: string;
  payment_status?: 'failed' | 'pending' | 'success';
  booking_status?: 'failed' | 'confirmed';
  booking_data?: BookingData[];
  service_name?: string;
  service_sub_name?: string;
  amount?: number;
  originalAmount?: number;
  payment_method?: string;
  transaction_id?: string;
  selected_prices?: any[];
  groupedItems?: any;
  customer_details?: any;
}

const BookingFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || {};
  
  const {
    error = 'We encountered an issue processing your booking.',
    booking_id,
    payment_id,
    payment_status = 'failed',
    booking_status = 'failed',
    booking_data,
    service_name,
    service_sub_name,
    amount = 0,
    originalAmount = amount,
    payment_method,
    transaction_id,
    selected_prices,
    groupedItems,
    customer_details
  } = state;

  const booking = customer_details || (Array.isArray(booking_data) ? booking_data[0] : booking_data);

  const getStatusDetails = () => {
    if (payment_status === 'failed' && booking_status === 'failed') {
      return {
        icon: 'fa-times-circle',
        title: 'Booking Failed',
        subtitle: 'We couldn\'t process your booking or payment.',
        className: 'booking-failed-danger'
      };
    } else if (payment_status === 'failed') {
      return {
        icon: 'fa-exclamation-triangle',
        title: 'Payment Failed',
        subtitle: 'Your booking is pending due to payment failure.',
        className: 'booking-failed-warning'
      };
    } else {
      return {
        icon: 'fa-exclamation-circle',
        title: 'Booking Failed',
        subtitle: 'Payment succeeded but booking confirmation failed.',
        className: 'booking-failed-info'
      };
    }
  };

  const status = getStatusDetails();

 

  return (
    <>
      <HomeHeader />
      <div className="booking-failed-container">
        {/* Status Header */}
        <div className={`booking-failed-status-card ${status.className}`}>
          <i className={`fas ${status.icon} booking-failed-status-icon`}></i>
          <h3>{status.title}</h3>
          <p>{status.subtitle}</p>
          {error && <p className="booking-failed-error-detail">{error}</p>}
        </div>


        {/* Actions */}
        <div className="booking-failed-actions">
        
          
         

          <div className="booking-failed-support-info">
            <h4>Need immediate assistance?</h4>
            <div className="booking-failed-support-buttons">
              <a href="tel:+919880778585" className="booking-failed-btn booking-failed-btn-danger">
                <i className="fas fa-phone-alt booking-failed-btn-icon"></i>Call Support
              </a>
              <a 
                href={`mailto:info@v3care.com?subject=Booking%20Issue%20${booking_id || ''}&body=Booking ID: ${booking_id || 'N/A'}%0APayment ID: ${payment_id || 'N/A'}%0AIssue: ${encodeURIComponent(error)}`} 
                className="booking-failed-btn booking-failed-btn-outline"
              >
                <i className="fas fa-envelope booking-failed-btn-icon"></i>Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingFailed;