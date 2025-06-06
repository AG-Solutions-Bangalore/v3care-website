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
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alreadySelected, setAlreadySelected] = useState(false);
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
    overlay.style.background = "rgba(255, 255, 255, 1)";
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

    const svgContainer = document.createElement("div");
    svgContainer.style.width = "100%";
    svgContainer.style.height = "100%";
    svgContainer.style.display = "flex";
    svgContainer.style.justifyContent = "center";
    svgContainer.style.alignItems = "center";
    svgContainer.style.overflow = "hidden";

    // Create a wrapper to maintain aspect ratio
    const svgWrapper = document.createElement("div");
    svgWrapper.style.width = "100%";
    svgWrapper.style.height = "100%";
    svgWrapper.style.maxWidth = "1920px";
    svgWrapper.style.maxHeight = "1080px";
    svgWrapper.style.aspectRatio = "16/9";
    svgWrapper.style.margin = "auto";
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 1920 1080");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.innerHTML = `
    <!-- Your SVG content here - keep all the SVG content you originally had -->
    <!-- Background -->
    <rect width="1920" height="1080" fill="#ffffff"/>
    
    <!-- Gradient Overlay -->
    <defs>
      <!-- Gradients -->
      <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#e2e8f0" stop-opacity="0.3"/>
      </radialGradient>
      
      <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e40af" stop-opacity="0.1"/>
        <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.1"/>
      </linearGradient>
      
      <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      
      <!-- Filters -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Background Gradient -->
    <rect width="1920" height="1080" fill="url(#bgGradient)"/>
    
    <!-- India Map Outline (Simplified) -->
    <g id="indiaMap" transform="translate(960, 540)" opacity="0">
      <path d="M-200,-150 C-180,-180 -120,-190 -80,-180 C-40,-170 0,-160 40,-150 C80,-140 120,-130 160,-120 C180,-110 190,-90 185,-70 C180,-50 170,-30 160,-10 C150,10 140,30 130,50 C120,70 110,90 100,110 C90,130 80,150 60,160 C40,170 20,165 0,160 C-20,155 -40,150 -60,145 C-80,140 -100,135 -120,125 C-140,115 -160,100 -175,80 C-190,60 -195,35 -200,10 C-205,-15 -202,-40 -200,-65 C-198,-90 -200,-120 -200,-150 Z" 
            fill="url(#mapGradient)" 
            stroke="#3b82f6" 
            stroke-width="2" 
            stroke-opacity="0.3"/>
      
      <!-- Major Cities Dots -->
      <circle cx="-120" cy="-80" r="6" fill="#ef4444" opacity="0.8"/> <!-- Delhi -->
      <circle cx="-80" cy="60" r="6" fill="#ef4444" opacity="0.8"/> <!-- Mumbai -->
      <circle cx="40" cy="80" r="6" fill="#ef4444" opacity="0.8"/> <!-- Bangalore -->
      <circle cx="60" cy="20" r="6" fill="#ef4444" opacity="0.8"/> <!-- Chennai -->
      <circle cx="-40" cy="-20" r="6" fill="#ef4444" opacity="0.8"/> <!-- Pune -->
      
      <animateTransform
        attributeName="transform"
        type="translate"
        values="960 540; 960 540"
        dur="5s"
        begin="0s"/>
      
      <animate
        attributeName="opacity"
        values="0; 0; 0.6; 0.6"
        dur="5s"
        begin="0s"/>
    </g>
    
    <!-- City Skyline Silhouette -->
    <g id="skyline" transform="translate(0, 800)" opacity="0">
      <!-- Building silhouettes -->
      <rect x="100" y="-120" width="40" height="120" fill="#1e293b" opacity="0.3"/>
      <rect x="160" y="-80" width="60" height="80" fill="#1e293b" opacity="0.3"/>
      <rect x="240" y="-140" width="50" height="140" fill="#1e293b" opacity="0.3"/>
      <rect x="310" y="-100" width="70" height="100" fill="#1e293b" opacity="0.3"/>
      <rect x="400" y="-160" width="45" height="160" fill="#1e293b" opacity="0.3"/>
      <rect x="470" y="-90" width="55" height="90" fill="#1e293b" opacity="0.3"/>
      <rect x="550" y="-130" width="65" height="130" fill="#1e293b" opacity="0.3"/>
      
      <!-- More buildings on the right -->
      <rect x="1200" y="-110" width="50" height="110" fill="#1e293b" opacity="0.3"/>
      <rect x="1270" y="-90" width="40" height="90" fill="#1e293b" opacity="0.3"/>
      <rect x="1330" y="-150" width="60" height="150" fill="#1e293b" opacity="0.3"/>
      <rect x="1410" y="-120" width="55" height="120" fill="#1e293b" opacity="0.3"/>
      <rect x="1480" y="-80" width="45" height="80" fill="#1e293b" opacity="0.3"/>
      <rect x="1540" y="-140" width="70" height="140" fill="#1e293b" opacity="0.3"/>
      <rect x="1630" y="-100" width="50" height="100" fill="#1e293b" opacity="0.3"/>
      <rect x="1700" y="-130" width="60" height="130" fill="#1e293b" opacity="0.3"/>
      
      <animate
        attributeName="opacity"
        values="0; 0; 0; 0.4; 0.4"
        dur="5s"
        begin="0s"/>
    </g>
    
    <!-- Location Pin (Current Location) -->
    <g id="currentPin" transform="translate(400, 400)" opacity="0">
      <circle cx="0" cy="0" r="20" fill="#10b981" opacity="0.3">
        <animate attributeName="r" values="20; 30; 20" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="0" r="8" fill="#10b981"/>
      <path d="M0,-15 C6,-15 10,-10 10,-5 C10,0 0,15 0,15 C0,15 -10,0 -10,-5 C-10,-10 -6,-15 0,-15 Z" fill="#059669" filter="url(#shadow)"/>
      <circle cx="0" cy="-5" r="3" fill="#ffffff"/>
      
      <animateTransform
        attributeName="transform"
        type="translate"
        values="400 400; 400 380; 400 400"
        dur="2s"
        repeatCount="indefinite"/>
      
      <animate
        attributeName="opacity"
        values="0; 1; 1; 0; 0"
        dur="5s"
        begin="0s"/>
    </g>
    
    <!-- Destination Pin (Target City) -->
    <g id="targetPin" transform="translate(1500, 300)" opacity="0">
      <circle cx="0" cy="0" r="20" fill="#ef4444" opacity="0.3">
        <animate attributeName="r" values="20; 30; 20" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="0" r="8" fill="#ef4444"/>
      <path d="M0,-15 C6,-15 10,-10 10,-5 C10,0 0,15 0,15 C0,15 -10,0 -10,-5 C-10,-10 -6,-15 0,-15 Z" fill="#dc2626" filter="url(#shadow)"/>
      <circle cx="0" cy="-5" r="3" fill="#ffffff"/>
      
      <animateTransform
        attributeName="transform"
        type="translate"
        values="1500 300; 1500 280; 1500 300"
        dur="2s"
        repeatCount="indefinite"/>
      
      <animate
        attributeName="opacity"
        values="0; 0; 0; 1; 1"
        dur="5s"
        begin="0s"/>
    </g>
    
    <!-- Flying Plane Animation -->
    <g id="plane" transform="translate(400, 400)" opacity="0">
      <g transform="rotate(45)">
        <!-- Plane body -->
        <ellipse cx="0" cy="0" rx="25" ry="8" fill="url(#planeGradient)" filter="url(#shadow)"/>
        <!-- Wings -->
        <ellipse cx="-5" cy="0" rx="15" ry="20" fill="url(#planeGradient)" opacity="0.8"/>
        <!-- Tail -->
        <path d="M20,0 L30,-5 L28,0 L30,5 Z" fill="url(#planeGradient)"/>
        <!-- Window -->
        <circle cx="-8" cy="0" r="4" fill="#ffffff" opacity="0.7"/>
      </g>
      
      <!-- Plane trail -->
      <path d="M-50,0 Q-30,5 -10,0 Q10,-5 30,0" stroke="#3b82f6" stroke-width="2" opacity="0.5" fill="none">
        <animate attributeName="opacity" values="0; 0.8; 0" dur="1s" repeatCount="indefinite"/>
      </path>
      
      <animateTransform
        attributeName="transform"
        type="translate"
        values="400 400; 950 350; 1500 300"
        dur="5s"
        begin="0s"/>
      
      <animate
        attributeName="opacity"
        values="0; 0; 1; 1; 0"
        dur="5s"
        begin="0s"/>
    </g>
    
    <!-- Connection Line -->
    <line id="connectionLine" x1="400" y1="400" x2="400" y2="400" stroke="#3b82f6" stroke-width="3" opacity="0" stroke-dasharray="10,5">
      <animate
        attributeName="x2"
        values="400; 1500"
        dur="3s"
        begin="1.5s"/>
      <animate
        attributeName="y2"
        values="400; 300"
        dur="3s"
        begin="1.5s"/>
      <animate
        attributeName="opacity"
        values="0; 0.6; 0.6; 0"
        dur="5s"
        begin="0s"/>
    </line>
    
    <!-- Text Messages -->
    <g id="textGroup">
      <!-- Current Location Detected -->
     
      
      <!-- Switching Animation -->
      <g id="text2" opacity="0">
        <rect x="760" y="120" width="400" height="100" rx="40" fill="#ffffff" filter="url(#shadow)" opacity="0.95"/>
        <text x="960" y="155" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#1e293b">
          ✈️ Switching to selected city
        </text>
        <text x="960" y="180" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b">
          Loading new location data...
        </text>
        
        <!-- Loading dots -->
        <g id="loadingDots">
          <circle cx="920" cy="195" r="3" fill="#3b82f6">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.5s" repeatCount="indefinite" begin="0s"/>
          </circle>
          <circle cx="940" cy="195" r="3" fill="#3b82f6">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
          <circle cx="960" cy="195" r="3" fill="#3b82f6">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.5s" repeatCount="indefinite" begin="1s"/>
          </circle>
          <circle cx="980" cy="195" r="3" fill="#3b82f6">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
          <circle cx="1000" cy="195" r="3" fill="#3b82f6">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.5s" repeatCount="indefinite" begin="0s"/>
          </circle>
        </g>
        
        <animate
          attributeName="opacity"
          values="0; 0; 1; 1; 0"
          dur="5s"
          begin="0s"/>
      </g>
      
      <!-- Success Message -->
      <g id="text3" opacity="0">
        <rect x="760" y="200" width="400" height="80" rx="40" fill="#ffffff" filter="url(#shadow)" opacity="0.95"/>
        <text x="960" y="235" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#059669">
          ✅ City switched successfully!
        </text>
        <text x="960" y="260" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b">
          Welcome to your new city
        </text>
        
        <animate
          attributeName="opacity"
          values="0; 0; 0; 0; 1"
          dur="5s"
          begin="0s"/>
      </g>
    </g>
    
    <!-- Floating particles for atmosphere -->
    <g id="particles" opacity="0.6">
      <circle cx="200" cy="200" r="2" fill="#3b82f6" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0; 20,-20; 0,0" dur="8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="1600" cy="300" r="1.5" fill="#8b5cf6" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0; -15,25; 0,0" dur="10s" repeatCount="indefinite"/>
      </circle>
      <circle cx="300" cy="800" r="2.5" fill="#06b6d4" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,0; 30,-10; 0,0" dur="12s" repeatCount="indefinite"/>
      </circle>
      <circle cx="1400" cy="700" r="2" fill="#f59e0b" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0; -25,15; 0,0" dur="9s" repeatCount="indefinite"/>
      </circle>
    </g>
    
    <!-- Subtle grid pattern -->
    <defs>
      <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="1920" height="1080" fill="url(#grid)" opacity="0.1"/>
    
    <!-- Master animation restart -->
    <animate
      attributeName="opacity"
      values="1; 1"
      dur="5s"
      begin="0s; 5s"
      repeatCount="indefinite"/>
    `;

    svgWrapper.appendChild(svg);
    svgContainer.appendChild(svgWrapper);
    overlay.appendChild(svgContainer);

    document.body.appendChild(overlay);

    setTimeout(() => {
        window.location.reload();
    }, 5000);
};

  const handleCitySelect = (branch: Branch) => {
    if (branch.branch_name === selectedCity) {
      setAlreadySelected(true);
      setTimeout(() => setAlreadySelected(false), 2000);
      return;
    }
    
    setSelectedBranch(branch);
    setAlreadySelected(false);
    
    if (cartItems.length > 0) {
      setShowConfirmation(true);
    } else {
      proceedWithCityChange(branch);
    }
  };

  const proceedWithCityChange = (branch: Branch) => {
    if (cartItems.length > 0) {
      dispatch(clearCart());
    }
    
    onSelectCity(branch.branch_name, branch.id);
    showLoadingOverlay(branch.branch_name);
  };

  const cancelCityChange = () => {
    setSelectedBranch(null);
    setShowConfirmation(false);
  };

  const getButtonStyle = (city: string) => {
    const baseStyle = {
      padding: '8px 12px',
      borderRadius: '8px',
      border: "1px solid #000000",
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
        background: '#000000',
        color: 'white',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      };
    }
    return baseStyle;
  };

  const getConfirmationButtonStyle = (isPrimary: boolean) => {
    return {
      padding: '8px 16px',
      borderRadius: '8px',
      border: isPrimary ? 'none' : '1px solid #000000',
      background: isPrimary ? '#000000' : '#ffffff',
      color: isPrimary ? 'white' : '#2d3748',
      fontWeight: 500,
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '0.85rem',
      minWidth: '120px'
    };
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
        borderRadius: '8px',
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
            {showConfirmation 
              ? 'Confirm City Change' 
              : alreadySelected 
                ? 'Already Selected' 
                : 'Select Your City'}
          </h3>
          <p style={{
            color: '#718096',
            fontSize: '0.875rem',
            margin: '0 0 20px 0'
          }}>
            {showConfirmation 
              ? `You have ${cartItems.length} item(s) in your cart. Changing city will clear your cart.`
              : alreadySelected
                ? `${selectedCity} is already your selected city.`
                : 'Choose your location to see local services'}
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
          ) : showConfirmation ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                padding: '16px',
                background: '#fff7ed',
                borderRadius: '8px',
                width: '100%',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0', color: '#9a3412' }}>
                  Are you sure you want to switch to {selectedBranch?.branch_name}?
                </p>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                width: '100%',
                justifyContent: 'center'
              }}>
                <button
                  onClick={cancelCityChange}
                  style={getConfirmationButtonStyle(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedBranch && proceedWithCityChange(selectedBranch)}
                  style={getConfirmationButtonStyle(true)}
                >
                  Confirm Change
                </button>
              </div>
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
                  onClick={() => handleCitySelect(branch)}
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