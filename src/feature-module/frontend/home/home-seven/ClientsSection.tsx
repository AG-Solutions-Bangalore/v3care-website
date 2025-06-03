import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import Slider from 'react-slick';
import axios from 'axios';
import { BASE_URL, CLIENT_IMAGE_URL, NO_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import SkeletonClients from '../../../skeletonLoader/SkeletonClients';

interface Client {
  client_name: string;
  client_image: string;
}

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getClientImageUrl = (imageName: string) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return `${CLIENT_IMAGE_URL}/${imageName}`;
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const partnersSlider = {
    autoplay: true,
    slidesToShow: 5,
    speed: 500,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="our-partners-seven">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="section-heading section-heading-seven">
              <h2>Our Clients</h2>
              <p>
                We are proud to partner with industry leaders and trusted brands
              </p>
            </div>
          </div>

          {isLoading && <SkeletonClients />}

          {error && !isLoading && (
            <div className="col-12 text-center mb-5">
              <div className="alert alert-danger d-flex align-items-center justify-content-center">
                <Icon.AlertCircle className="me-2" size={18} />
                <span>{error}</span>
                <button
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={fetchClients}
                >
                  <Icon.RefreshCw className="me-1" size={14} />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && clients.length > 0 && (
            <Slider {...partnersSlider} className="partners-slider-seven">
              {clients.map((client, index) => (
                <div key={index}>
                  <img
                    src={getClientImageUrl(client.client_image)}
                    alt={client.client_name}
                    className="img-fluid"
                    style={{ maxHeight: '100px', objectFit: 'contain' }}
                    loading="lazy"
  decoding="async"
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;