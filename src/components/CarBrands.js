import React, { useEffect, useRef } from "react";
import "../styles/CarBrands.css";
import audiLogo from "../assets/audi.svg";
import bmwLogo from "../assets/bmw.svg";
import fordLogo from "../assets/ford.svg";
import jeepLogo from "../assets/jeep.svg";
import mercedesLogo from "../assets/mercedes.svg";
import toyotaLogo from "../assets/toyota.svg";

const CarBrands = () => {
  const containerRef = useRef(null);
  const logoRefs = useRef([]);

  const brands = [
    { name: "Audi", logo: audiLogo },
    { name: "BMW", logo: bmwLogo },
    { name: "Ford", logo: fordLogo },
    { name: "Jeep", logo: jeepLogo },
    { name: "Mercedes", logo: mercedesLogo },
    { name: "Toyota", logo: toyotaLogo },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class to container
            if (entry.target === containerRef.current) {
              entry.target.classList.add("animate-container");
            }
            
            // Add animation class to logos with delay
            if (entry.target.classList.contains("car-brand-logo")) {
              entry.target.classList.add("animate-logo");
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe container
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Observe each logo
    logoRefs.current.forEach((logo) => {
      if (logo) {
        observer.observe(logo);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="car-brands-container" ref={containerRef}>
      {brands.map((brand, index) => (
        <img
          key={index}
          ref={(el) => (logoRefs.current[index] = el)}
          src={brand.logo || "/placeholder.svg"}
          alt={brand.name}
          className="car-brand-logo"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default CarBrands;