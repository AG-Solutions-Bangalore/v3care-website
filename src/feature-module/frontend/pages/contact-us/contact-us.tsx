import React, { useState } from 'react';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { Dropdown } from 'primereact/dropdown';
const ContactUs = () => {
  const [selectedValue2, setSelectedValue2] = useState(null);
  
  const value2 = [
    { name: 'Select Service' },
    { name: 'Car Repair' },
    { name: 'House Cleaning' },
    { name: 'Interior Designing' },
  ];
  return (
    <>
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
            {/* <div className="col-md-6 col-lg-4 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <span className="rounded-circle">
                      <i className="ti ti-map-pin text-primary" />
                    </span>
                    <div>
                      <h6 className="fs-18 mb-1">Address</h6>
                      <p className="fs-14">
                      V3 CARE # 2296, 24th Main Road, 16th Cross, HSR Layout, Sector 1, Bangalore – 560 102 Land Mark : Opposite Bangalore One
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
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
              <form >
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="email"
                          placeholder="Your Email Address"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Your Phone Number"
                        />
                      </div>
                    </div>
                    {/* <div className="mb-3">
                    <Dropdown
                          value={selectedValue2}
                          onChange={(e) => setSelectedValue2(e.value)}
                          options={value2}
                          optionLabel="name"
                          placeholder="Select Service"
                          className="select w-100"
                        />
                    </div> */}
                    <div className="mb-3">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          placeholder="Type Message"
                          id="floatingTextarea"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 submit-btn">
                    <button
                      className="btn btn-dark d-flex align-items-center "
                      type="button"
                    >
                      Send Message
                      <i className="feather icon-arrow-right-circle ms-2" />
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
