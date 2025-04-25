"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, ChevronDown, LayoutDashboard, CalendarCheck } from "lucide-react"
import "../styles/Header.css"
import UdriveLogo from "../assets/UdriveLogo.png"

const Header = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "",
  })

  // Function to check if user is logged in
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoggedIn(false)
      return
    }

    try {
      // Get user info from the JWT token
      const userInfo = parseJwt(token)

      if (!userInfo) {
        throw new Error("Invalid token")
      }

      // Extract user data from the token
      const userData = {
        fullName: userInfo.sub || "User", // JWT typically uses 'sub' for the subject (username/email)
        email: userInfo.sub, // Using the subject as email since that's what you're using to generate the token
        role: userInfo.role || "CLIENT", // Your JwtUtil includes the role in the token
      }

      setUser(userData)
      setIsLoggedIn(true)
    } catch (error) {
      console.error("Token verification failed:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      setIsLoggedIn(false)
    }
  }, [])

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error parsing JWT token:", error)
      return null
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleSignupClick = () => {
    navigate("/signup")
  }

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")

    // Reset state
    setIsLoggedIn(false)
    setUser({ fullName: "", email: "", role: "" })
    setIsOpen(false)

    // Redirect to home page
    navigate("/")
  }

  const handleDashboardClick = () => {
    navigate("/dashboard")
    setIsOpen(false)
  }

  const handleBookingsClick = () => {
    navigate("/bookings")
    setIsOpen(false)
  }

  return (
    <header className="udrive-header">
      <div className="udrive-logo" onClick={() => navigate("/")}>
        <img src={UdriveLogo || "/placeholder.svg"} alt="Udrive Logo" width="157" height="33.734" />
      </div>
      <div className="udrive-buttons">
        {isLoggedIn ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="profile-button" aria-expanded={isOpen}>
              <div className="profile-avatar-container">
                {user.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.fullName} className="avatar" />
                ) : (
                  <div className="avatar-placeholder">{user.fullName.charAt(0).toUpperCase()}</div>
                )}
                <span className="user-name">{user.fullName}</span>
                {user.role === "ADMIN" && <span className="user-role">Admin</span>}
              </div>
              <ChevronDown className={`chevron ${isOpen ? "open" : ""}`} size={18} />
            </button>

            {isOpen && (
              <div className="dropdown-menu">
                <div className="user-info">
                  <div className="user-avatar-large">
                    {user.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                    ) : (
                      <div className="avatar-placeholder-large">{user.fullName.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="user-details">
                    <p className="user-full-name">{user.fullName}</p>
                    <p className="user-email">{user.email}</p>
                    {user.role === "ADMIN" && <p className="user-role-badge">Administrator</p>}
                  </div>
                </div>

                <button className="menu-item" onClick={handleBookingsClick}>
                  <CalendarCheck size={20} className="menu-icon" />
                  <span>My Bookings</span>
                </button>

                {user.role === "ADMIN" && (
                  <button className="menu-item dashboard" onClick={handleDashboardClick}>
                    <LayoutDashboard size={20} className="menu-icon" />
                    <span>Dashboard</span>
                  </button>
                )}

                <button onClick={handleLogout} className="menu-item logout">
                  <LogOut size={20} className="menu-icon" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="udrive-login-button" onClick={handleLoginClick}>
              Log In
            </button>
            <button className="udrive-signup-button" onClick={handleSignupClick}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header