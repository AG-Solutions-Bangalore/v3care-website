import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import Slider from 'react-slick';
import axios from 'axios';
import { BASE_URL, CLIENT_IMAGE_URL, NO_IMAGE_URL } from '../../../baseConfig/BaseUrl';
import SkeletonClients from '../../../skeletonLoader/SkeletonClients';
import { Link } from 'react-router-dom';
import './ClientSection.css';

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
    <section className="home-client-section">
      <div className="home-client-container">
        <div className="home-client-row">
          <div className="home-client-header-col">
            <div className="home-client-header">
              <h2 className="home-client-title">Our Clients</h2>
              <p className="home-client-subtitle">
                We are proud to partner with industry leaders and trusted brands
              </p>
              <Link
                to="/client"
                className="home-client-view-all"
              >
                See all Clients <Icon.ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {isLoading && <SkeletonClients />}

          {error && !isLoading && (
            <div className="home-client-error-col">
              <div className="home-client-error">
                <Icon.AlertCircle className="home-client-error-icon" size={18} />
                <span>{error}</span>
                <button
                  className="home-client-retry-btn"
                  onClick={fetchClients}
                >
                  <Icon.RefreshCw className="home-client-retry-icon" size={14} />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && clients.length > 0 && (
            <Slider {...partnersSlider} className="home-client-slider">
              {clients.map((client, index) => (
                <div className="home-client-slide" key={index}>
                  <img
                    src={getClientImageUrl(client.client_image)}
                    alt={client.client_name}
                    className="home-client-img"
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