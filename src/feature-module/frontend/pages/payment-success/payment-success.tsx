import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import HomeHeader from '../../home/header/home-header';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const { state } = useLocation();
  const {
    payment_id,
    amount,
    originalAmount,
    service_name,
    service_sub_name,
    payment_mode,
    payment_status = 'success',
    booking_status = 'confirmed',
    booking_data,
    selected_prices,
    groupedItems,
    customer_details,
    payment_details
  } = state || {};

  const booking = Array.isArray(booking_data) ? booking_data[0] : booking_data;
  const customer = customer_details || booking;

  const getStatusDetails = () => {
    if (payment_status === 'success' && booking_status === 'confirmed') {
      return {
        icon: 'fa-check-circle',
        title: 'Booking Confirmed!',
        subtitle: 'Your payment was successful and booking is confirmed.',
        className: 'payment-success-success'
      };
    } else if (payment_status === 'failed' && booking_status === 'confirmed') {
      return {
        icon: 'fa-exclamation-triangle',
        title: 'Booking Confirmed - Payment Pending',
        subtitle: 'Your booking is confirmed but payment is pending.',
        className: 'payment-success-warning'
      };
    } else if (payment_status === 'success' && booking_status === 'failed') {
      return {
        icon: 'fa-exclamation-circle',
        title: 'Payment Successful - Booking Failed',
        subtitle: 'Payment was successful but booking confirmation failed.',
        className: 'payment-success-danger'
      };
    } else {
      return {
        icon: 'fa-check-circle',
        title: 'Booking Confirmed',
        subtitle: 'You will pay later for this service.',
        className: 'payment-success-primary'
      };
    }
  };

  const status = getStatusDetails();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  // Check if there are no services
  const hasNoServices = !groupedItems || Object.keys(groupedItems).length === 0;



  
  return (
    <>
      <HomeHeader />
      <div className="payment-success-container">
        {/* Status Header */}
        {/* <div className={`payment-success-status-card ${status.className}`}>
          <i className={`fas ${status.icon} payment-success-status-icon`}></i>
          <h3>{status.title}</h3>
          <p>{status.subtitle}</p>
        </div> */}

        {hasNoServices ? (
          <div className="payment-success-no-services">
            <div className="payment-success-receipt">
            

              <div className="payment-success-receipt-section">
                <div className="payment-success-no-services-content">
                  <i className="fas fa-exclamation-circle payment-success-no-services-icon"></i>
                  <h3>No Services Selected</h3>
                  <p>You haven not selected any services yet.</p>
                  <Link to="/service" className="payment-success-btn payment-success-btn-primary">
                    <i className="fas fa-plus-circle payment-success-btn-icon"></i>Select Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
          <div className={`payment-success-status-card ${status.className}`}>
          <i className={`fas ${status.icon} payment-success-status-icon`}></i>
          <h3>{status.title}</h3>
          <p>{status.subtitle}</p>
        </div>

          <div className="payment-success-receipt">
            {/* Company Header */}
            <div className="payment-success-receipt-header">
              <h2 className="payment-success-receipt-title">V3 CARE</h2>
              <p className="payment-success-receipt-subtitle">Professional Cleaning & Facility Services</p>
              <p className="payment-success-receipt-subtitle">H. No. 2296, 24th Main Road, HSR Layout, Bangalore - 560102</p>
            </div>

            {/* Transaction Info */}
            <div className="payment-success-receipt-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {payment_id && <p>Transaction ID: {payment_id}</p>}
                </div>
                <div>
                  <span className={`payment-success-receipt-badge ${
                    booking_status === 'confirmed' ? 'payment-success-badge-success' : 'payment-success-badge-danger'
                  }`}>
                    {booking_status === 'confirmed' ? 'CONFIRMED' : 'FAILED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Service Details */}
            <div className="payment-success-receipt-section">
              <table className="payment-success-receipt-table">
                <tbody>
                  <tr>
                    <td style={{ width: '50%', borderRight: '1px solid #eee' }}>
                      <div className="payment-success-receipt-section-title">CUSTOMER DETAILS</div>
                      <p style={{ fontWeight: 'bold' }}>{customer?.order_customer}</p>
                      <p style={{ color: '#666' }}>{customer?.order_customer_mobile}</p>
                      <p style={{ color: '#666' }}>{customer?.order_customer_email}</p>
                    </td>
                    <td style={{ paddingLeft: '15px' }}>
                      <div className="payment-success-receipt-section-title">SERVICE DETAILS</div>
                      <p>
                        <i className="fas fa-calendar-alt" style={{ marginRight: '5px', color: '#666' }}></i>
                        {customer?.order_service_date && (
                          <>
                            {formatDate(customer.order_service_date)}
                            {customer?.order_time && ` at ${formatTime(customer.order_time)}`}
                          </>
                        )}
                      </p>
                      <p>
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '5px', color: '#666' }}></i>
                        {customer?.order_address}
                        {customer?.order_flat && `, ${customer.order_flat}`}
                        {customer?.order_landmark && ` (Near ${customer.order_landmark})`}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Services Table */}
            <div className="payment-success-receipt-section" style={{ padding: 0 }}>
              <table className="payment-success-receipt-table">
                <thead>
                  <tr>
                    <th>SERVICE</th>
                    <th style={{ textAlign: 'right' }}>RATE</th>
                    <th style={{ textAlign: 'right' }}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedItems && Object.entries(groupedItems).map(([key, group]: [string, any]) => (
                    <React.Fragment key={key}>
                      <tr className="payment-success-group-header">
                        <td colSpan={1}>
                          <i className="fas fa-tools" style={{ marginRight: '5px', color: '#2C3E50' }}></i>
                          {group.service_name}
                          {group.service_sub_name && ` - ${group.service_sub_name}`}
                        </td>
                      </tr>
                      {group.items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>
                            {item.service_price_for}
                            {item.service_label !== "Normal" && (
                              <span className="payment-success-receipt-badge payment-success-badge-warning" style={{ marginLeft: '5px' }}>
                                {item.service_label} Price
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>₹{item.service_price_rate}</td>
                          <td style={{ textAlign: 'right' }}>₹{item.service_price_amount}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="payment-success-receipt-section" style={{ backgroundColor: '#f5f5f5' }}>
              <table className="payment-success-receipt-table">
                <tbody>
                  <tr>
                    <td style={{ width: '50%', borderRight: '1px solid #eee' }}>
                      <div className="payment-success-receipt-section-title">PAYMENT STATUS</div>
                      <span className={`payment-success-receipt-badge ${
                        payment_status === 'success' ? 'payment-success-badge-success' : 
                        payment_status === 'pending' ? 'payment-success-badge-warning' : 'payment-success-badge-danger'
                      }`}>
                        {payment_status === 'success' ? 'PAID' : 
                        payment_status === 'pending' ? 'PENDING' : 'FAILED'}
                      </span>
                      {payment_mode && (
                        <p style={{ color: '#666', marginTop: '5px' }}>Via {payment_mode}</p>
                      )}
                    </td>
                    <td style={{ paddingLeft: '15px' }}>
                      <div className="payment-success-receipt-section-title">PAYMENT SUMMARY</div>
                      <div className="payment-success-amount-row">
                        <span>Total Amount:</span>
                        <span style={{ fontWeight: 'bold' }}>₹{originalAmount?.toFixed(2)}</span>
                      </div>
                      {originalAmount > amount && (
                        <div className="payment-success-amount-row">
                          <span>Discount:</span>
                          <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                            -₹{(originalAmount - amount).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="payment-success-amount-total">
                        <div className="payment-success-amount-row">
                          <span style={{ fontWeight: 'bold' }}>Amount Paid:</span>
                          <span style={{ fontWeight: 'bold', color: '#2C3E50' }}>₹{amount?.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Customer Remarks */}
            {customer?.order_remarks && (
              <div className="payment-success-receipt-section">
                <div className="payment-success-receipt-section-title">CUSTOMER REMARKS</div>
                <div className="payment-success-customer-remarks">{customer.order_remarks}</div>
              </div>
            )}
          </div>
          </>
        )}

        {/* Actions */}
        <div className="payment-success-actions">
        {!hasNoServices && (
          <>
          <Link to="/service" className="payment-success-btn payment-success-btn-primary">
            <i className="fas fa-home payment-success-btn-icon"></i>Back to Services
          </Link>
      
            <button 
              className="payment-success-btn payment-success-btn-outline"
              onClick={() => window.print()}
            >
              <i className="fas fa-print payment-success-btn-icon"></i>Print Receipt
            </button>
            </>
          )}
          {(payment_status === 'failed' || booking_status === 'failed') && (
            <Link to="/contact" className="payment-success-btn payment-success-btn-danger">
              <i className="fas fa-headset payment-success-btn-icon"></i>Contact Support
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;