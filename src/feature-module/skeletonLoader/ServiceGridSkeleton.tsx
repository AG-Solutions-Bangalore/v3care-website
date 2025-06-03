import React from 'react';
import './ServiceGridSkeleton.css';

const ServiceGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="row g-3 service-grid-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-xl-3 col-lg-4 col-md-6">
          <div className="card h-100 border-0 overflow-hidden position-relative skeleton-card">
            {/* Image placeholder */}
            <div className="card-img-top placeholder-glow">
              <div className="placeholder w-100 h-100"></div>
            </div>
            
            {/* Card body placeholder */}
            <div className="card-body p-3">
              <h5 className="card-title mb-1">
                <span className="placeholder col-8"></span>
              </h5>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="small">
                  <span className="placeholder col-4"></span>
                </span>
                <span className="badge bg-primary bg-opacity-10">
                  <span className="placeholder col-2"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGridSkeleton;