import React from 'react';
import './SkeletonClients.css'
const SkeletonClients = () => {
  return (
    <div className="row g-4 mb-5">
      {[...Array(6)].map((_, index) => (
        <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={index}>
          <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
            <div className="card-body p-3 d-flex align-items-center justify-content-center">
              <div 
                className="skeleton-image"
                style={{
                  height: '80px',
                  width: '100%',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonClients;