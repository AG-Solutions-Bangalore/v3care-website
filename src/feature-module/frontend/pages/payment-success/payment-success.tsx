import React, { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import HomeHeader from '../../home/header/home-header';
import './PaymentSuccess.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import html2pdf from "html2pdf.js";
const PaymentSuccess = () => {
  const { state } = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);
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

 const downloadReceipt = () => {
        const element = receiptRef.current;
        if (!element) return;
      
        const customerName = customer?.order_customer || "Customer";
        const filename = `${customerName}_Receipt_${payment_id || Date.now()}.pdf`;
      
        const style = document.createElement("style");
        style.textContent = `
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          body {
            font-size: 12px !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .payment-success-actions, .print-hide {
            display: none !important;
          }
          .payment-success-receipt {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .payment-success-receipt-table {
            width: 100% !important;
          }
          .payment-success-receipt-section {
            page-break-inside: avoid;
          }
        `;
        document.head.appendChild(style);
      
        const options = {
          margin: [5, 5, 5, 5],
          filename: filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };
      
        html2pdf()
          .set(options)
          .from(element)
          .toPdf()
          .get("pdf")
          .then((pdf: { internal: { getNumberOfPages: () => any; pageSize: { getWidth: () => number; getHeight: () => number; }; }; setPage: (arg0: number) => void; setFontSize: (arg0: number) => void; setTextColor: (arg0: number) => void; text: (arg0: string, arg1: number, arg2: number) => void; save: (arg0: string) => void; }) => {
            const totalPages = pdf.internal.getNumberOfPages();
      
            // Add page numbers to each page
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.setTextColor(150);
              pdf.text(
                `Page ${i} of ${totalPages}`,
                pdf.internal.pageSize.getWidth() - 20,
                pdf.internal.pageSize.getHeight() - 10
              );
            }
      
            pdf.save(filename);
            document.head.removeChild(style);
          });
      };

  
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

          <div className="payment-success-receipt" ref={receiptRef}>
            {/* Company Header */}
            <div className="payment-success-receipt-header" >
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
              onClick={downloadReceipt}
            >
              <i className="fas fa-print payment-success-btn-icon"></i>Download Receipt
            </button>
            </>
          )}
          {(payment_status === 'failed' || booking_status === 'failed') && (
            <a  href="tel:+919880778585" className="payment-success-btn payment-success-btn-danger">
              <i className="fas fa-headset payment-success-btn-icon"></i>Contact Support
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;