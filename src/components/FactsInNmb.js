import React, { useEffect, useRef } from 'react';
import '../styles/FactsInNmb.css';
import { Car, Users, Calendar, Gauge } from 'lucide-react';

const FactsInNumbers = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const animateOnScroll = () => {
      const elements = sectionRef.current.querySelectorAll('.facts-counter, .facts-main-heading, .facts-sub-heading');
      
      elements.forEach((element, index) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.8) {
          setTimeout(() => {
            element.classList.add('animate');
          }, index * 100);
        }
      });
    };

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  const counters = [
    { Icon: Car, count: '50+', label: 'cars' },
    { Icon: Users, count: '200+', label: 'customers' },
    { Icon: Calendar, count: '5+', label: 'Years' },
    { Icon: Gauge, count: '20m+', label: 'Kilometers' }
  ];

  return (
    <div className="facts-container" ref={sectionRef}>
      <div className="facts-banner">
        <div className="tire-bg"></div>
        <div className="facts-heading-section">
          <h2 className="facts-main-heading">Facts in numbers</h2>
          <p className="facts-sub-heading">Turning miles into smiles—see how we're making a difference.</p>
        </div>
        <div className="facts-counters">
          {counters.map((counter, index) => (
            <div key={index} className="facts-counter">
              <div className="facts-icon-container">
                <counter.Icon size={24} color="white" />
              </div>
              <div className="facts-text-container">
                <div className="facts-count">{counter.count}</div>
                <div className="facts-label">{counter.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FactsInNumbers;
