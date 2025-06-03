import React from 'react';
import './ServiceGridSkeleton.css';

export const SubServiceModalSkeleton = () => {
  return (
    <div className="row g-2 subservice-modal-skeleton">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="col-6 col-sm-4 col-md-3">
          <div className="card h-100 border-0 overflow-hidden position-relative skeleton-card">
            <div className="ratio ratio-1x1 placeholder-glow">
              <div className="placeholder w-100 h-100"></div>
            </div>
            <div className="card-body p-2 text-center">
              <h6 className="card-title mb-0">
                <span className="placeholder col-10"></span>
              </h6>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};