import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import axios from "axios";

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

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://agscare.site/crmapi/public/api/panel-fetch-web-branch-out');
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
        {/* Close button */}
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
                  onClick={() => onSelectCity(branch.branch_name, branch.id)}
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