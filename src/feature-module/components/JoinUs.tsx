import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, PlusCircle } from 'react-feather';

const JoinUs: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '2rem',
        zIndex: 50,
        width: '50px',
        transition: 'all 0.3s ease-in-out'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{
        position: 'relative',
        width: '100%'
      }}>
        {/* Contact links container - positioned ABOVE the button */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '0',
          width: '50px',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          padding: '8px 0',
          gap: '8px'
        }}>
          {/* Phone icon */}
          <a href="tel:+919880778585" style={{
            color: 'white',
            backgroundColor: '#6366f1',
            border: '1px solid white',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <Phone size={18} />
          </a>
          
          {/* WhatsApp icon */}
          <a href="https://wa.me/919880778585" style={{
            color: 'white',
            backgroundColor: '#6366f1',
            border: '1px solid white',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} target='_blank' rel="noreferrer">
            <MessageCircle size={18} />
          </a>
          
          {/* Mail icon */}
          <a href="mailto:info@v3care.com" style={{
            color: 'white',
            backgroundColor: '#6366f1',
            border: '1px solid white',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <Mail size={18} />
          </a>
        </div>
        
        {/* Main Button */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          height: '50px',
          width: '50px',
          backgroundColor: '#6366f1',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          <PlusCircle color="white" size={28} />
        </div>
      </div>
    </div>
  );
};

export default JoinUs;