"use client"

import { Home, Car, Calendar, LogOut } from "lucide-react"
import "../styles/Sidebar.css"

const Sidebar = ({ activeSection, setActiveSection, userRole, currentUser, handleSignOut }) => {
  // Use a text logo instead of trying to load an image
  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        {/* Text-based logo that always works */}
        <div className="logo-container">
          <div className="text-logo">
            <span className="text-logo-u">U</span>
            <span className="text-logo-drive">Drive</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <Home className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeSection === "cars" ? "active" : ""}`}
            onClick={() => setActiveSection("cars")}
          >
            <Car className="nav-icon" />
            <span>Cars management</span>
          </button>

          <button
            className={`nav-item ${activeSection === "reservations" ? "active" : ""}`}
            onClick={() => setActiveSection("reservations")}
          >
            <Calendar className="nav-icon" />
            <span>Reservations</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleSignOut} className="signout-button">
            <LogOut className="signout-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
