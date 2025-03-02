import React, { useEffect, useRef } from 'react';
import carImage from '../assets/Gelendwagen.jpg';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentSection = sectionRef.current;
    const currentSteps = stepsRef.current;

    if (currentSection) {
      observer.observe(currentSection);
    }

    currentSteps.forEach((step) => {
      if (step) {
        observer.observe(step);
      }
    });

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
      currentSteps.forEach((step) => {
        if (step) {
          observer.unobserve(step);
        }
      });
    };
  }, []);

  const steps = [
    {
      number: '1',
      mainText: 'Enter Your Information',
      subText: 'Fill in your details so we can prepare the perfect ride for you'
    },
    {
      number: '2',
      mainText: 'Choose Your Car',
      subText: 'Browse our wide selection of vehicles and pick the one that suits your needs'
    },
    {
      number: '3',
      mainText: 'Confirm Your Booking',
      subText: 'Submit your request. Our team will contact you shortly to confirm your booking and finalize the details'
    },
    {
      number: '4',
      mainText: 'Get Your Car Delivered & Pay on Delivery',
      subText: "Sit back and relax! We'll deliver the car to your preferred location. Payment is easy—just pay in cash when the car arrives"
    }
  ];

  return (
    <section className="how-it-works" ref={sectionRef}>
      <h2 className="title">
        <span className="highlight">Your Journey</span>, Simplified—Here's How It Works!
      </h2>
      <div className="content">
        <div className="car-image">
          <img src={carImage || "/placeholder.svg"} alt="Gelendwagen" />
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step"
              ref={(el) => (stepsRef.current[index] = el)}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-text">
                <h3 className="main-text">{step.mainText}</h3>
                <p className="sub-text">{step.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;