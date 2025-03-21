"use client"
import { useNavigate } from "react-router-dom"
import "../styles/HeaderNew.css" 
import UdriveLogo from "../assets/UdriveLogo.png"

const Header = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleSignupClick = () => {
    navigate("/signup")
  }

  return (
    <header className="udrive-header">
      <div className="udrive-logo">
        <img src={UdriveLogo || "/placeholder.svg"} alt="Udrive Logo" width="157" height="33.734" />
      </div>
      <div className="udrive-buttons">
        <button
          className="udrive-signup-button"
          onClick={handleSignupClick}
        >
          Sign Up
        </button>
        <button className="udrive-login-button" onClick={handleLoginClick}>
          Log In
        </button>
      </div>
    </header>
  )
}

export default Header