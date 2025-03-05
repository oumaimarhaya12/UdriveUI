import { Phone } from "lucide-react";
import "../styles/Header2.css";
import UdriveLogo from '../assets/UdriveLogo.png';

const Header2 = () => {
  return (
    <header className="header2">
      <div className="logo">
        <img
          src={UdriveLogo} // Use the imported image
          alt="Udrive Logo"
          width="157"
          height="33.734"
        />
      </div>
      <div className="help-container">
        <p className="help-text">Need help?</p>
        <div className="phone-container">
          <div className="phone-icon-circle">
            <Phone size={22} color="white" /> {/* Bigger icon */}
          </div>
          <span className="phone-number">+212 762639683</span>
        </div>
      </div>
    </header>
  );
};

export default Header2;
