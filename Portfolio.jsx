import React from 'react';
import Card from './Card';
import './Portfolio.css';

const Portfolio = () => {
  const products = [
    {
      title: "Wildfire Solution",
      description: "The leading wildfire detection & monitoring platform is designed to deliver the earliest detection of hotspots and allow its users to monitor areas at risk of wildfires.",
      image: "https://ororatech.com/storage/files/wildfire-solution-product-card-1220x1454.jpg?token=fa8ec6b03fa7cfc86efb158db470b6b0" 
    },
    {
      title: "Fire Spread",
      description: "Understanding where a wildfire will spread and how quickly is critical to safeguarding communities, assets, and natural ecosystems.",
      image: "https://ororatech.com/storage/files/short-term-fire-hazard-ororatech-1220x1454.png?token=d7bb45dd79dda9a117cb75bfda91c69c"
    },
    {
      title: "Real Time Analysis",
      description: "Monitors live environmental and land data to detect wildfire risks instantly.",
      image: "https://ttpsc.com/wp3/wp-content/uploads/2024/06/TT-PSC-TT-PSC-BLOG-Real-Time-Analytics-photo-04-1024x683.webp"
    },
    {
      title: "AI & Machine Learning Intelligence",
      description: "Uses machine learning models to predict forest fire risks from historical and real-time data.",
      image: "https://plat.ai/wp-content/uploads/dataanalytics2.jpg.webp"
    },
     {
      title: "Helpline Access",
      description: "Instant helpline access to report forest fires and request emergency support.",
      image: "https://www.wbm.ca/isl/uploads/2020/09/it-help-desk-vs-it-service-desk-featured-1024x683.jpg"
    },
    {
      title: "Real-Time Risk Alerts",
      description: "Get instant forest fire risk alerts for faster response and prevention.",
      image: "https://media.istockphoto.com/id/1492989285/photo/people-with-warning-notification-and-spam-message-icon-on-mobile-phone.jpg?s=612x612&w=0&k=20&c=aGF-aKHrDYrExOItemC5O8KLR0EDjDajoEaEUM7gj94="
    }

    
  ];

  return (
    <section className="portfolio-section">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <div className="header-left">
            <span className="subtitle">Products</span>
            <h2 className="main-title">Explore our product portfolio</h2>
          </div>
          <div className="header-right">
            <p className="header-description">
              From early detection with our Wildfire Solution platform to predictive 
              Fire Spread insights and detailed Burnt Area analysis, our products 
              provide the tools you need to protect and respond.
            </p>
          </div>
        </div>

        <div className="portfolio-grid">
          {products.map((item, index) => (
            <div key={index} className={`grid-item item-${index}`}>
              <Card {...item} delay={index * 0.1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;