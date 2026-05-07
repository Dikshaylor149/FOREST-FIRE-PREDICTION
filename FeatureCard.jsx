import React from 'react';
import '../styles/FeatureCard.css';

export default function FeatureCard({ title, description, img, gradient }) {
  return (
    <div className="feature-card-premium">
      <div className="card-image-box">
        <img src={img} alt={title} className="card-img" />
        <div className="card-icon-overlay" style={{ background: gradient }}>✨</div>
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="card-footer">
          
          {/* Text labels removed as requested */}
        </div>
      </div>
    </div>
  );
}