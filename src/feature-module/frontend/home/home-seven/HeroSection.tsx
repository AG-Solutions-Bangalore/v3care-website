import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  // const services = [
  //   {
  //     icon: "👩‍💄",
  //     title: "Home Deep Cleaning"
  //   },
  //   {
  //     icon: "👨‍💼",
  //     title: "Home Painting"
  //   },
  //   {
  //     icon: "❄️",
  //     title: "Water Proofing"
  //   },
  //   {
  //     icon: "🧹",
  //     title: "House Civil Renovation Work"
  //   },
  //   {
  //     icon: "🔧",
  //     title: "Marble/Floor Polishing"
  //   },
  //   {
  //     icon: "💧",
  //     title: "Pest Control"
  //   },
  //   {
  //     icon: "🎨",
  //     title: "Disinfection Services"
  //   },
   
  // ];
  const services = [
    {
      icon: "🧽", 
      title: "Home Deep Cleaning"
    },
    {
      icon: "🖌️", 
      title: "Home Painting"
    },
    {
      icon: "💧", 
      title: "Water Proofing"
    },
    {
      icon: "🏚️", 
      title: "House Civil Renovation Work"
    },
    {
      icon: "🪛", 
      title: "Marble/Floor Polishing"
    },
    {
      icon: "🐜", 
      title: "Pest Control"
    },
    {
      icon: "🧴", 
      title: "Disinfection Services"
    },
    {
      icon: "🏢",
      title: "Corporate Services"
    }
  ];
  
  return (
    <section className="hero-section">
      <div className="hero-section-container">
        <div className="hero-section-left">
          <div className="hero-section-content">
            <h1 className="hero-section-title">
               Services at your <br />
              <span className="hero-section-highlight">doorstep</span>
            </h1>
            
            <div className="hero-section-search">
              <h3 className="hero-section-search-title">What are you looking for?</h3>
              {/* <div className="hero-section-services">
                {services.map((service, index) => (
                  <div key={index} className="hero-section-service-item">
                    <div className="hero-section-service-icon">
                      {service.icon}
                    </div>
                    <span className="hero-section-service-title">{service.title}</span>
                  </div>
                ))}
              </div> */}
           <div className="hero-section-services">
  {services.map((service, index) => (
    <>
    <div 
      key={index} 
      className={`hero-section-service-item ${index >= 6 ? 'last-row' : ''}`}
    >
      <div className="hero-section-service-icon">
        {service.icon}
      </div>
      <span className="hero-section-service-title">{service.title}</span>
    </div>
   
     </>
  ))}
</div>
            </div>
            
            <div className="hero-section-stats">
              <div className="hero-section-stat">
                <div className="hero-section-stat-icon">⭐</div>
                <div className="hero-section-stat-content">
                  <span className="hero-section-stat-number">4.8</span>
                  <span className="hero-section-stat-text">Service Rating*</span>
                </div>
              </div>
              <div className="hero-section-stat">
                <div className="hero-section-stat-icon">


                <i className="ri-group-line"></i>

                </div>
                <div className="hero-section-stat-content">
                  <span className="hero-section-stat-number">12M+</span>
                  <span className="hero-section-stat-text">Customers Globally*</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-section-right">
          <div className="hero-section-images">
            <div className="hero-section-image hero-section-image-1">
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop" alt="Salon Service" />
            </div>
            <div className="hero-section-image hero-section-image-2">
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" alt="Massage Service" />
            </div>
            <div className="hero-section-image hero-section-image-3">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop" alt="Home Repair" />
            </div>
            <div className="hero-section-image hero-section-image-4">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" alt="AC Repair" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

//sajid 2 -- change to urban clap layout