import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import HomeHeader from '../../home/header/home-header';

const PaymentSuccess = () => {
  const { state } = useLocation();
  const {
    payment_id,
    amount,
    service_name,
    service_sub_name,
    payment_mode,
    payment_status = 'success',
    booking_status = 'confirmed',
    booking_data,
    selected_prices,
    payment_details
  } = state || {};

 
  const booking = Array.isArray(booking_data) ? booking_data[0] : booking_data;

  const renderStatusBanner = () => {
    let icon, title, subtitle, bgColor, textColor;
    
    if (payment_status === 'success' && booking_status === 'confirmed') {
      icon = 'fa-check-circle';
      title = 'Booking Confirmed!';
      subtitle = 'Your payment was successful and booking is confirmed.';
      bgColor = 'bg-success-light';
      textColor = 'text-success';
    } else if (payment_status === 'failed' && booking_status === 'confirmed') {
      icon = 'fa-exclamation-triangle';
      title = 'Booking Confirmed - Payment Pending';
      subtitle = 'Your booking is confirmed but payment is pending.';
      bgColor = 'bg-warning-light';
      textColor = 'text-warning';
    } else if (payment_status === 'success' && booking_status === 'failed') {
      icon = 'fa-exclamation-circle';
      title = 'Payment Successful - Booking Failed';
      subtitle = 'Payment was successful but booking confirmation failed.';
      bgColor = 'bg-danger-light';
      textColor = 'text-danger';
    } else {
      icon = 'fa-check-circle';
      title = 'Booking Confirmed';
      subtitle = 'You will pay later for this service.';
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

    if (payment_status === 'success' && booking_status === 'failed') {
      return (
        <div className="alert alert-danger mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Please contact support with your payment ID: <strong>{payment_id}</strong>
        </div>
      );
    }

    return null;
  };

  const renderDetailsCard = () => {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <td width="30%" className="text-muted fw-medium">Service</td>
                  <td>
                    {service_name}
                    {service_sub_name && ` (${service_sub_name})`}
                  </td>
                </tr>
                
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
    
    const selectedSer = Array.isArray(selected_prices) ? selected_prices : [selected_prices];
  

   



    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light border-bottom">
          <h6 className="mb-0">Services Booked</h6>
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
                {selectedSer.map((service: any, index: number) => (
                  <tr key={index} className={index < services.length - 1 ? 'border-bottom' : ''}>
                    <td>{service.service_price_for}</td>
                    <td className="text-end">₹{service.service_price_amount}</td>
                  </tr>
                ))}
                {amount && (
                  <tr className="border-top">
                    <td className="fw-bold">Total</td>
                    <td className="text-end fw-bold">₹{amount.toFixed(2)}</td>
                  </tr>
                )}
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
        <Link to="/service" className="btn btn-primary">
          <i className="fas fa-home me-2"></i> Back to Service
        </Link>
        
        {(payment_status === 'failed' || booking_status === 'failed') && (
          <Link to="/contact" className="btn btn-outline-danger">
            <i className="fas fa-headset me-2"></i> Contact Support
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <HomeHeader type={8} />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;