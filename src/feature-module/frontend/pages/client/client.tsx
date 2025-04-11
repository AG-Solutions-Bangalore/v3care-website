import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';

const Client = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Separate partner images with different logos
  const partners = [
    { src: "assets/img/partner/partner40.jpg", alt: "Microsoft" },
    { src: "assets/img/partner/partner40.jpg", alt: "Google" },
    { src: "assets/img/partner/partner40.jpg", alt: "Amazon Web Services" },
    { src: "assets/img/partner/partner40.jpg", alt: "IBM" },
    { src: "assets/img/partner/partner40.jpg", alt: "Oracle" },
    { src: "assets/img/partner/partner40.jpg", alt: "Cisco" },
    { src: "assets/img/partner/partner40.jpg", alt: "Intel" },
    { src: "assets/img/partner/partner40.jpg", alt: "Dell" },
    { src: "assets/img/partner/partner40.jpg", alt: "HP" },
    { src: "assets/img/partner/partner40.jpg", alt: "SAP" },
    { src: "assets/img/partner/partner40.jpg", alt: "Salesforce" },
    { src: "assets/img/partner/partner40.jpg", alt: "Adobe" },
    { src: "assets/img/partner/partner40.jpg", alt: "VMware" },
    { src: "assets/img/partner/partner40.jpg", alt: "Red Hat" },
  ];

  // Settings for the carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <>
      <BreadCrumb title='Our Partners' item1='Home' item2='Client' />
      
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content container-fluid pb-5">
          {/* Header Section */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-lg-10 text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold text-dark mb-3">Our Valued Partners</h2>
              <p className="lead text-muted mb-4">
                We collaborate with industry leaders and innovators to deliver exceptional services and solutions.
              </p>
              <div className="border-bottom mx-auto" style={{ width: '100px', borderColor: 'var(--primary)' }}></div>
            </div>
          </div>
          
          {/* Partners Carousel */}
          <div className="row mb-5" data-aos="fade-up" data-aos-delay="100">
            <div className="col-12">
              <Slider {...sliderSettings} className="owl-carousel categories-slider-seven">
                {partners.map((partner, index) => (
                  <div key={index} className="px-2">
                    <div className="card border-0 bg-transparent">
                      <div className="card-body p-3 d-flex align-items-center justify-content-center">
                        <div className="partner-logo-container" style={{ height: '80px' }}>
                          <ImageWithBasePath
                            src={partner.src}
                            alt={partner.alt}
                            className="img-fluid h-100 w-auto opacity-75 hover-opacity-100 transition-all"
                            style={{ objectFit: 'contain', filter: 'grayscale(100%)', transition: 'all 0.3s ease' }}
                       
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Partners Grid */}
          <div className="row g-4 mb-5" data-aos="fade-up" data-aos-delay="200">
            {partners.map((partner, index) => (
              <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={index}>
                <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                  <div className="card-body p-3 d-flex align-items-center justify-content-center">
                    <div className="partner-logo-container" style={{ height: '80px' }}>
                      <ImageWithBasePath
                        src={partner.src}
                        alt={partner.alt}
                        className="img-fluid h-100 w-auto opacity-75 hover-opacity-100 transition-all"
                        style={{ objectFit: 'contain', filter: 'grayscale(100%)', transition: 'all 0.3s ease' }}
                       
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="row mt-5" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <div className="bg-light rounded-3 p-5 text-center">
                <h3 className="fw-bold mb-3">Join Our Partner Network</h3>
                <p className="text-muted mb-4">
                  Become part of our growing ecosystem and unlock new business opportunities.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="#" className="btn btn-primary btn-lg px-4 py-2">
                    Become a Partner
                  </Link>
                  <Link to="#" className="btn btn-outline-primary btn-lg px-4 py-2">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Client;