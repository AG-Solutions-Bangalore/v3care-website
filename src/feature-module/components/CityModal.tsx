import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import axios from "axios";
import { BASE_URL } from '../baseConfig/BaseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../core/redux/slices/CartSlice';
import { RootState } from '../../core/redux/store';

interface CityModalProps {
  onSelectCity: (city: string, branchId: number) => void;
  onClose?: () => void;
  selectedCity?: string | null;
}

interface Branch {
  id: number;
  branch_name: string;
}

const CityModal: React.FC<CityModalProps> = ({ onSelectCity, onClose, selectedCity }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-branch-out`);
      const branchList = response.data?.branch || [];
      setBranches(branchList);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setError('Failed to load cities. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const showLoadingOverlay = (city: string) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(255, 255, 255, 0.1)";
    overlay.style.backdropFilter = "blur(15px)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.zIndex = "99999";

    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
      @keyframes float {
        from { transform: translateY(0px); }
        to { transform: translateY(10px); }
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.2); }
        50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.5); }
        100% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.2); }
      }
    `;
    document.head.appendChild(styleSheet);

    const animation = document.createElement("div");
    animation.innerHTML = '📍';
    animation.style.fontSize = "80px";
    animation.style.marginBottom = "20px";
    animation.style.animation = "float 2s ease-in-out infinite alternate";

    const message = document.createElement("p");
    message.style.fontSize = "22px";
    message.style.color = "#333";
    message.style.fontWeight = "bold";
    message.style.marginBottom = "15px";
    message.innerText = `Updating to ${city}! Preparing your experience...`;

    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.width = "300px";
    progressBarContainer.style.height = "8px";
    progressBarContainer.style.borderRadius = "10px";
    progressBarContainer.style.background = "rgba(0, 0, 0, 0.1)";
    progressBarContainer.style.overflow = "hidden";

    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "100%";
    progressBar.style.borderRadius = "10px";
    progressBar.style.background = "linear-gradient(to right, #3182ce, #63b3ed)";
    progressBar.style.transition = "width 0.3s ease-in-out";

    progressBarContainer.appendChild(progressBar);

    overlay.appendChild(animation);
    overlay.appendChild(message);
    overlay.appendChild(progressBarContainer);
    document.body.appendChild(overlay);

    let progress = 1;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        progressBar.style.width = "100%";
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        progressBar.style.width = `${progress}%`;
      }
    }, 150);
  };

  const handleCitySelect = (city: string, branchId: number) => {
    if (cartItems.length > 0) {
      const shouldProceed = window.confirm(
        `You have ${cartItems.length} item(s) in your cart. Changing city will clear your cart. Do you want to proceed?`
      );
      
      if (!shouldProceed) return;
      
      dispatch(clearCart());
    }
    
    onSelectCity(city, branchId);
    showLoadingOverlay(city);
  };

  const getButtonStyle = (city: string) => {
    const baseStyle = {
      padding: '8px 12px',
      borderRadius: '16px',
      border: 'none',
      background: '#ffffff',
      color: '#2d3748',
      fontWeight: 500,
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '0.85rem',
      margin: '4px',
      flex: '1 0 calc(25% - 8px)',
      minWidth: '120px',
      maxWidth: 'calc(25% - 8px)',
      textAlign: 'center' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };

    if (hoveredCity === city || selectedCity === city) {
      return {
        ...baseStyle,
        background: '#3182ce',
        color: 'white',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      };
    }
    return baseStyle;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease-out'
    }}>
      <div style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        width: '90%',
        maxWidth: '500px',
        marginTop: '5vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {onClose && (
          <button 
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon.X size={20} color="#64748b" />
          </button>
        )}

        <div style={{
          padding: '24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
        }}>
          <h3 style={{
            color: '#2d3748',
            margin: '0 0 16px 0',
            fontSize: '1.25rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>📍</span>
            Select Your City
          </h3>
          <p style={{
            color: '#718096',
            fontSize: '0.875rem',
            margin: '0 0 20px 0'
          }}>
            Choose your location to see local services
          </p>
        </div>

        <div style={{
          padding: '16px',
          maxHeight: '50vh',
          overflowY: 'auto'
        }}>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-3">Loading cities...</span>
            </div>
          ) : error ? (
            <div className="d-flex flex-column align-items-center p-3">
              <div className="d-flex align-items-center text-danger mb-2">
                <Icon.AlertCircle className="me-2" size={20} />
                <span>{error}</span>
              </div>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={fetchCities}
              >
                <Icon.RefreshCw size={14} className="me-1" />
                Try Again
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '0 -4px'
            }}>
              {branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => handleCitySelect(branch.branch_name, branch.id)}
                  style={getButtonStyle(branch.branch_name)}
                  onMouseEnter={() => setHoveredCity(branch.branch_name)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  {branch.branch_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{
          padding: '12px 24px',
          background: '#f7fafc',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0'
        }}>
          <small style={{
            color: '#718096',
            fontSize: '0.75rem'
          }}>
            We will remember your selection
          </small>
        </div>
      </div>
    </div>
  );
};

export default CityModal;