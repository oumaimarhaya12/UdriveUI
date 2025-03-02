import React, { useEffect, useRef } from "react";
import "../styles/WhyUdrive.css"; // Ensure this file exists
import locationIcon from "../assets/location.svg";
import phoneIcon from "../assets/phone.svg";
import cashIcon from "../assets/cash.svg"; // Ensure this file exists

const WhyUdrive = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          } else {
            entry.target.classList.remove("animate");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".feature");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-udrive" ref={sectionRef}>
      <h2 className="section-title">
        Why Choose <span className="highlight">Udrive</span>?
      </h2>
      <div className="features-container">
        <div className="feature">
          <img src={locationIcon} alt="Free delivery" width={64} height={64} />
          <h3>Free delivery</h3>
          <p>We bring the car to you!</p>
        </div>
        <div className="feature">
          <img src={phoneIcon} alt="24/7 Support" width={64} height={64} />
          <h3>24/7 Support</h3>
          <p>We're here to help! Anytime</p>
        </div>
        <div className="feature">
          <img src={cashIcon} alt="Cash on delivery" width={64} height={64} />
          <h3>Cash on delivery</h3>
          <p>No upfront payment required</p>
        </div>
      </div>
    </section>
  );
};

export default WhyUdrive;
