import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import HomeHeader from '../../home/header/home-header';

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
  payment_method?: string;
  transaction_id?: string;
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
    amount,
    payment_method,
    transaction_id
  } = state;

 
  const booking = Array.isArray(booking_data) ? booking_data[0] : booking_data;

  const renderStatusBanner = () => {
    let icon, title, subtitle, bgColor, textColor;
    
    if (payment_status === 'failed' && booking_status === 'failed') {
      icon = 'fa-times-circle';
      title = 'Booking Failed';
      subtitle = 'We couldn\'t process your booking or payment.';
      bgColor = 'bg-danger-light';
      textColor = 'text-danger';
    } else if (payment_status === 'failed') {
      icon = 'fa-exclamation-triangle';
      title = 'Payment Failed';
      subtitle = 'Your booking is pending due to payment failure.';
      bgColor = 'bg-warning-light';
      textColor = 'text-warning';
    } else {
      icon = 'fa-exclamation-circle';
      title = 'Booking Failed';
      subtitle = 'Payment succeeded but booking confirmation failed.';
      bgColor = 'bg-info-light';
      textColor = 'text-info';
    }

    return (
      <div className={`${bgColor} p-4 rounded-lg mb-4`}>
        <div className="d-flex align-items-center">
          <i className={`fas ${icon} ${textColor} fs-2 me-3`}></i>
          <div>
            <h3 className={`${textColor} mb-1`}>{title}</h3>
            <p className="mb-0">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderAlert = () => {
    if (payment_status === 'failed' && booking_status === 'confirmed') {
      return (
        <div className="alert alert-warning mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          Please complete your payment within 24 hours to avoid cancellation.
        </div>
      );
    }

    return (
      <div className="alert alert-danger mb-4">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error || 'An unexpected error occurred during processing.'}
      </div>
    );
  };

  const renderDetailsCard = () => {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <tbody>
                {service_name && (
                  <tr>
                    <td width="30%" className="text-muted fw-medium">Service</td>
                    <td>
                      {service_name}
                      {service_sub_name && ` (${service_sub_name})`}
                    </td>
                  </tr>
                )}
                
                {booking?.order_service_date && (
                  <tr>
                    <td className="text-muted fw-medium">Service Date</td>
                    <td>
                      {booking.order_service_date} 
                      {booking.order_time && ` at ${booking.order_time}`}
                    </td>
                  </tr>
                )}
                
                {booking?.order_customer && (
                  <tr>
                    <td className="text-muted fw-medium">Customer</td>
                    <td>{booking.order_customer}</td>
                  </tr>
                )}
                
                {booking?.order_customer_mobile && (
                  <tr>
                    <td className="text-muted fw-medium">Mobile</td>
                    <td>{booking.order_customer_mobile}</td>
                  </tr>
                )}
                
                {booking_id && (
                  <tr>
                    <td className="text-muted fw-medium">Booking Reference</td>
                    <td>{booking_id}</td>
                  </tr>
                )}
                
                {payment_id && (
                  <tr>
                    <td className="text-muted fw-medium">Transaction ID</td>
                    <td className="text-break">{payment_id}</td>
                  </tr>
                )}
                
                <tr>
                  <td className="text-muted fw-medium">Payment Status</td>
                  <td>
                    <span className={`badge ${
                      payment_status === 'success' ? 'bg-success' : 
                      payment_status === 'pending' ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {payment_status === 'success' ? 'Paid' : 
                      payment_status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </td>
                </tr>
                
                <tr>
                  <td className="text-muted fw-medium">Booking Status</td>
                  <td>
                    <span className={`badge ${
                      booking_status === 'confirmed' ? 'bg-success' : 'bg-danger'
                    }`}>
                      {booking_status === 'confirmed' ? 'Confirmed' : 'Failed'}
                    </span>
                  </td>
                </tr>
               
                
                {amount && (
                  <tr>
                    <td className="text-muted fw-medium">Amount</td>
                    <td className="fw-bold">₹{amount.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceList = () => {
    if (!booking_data) return null;
    
    const services = Array.isArray(booking_data) ? booking_data : [booking_data];

    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light border-bottom">
          <h6 className="mb-0">Selected Services</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Service</th>
                  <th className="text-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service: any, index: number) => (
                  <tr key={index} className={index < services.length - 1 ? 'border-bottom' : ''}>
                    <td>{service.order_service_price_for || service.service_price_for}</td>
                    <td className="text-end">₹{service.order_amount || service.service_price_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAddress = () => {
    if (!booking?.order_address) return null;

    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light border-bottom">
          <h6 className="mb-0">Service Address</h6>
        </div>
        <div className="card-body">
          <p className="mb-1">
            {booking.order_address}
            {booking.order_flat && `, ${booking.order_flat}`}
            {booking.order_building && `, ${booking.order_building}`}
            {booking.order_landmark && ` (Near ${booking.order_landmark})`}
          </p>
          {booking.order_remarks && (
            <div className="mt-2 pt-2 border-top">
              <small className="text-muted">Customer Remarks:</small>
              <p className="mb-0">{booking.order_remarks}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActions = () => {
    return (
      <div className="d-grid gap-2">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-primary"
        >
          <i className="fas fa-arrow-rotate-left me-2"></i> Try Again
        </button>
        
        <Link 
          to="/contact" 
          state={{
            presetSubject: `Booking Issue: ${booking_id || 'No Reference'}`,
            presetMessage: `I encountered an issue with my booking:\n\nBooking ID: ${booking_id || 'N/A'}\nPayment ID: ${payment_id || 'N/A'}\nError: ${error}`
          }}
          className="btn btn-outline-danger"
        >
          <i className="fas fa-headset me-2"></i> Contact Support
        </Link>

        <Link to="/" className="btn btn-link text-muted">
          <i className="fas fa-home me-2"></i> Back to Home
        </Link>
      </div>
    );
  };

  return (
    <>
      <HomeHeader  />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-6">
                {renderStatusBanner()}
                {renderAlert()}
                {renderDetailsCard()}
                {renderServiceList()}
                {renderAddress()}
                {renderActions()}

                <div className="text-center mt-4 pt-3 border-top">
                  <h6 className="mb-3">Need immediate assistance?</h6>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <a href="tel:+911234567890" className="btn btn-outline-danger">
                      <i className="fas fa-phone-alt me-2"></i> Call Support
                    </a>
                    <a 
                      href={`mailto:support@agscare.com?subject=Booking%20Issue%20${booking_id || ''}&body=Booking ID: ${booking_id || 'N/A'}%0APayment ID: ${payment_id || 'N/A'}%0AIssue: ${encodeURIComponent(error)}`} 
                      className="btn btn-outline-primary"
                    >
                      <i className="fas fa-envelope me-2"></i> Email Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingFailed;