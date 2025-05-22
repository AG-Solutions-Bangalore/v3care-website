import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import {BASE_URL, CLIENT_IMAGE_URL, NO_IMAGE_URL} from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';

interface Client {
  client_name: string;
  client_image: string;
}

const Client = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-clients-out`);
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setError('Failed to load partners. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imageName: string) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return `${CLIENT_IMAGE_URL}/${imageName}`;
  };



  return (
    <>
     <HomeHeader type={8} />
      <BreadCrumb title='Our Partners' item1='Home' item2='Client' />
      
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content container-fluid pb-5">
         
          
          {/* Loading State */}
          {isLoading && (
            <div className="row justify-content-center mb-5" data-aos="fade-up">
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading partners...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="row justify-content-center mb-5" data-aos="fade-up">
              <div className="col-12 col-md-8 col-lg-6 text-center">
                <div className="alert alert-danger d-flex align-items-center justify-content-center">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <span>{error}</span>
                  <button 
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={fetchClients}
                  >
                    <i className="fas fa-sync-alt me-1"></i>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Partners Carousel */}
          {!isLoading && !error && clients.length > 0 && (
            <>
             

              {/* Partners Grid */}
              <div className="row g-4 mb-5" data-aos="fade-up" data-aos-delay="200">
                {clients.map((client, index) => (
                  <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={index}>
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                      <div className="card-body p-3 d-flex align-items-center justify-content-center">
                        <div className="partner-logo-container" style={{ height: '80px' }}>
                          <img
                            src={getImageUrl(client.client_image)}
                            alt={client.client_name}
                            className="img-fluid h-100 w-auto  transition-all"
                            style={{ objectFit: 'contain', transition: 'all 0.3s ease' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CTA Section */}
          {/* <div className="row mt-5" data-aos="fade-up" data-aos-delay="300">
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
          </div> */}
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Client;