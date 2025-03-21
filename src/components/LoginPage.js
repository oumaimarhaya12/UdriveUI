import React from 'react';
import LoginForm from './LoginForm';
import '../styles/LoginPage.css';
import pneuPurple from '../assets/pneuPurple.svg'; // Import the SVG

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* Add the SVG as a direct img element for maximum control */}
      <img src={pneuPurple || "/placeholder.svg"} alt="" className="pneu-background" />
      
      <div className="login-content">
        <LoginForm />
      </div>
      
      <div className="login-page-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

export default LoginPage;