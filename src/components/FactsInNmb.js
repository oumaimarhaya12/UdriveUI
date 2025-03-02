import React, { useEffect, useRef, useState } from 'react';
import '../styles/FactsInNmb.css';
import { Car, Users, Calendar, Gauge } from 'lucide-react';

const FactsInNumbers = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const counters = [
    { Icon: Car, count: 50, label: 'cars', suffix: '+' },
    { Icon: Users, count: 200, label: 'customers', suffix: '+' },
    { Icon: Calendar, count: 5, label: 'Years', suffix: '+' },
    { Icon: Gauge, count: 20, label: 'Kilometers', suffix: 'm+' }
  ];

  const [counts, setCounts] = useState(counters.map(() => 0));

  useEffect(() => {
    const animateOnScroll = () => {
      const elements = sectionRef.current.querySelectorAll('.facts-counter, .facts-main-heading, .facts-sub-heading');
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.8) {
        setIsVisible(true);
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add('animate');
          }, index * 100);
        });
      }
    };

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      counters.forEach((counter, index) => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = counter.count / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= counter.count) {
            current = counter.count;
            clearInterval(timer);
          }
          setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index] = Math.floor(current);
            return newCounts;
          });
        }, duration / steps);
      });
    }
  }, [isVisible]); // Removed counters from dependencies

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
                <div className="facts-count">{counts[index]}{counter.suffix}</div>
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
