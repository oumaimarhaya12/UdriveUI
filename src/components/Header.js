import React from 'react';
import '../styles/Header.css'; // Corrected path
import UdriveLogo from '../assets/UdriveLogo.png'; // Import the image

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img
          src={UdriveLogo} // Use the imported image
          alt="Udrive Logo"
          width="157"
          height="33.734"
        />
      </div>
      <div className="buttons">
        <button className="signup-button">Sign Up</button>
        <button className="login-button">Log In</button>
      </div>
    </header>
  );
};

export default Header;