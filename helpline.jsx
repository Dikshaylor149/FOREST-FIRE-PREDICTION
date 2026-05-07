import React from 'react';
import Navbar from '../components/Navbar'; 
import '../styles/helpline.css';

const Helpline = () => {
  return (
    <div className="helpline-page-root">
      
      <div className="helpline-scroll-container" style={{ position: "relative" }}>
        <Navbar />
        {/* FULL WIDTH HEADER */}
        <header className="helpline-header-banner">
          <div className="banner-overlay">
            <span className="gov-tag">GOVERNMENT OF ODISHA | FOREST DEPT</span>
            <h1>Emergency Response & Support Portal</h1>
            <p>Immediate help, government support schemes, and safety measures during high forest fire risk.</p>
          </div>
        </header>

        <main className="helpline-main-content">
          <div className="content-wrapper">
            
            {/* EMERGENCY CONTACTS - 8 CARDS (4 PER ROW) */}
            <section className="info-section">
              <h2 className="section-main-title">🔥 Emergency Contact Numbers</h2>
              <div className="contact-grid-compact">
                
                <div className="contact-card-small color-fire">
                  <div className="card-icon-small">🚒</div>
                  <h4>Fire Emergency</h4>
                  <p className="phone-num-small">101</p>
                  <a href="tel:101" className="call-btn-small">Call Now</a>
                </div>

                <div className="contact-card-small color-medical">
                  <div className="card-icon-small">🚑</div>
                  <h4>Ambulance</h4>
                  <p className="phone-num-small">108</p>
                  <a href="tel:108" className="call-btn-small">Call Now</a>
                </div>

                <div className="contact-card-small color-police">
                  <div className="card-icon-small">👮</div>
                  <h4>State Police</h4>
                  <p className="phone-num-small">100</p>
                  <a href="tel:100" className="call-btn-small">Call Now</a>
                </div>

                <div className="contact-card-small color-forest">
                  <div className="card-icon-small">🌳</div>
                  <h4>Forest Dept</h4>
                  <p className="phone-num-small">0674-2391900</p>
                  <a href="tel:06742391900" className="call-btn-small">Call Now</a>
                </div>

                {/* <div className="contact-card-small color-national">
                  <div className="card-icon-small">🚨</div>
                  <h4>National Help</h4>
                  <p className="phone-num-small">112</p>
                  <a href="tel:112" className="call-btn-small">Call Now</a>
                </div>

                <div className="contact-card-small color-disaster">
                  <div className="card-icon-small">🆘</div>
                  <h4>OSDMA Control</h4>
                  <p className="phone-num-small">0674-2538986</p>
                  <a href="tel:06742538986" className="call-btn-small">Call Now</a>
                </div>

                <div className="contact-card-small color-women">
                  <div className="card-icon-small">👩</div>
                  <h4>Women Helpline</h4>
                  <p className="phone-num-small">181</p>
                  <a href="tel:181" className="call-btn-small">Call Now</a>
                </div>

                <div className="contact-card-small color-child">
                  <div className="card-icon-small">👶</div>
                  <h4>Child Help</h4>
                  <p className="phone-num-small">1098</p>
                  <a href="tel:1098" className="call-btn-small">Call Now</a>
                </div> */}

              </div>
            </section>

            {/* QUICK ACTIONS SECTION - 8 CARDS */}
            <section className="info-section glass-box">
              <h2 className="section-main-title">🛑 Immediate Actions During High Forest Fire Risk</h2>
              <div className="protocol-flex">
                <div className="step-card">
                  <div className="protocol-status-tag">Critical</div>
                  <h4>Stop All Burning</h4>
                  <p>Immediately stop burning leaves, garbage, or crop residue near forest areas.</p>
                </div>
                <div className="step-card">
                  <div className="protocol-status-tag">Urgent</div>
                  <h4>Report Instantly</h4>
                  <p>If you see smoke or sparks, call 101 or the Forest Dept without delay.</p>
                </div>
                <div className="step-card">
                  <div className="protocol-status-tag">Safety</div>
                  <h4>Quick Evacuation</h4>
                  <p>Keep documents, medicines, and essentials ready in one bag for departure.</p>
                </div>
                <div className="step-card">
                  <div className="protocol-status-tag">Defense</div>
                  <h4>Water & Sand</h4>
                  <p>Store buckets of water or sand to control small flames before they spread.</p>
                </div>
                <div className="step-card">
                  <div className="protocol-status-tag">Protection</div>
                  <h4>Clear Vegetation</h4>
                  <p>Remove dry leaves and flammable materials from around your home perimeter.</p>
                </div>
                <div className="step-card">
                  <div className="protocol-status-tag">Vulnerable</div>
                  <h4>Help Others</h4>
                  <p>Ensure children, elderly members, and animals are moved to safety first.</p>
                </div>
                {/* <div className="step-card">
                  <div className="protocol-status-tag">Prevention</div>
                  <h4>Avoid Sparks</h4>
                  <p>Do not throw cigarette butts or use fireworks in dry or forest areas.</p>
                </div>
                <div className="step-card">
                  <div className="protocol-status-tag">Alerts</div>
                  <h4>Follow Official Info</h4>
                  <p>Stay updated through government alerts and local administration channels.</p>
                </div> */}
              </div>
            </section>

            {/* SCHEMES SECTION - 5 CARDS */}
            <section className="info-section">
              <h2 className="section-main-title">🏛 Government Schemes for Forest & Disaster Support</h2>
              <div className="schemes-layout">
                <div className="official-scheme-card">
                  <div>
                    <span className="badge">FEDERAL</span>
                    <h3>NDRF Support</h3>
                    <p>Financial assistance for relief, and rehabilitation in disaster-affected states.</p>
                  </div>
                  <a href="https://ndmindia.mha.gov.in/" target="_blank" rel="noreferrer" className="scheme-btn">Apply / Learn More</a>
                </div>

                <div className="official-scheme-card">
                  <div>
                    <span className="badge">STATE</span>
                    <h3>SDRF Odisha</h3>
                    <p>Immediate state relief for evacuation, shelter, and damage compensation.</p>
                  </div>
                  <a href="https://ndmindia.mha.gov.in/" target="_blank" rel="noreferrer" className="scheme-btn">Apply / Learn More</a>
                </div>

                <div className="official-scheme-card">
                  <div>
                    <span className="badge">PREVENTION</span>
                    <h3>Fire Management</h3>
                    <p>Funding for satellite monitoring, equipment, and community awareness.</p>
                  </div>
                  <a href="https://moef.gov.in/" target="_blank" rel="noreferrer" className="scheme-btn">Apply / Learn More</a>
                </div>

                <div className="official-scheme-card">
                  <div>
                    <span className="badge">INSURANCE</span>
                    <h3>PM Fasal Bima</h3>
                    <p>Crop insurance providing protection to farmers against natural fire damage.</p>
                  </div>
                  <a href="https://pmfby.gov.in/" target="_blank" rel="noreferrer" className="scheme-btn">Apply / Learn More</a>
                </div>

                <div className="official-scheme-card">
                  <div>
                    <span className="badge">RESTORATION</span>
                    <h3>National Afforestation</h3>
                    <p>Supports restoration of degraded forests and community-led protection.</p>
                  </div>
                  <a href="https://moef.gov.in/" target="_blank" rel="noreferrer" className="scheme-btn">Apply / Learn More</a>
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="gov-footer">
          <p>© 2026 AI Forest Fire Alerts System | Odisha Emergency Portal</p>
        </footer>
      </div>
    </div>
  );
};

export default Helpline;