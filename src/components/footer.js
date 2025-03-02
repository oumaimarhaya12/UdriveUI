// Footer.js
import "../styles/footer.css";
import logo from "C:/Users/oumaima rhaya/udrive/src/assets/UdriveLogo.png";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { useEffect, useRef } from "react";

const Footer = () => {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const contactsRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (footerRef.current) observer.observe(footerRef.current);
    if (logoRef.current) observer.observe(logoRef.current);
    if (contactsRef.current) observer.observe(contactsRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-content">
        <div className="logo-container" ref={logoRef}>
          <img src={logo} alt="Udrive Logo" className="footer-logo" />
        </div>
        
        <div className="contact-container" ref={contactsRef}>
          <div className="contact-item">
            <div className="icon-wrapper">
              <FaMapMarkerAlt className="icon" />
            </div>
            <div className="contact-text">
              <p className="label">Address</p>
              <p className="info">Agadir, Essalam Numéro 11</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="icon-wrapper">
              <FaEnvelope className="icon" />
            </div>
            <div className="contact-text">
              <p className="label">Email</p>
              <p className="info">Udrive@gmail.com</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="icon-wrapper">
              <FaPhone className="icon" />
            </div>
            <div className="contact-text">
              <p className="label">Phone</p>
              <p className="info">+212-762639683</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom" ref={bottomRef}>
        © 2025 Udrive. All rights reserved | Made By Oumaima Rhaya & Ayoub Barahal
      </div>
    </footer>
  );
};

export default Footer;