import React, { useEffect, useState } from 'react';

import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import {BASE_URL, CLIENT_IMAGE_URL, NO_IMAGE_URL} from '../../../baseConfig/BaseUrl';
import HomeHeader from '../../home/header/home-header';
import DefaultHelmet from '../../common/helmet/DefaultHelmet';

interface Client {
  client_name: string;
  client_image: string;
}

const Client = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

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
      <DefaultHelmet/>
     <HomeHeader  />
      <BreadCrumb title='Our Partners'  item1='Client' />
      
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content container-fluid pb-5">
         
          
          {/* Loading State */}
          {isLoading && (
            <div className="row justify-content-center mb-5" >
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
            <div className="row justify-content-center mb-5" >
              <div className="col-12 col-md-8 col-lg-6 text-center">
                <div className="alert alert-danger d-flex align-items-center justify-content-center">
                <i className="ri-error-warning-line me-2 fs-4"></i>
                  <span>{error}</span>
                  <button 
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={fetchClients}
                  >
                     <i className="ri-loop-right-line me-1"></i>
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
              <div className="row g-4 mb-5" >
                {clients.map((client, index) => (
                  <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={index}>
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                      <div className="card-body p-3 d-flex align-items-center justify-content-center">
                        <div className="partner-logo-container" style={{ height: '80px' }}>
                          <img
                            src={getImageUrl(client.client_image)}
                            alt={client.client_name}
                            loading="lazy"
  decoding="async"
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

          
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Client;