import React, { useState } from 'react';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import HomeHeader from '../../home/header/home-header';
import { BASE_URL } from '../../../baseConfig/BaseUrl';
import axios from 'axios';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    mobile_no: '',
    email_id: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    fullname: '',
    mobile_no: '',
    email_id: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean, message: string} | null>(null);

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
   
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

 
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullname: '',
      mobile_no: '',
      email_id: '',
      description: ''
    };

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Name is required';
      valid = false;
    }

    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Please enter a valid 10-digit phone number';
      valid = false;
    }

    if (!formData.email_id.trim()) {
      newErrors.email_id = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)) {
      newErrors.email_id = 'Please enter a valid email address';
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/panel-create-web-enquiry-out`, {
        fullname: formData.fullname,
        mobile_no: formData.mobile_no,
        email_id: formData.email_id,
        description: formData.description
      });

      if (response.status === 200) {
        setSubmitStatus({ success: true, message: 'Thank you! Your message has been sent successfully.' });
       
        setFormData({
          fullname: '',
          mobile_no: '',
          email_id: '',
          description: ''
        });
      } else {
        setSubmitStatus({ 
          success: false, 
          message: response.data.message || 'Failed to send message. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
     <HomeHeader type={8} />
     <BreadCrumb title='Contact Us' item1='Home' item2='Contact Us'/>
     <div className="page-wrapper">
  <div className="content">
    <div className="container">
      <div className="contacts">
        <div className="contacts-overlay-img d-none d-lg-block">
          <ImageWithBasePath src="assets/img/bg/bg-07.png" alt="img" className="img-fluid" />
        </div>
        <div className="contacts-overlay-sm d-none d-lg-block">
          <ImageWithBasePath src="assets/img/bg/bg-08.png" alt="img" className="img-fluid" />
        </div>
        {/* Contact Details */}
        <div className="contact-details">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <span className="rounded-circle">
                      <i className="ti ti-phone text-primary" />
                    </span>
                    <div>
                      <h6 className="fs-18 mb-1">Phone Number</h6>
                      <p className="fs-14">+91 98807 78585</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <span className="rounded-circle">
                      <i className="ti ti-mail text-primary" />
                    </span>
                    <div>
                      <h6 className="fs-18 mb-1">Email Address</h6>
                      <p className="fs-14">info@v3care.in</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Contact Details */}
        {/* Get In Touch */}
        <div className="row">
          <div className="col-md-6 d-flex align-items-center">
            <div className="contact-img flex-fill">
            <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <span className="rounded-circle">
                      <i className="ti ti-map-pin text-primary" />
                    </span>
                    <div>
                      <h6 className="fs-18 mb-1">Bangalore Address</h6>
                      <p className="fs-14">
                      V3 CARE # 2296, 24th Main Road, 16th Cross, HSR Layout, Sector 1, Bangalore – 560 102 Land Mark : Opposite Bangalore One
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <span className="rounded-circle">
                      <i className="ti ti-map-pin text-primary" />
                    </span>
                    <div>
                      <h6 className="fs-18 mb-1">Hyderabad Address</h6>
                      <p className="fs-14">
                      V3 CARE H. No. 1-101, 1st Floor, Old Hapeezpet, Miyapur, Hyderabad, Telengana- 500 049
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <span className="rounded-circle">
                      <i className="ti ti-map-pin text-primary" />
                    </span>
                    <div>
                      <h6 className="fs-18 mb-1">Gurugram Address</h6>
                      <p className="fs-14">
                      V3 CARE Opposite Raj Bhawan Main Market H no 384, near End of Fly over, Sukhrali, Sector 17, Gurugram, Haryana 122001
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <span className="rounded-circle">
                      <i className="ti ti-map-pin text-primary" />
                    </span>
                    <div>
                      <h6 className="fs-18 mb-1">Pune Address</h6>
                      <p className="fs-14">
                      V3 CARE Thite Nagar, Chandan Nagar, Pune, Maharashtra 411014, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="contact-queries flex-fill">
              <h2>Get In Touch</h2>
              {submitStatus && (
                      <div className={`alert alert-${submitStatus.success ? 'success' : 'danger'}`}>
                        {submitStatus.message}
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <div className="form-group">
                              <input
                                className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                                type="text"
                                name="fullname"
                                placeholder="Your Name"
                                value={formData.fullname}
                                onChange={handleChange}
                              />
                              {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <div className="form-group">
                              <input
                                className={`form-control ${errors.email_id ? 'is-invalid' : ''}`}
                                type="email"
                                name="email_id"
                                placeholder="Your Email Address"
                                value={formData.email_id}
                                onChange={handleChange}
                              />
                              {errors.email_id && <div className="invalid-feedback">{errors.email_id}</div>}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <div className="form-group">
                              <input
                                className={`form-control ${errors.mobile_no ? 'is-invalid' : ''}`}
                                type="text"
                                name="mobile_no"
                                placeholder="Your Phone Number"
                                value={formData.mobile_no}
                                onChange={handleChange}
                              />
                              {errors.mobile_no && <div className="invalid-feedback">{errors.mobile_no}</div>}
                            </div>
                          </div>
                        
                          <div className="mb-3">
                            <div className="form-group">
                              <textarea
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                name="description"
                                placeholder="Type Message"
                                id="floatingTextarea"
                                value={formData.description}
                                onChange={handleChange}
                              />
                              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 submit-btn">
                          <button
                            className="btn btn-dark d-flex align-items-center"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Message
                                <i className="feather icon-arrow-right-circle ms-2" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
            </div>
          </div>
        </div>
        {/* /Get In Touch */}
      </div>
    </div>
  </div>
  {/* Map */}
  <div className="map-grid">
    <iframe
   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.909593458343!2d77.633275!3d12.913531899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1483494c719f%3A0xd95476be691e0257!2sV3%20CARE!5e0!3m2!1sen!2sin!4v1744352225780!5m2!1sen!2sin"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="contact-map"
    />
  </div>
  {/* /Map */}
</div>
    </>
  );
};

export default ContactUs;
