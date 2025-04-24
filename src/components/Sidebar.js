"use client"

import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutGrid, Car, Calendar, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import "../styles/Sidebar.css"

const Sidebar = ({ activeSection, setActiveSection, handleSignOut, collapsed, darkMode, toggleSidebar }) => {
  const location = useLocation()

  // Set active section based on URL path
  useEffect(() => {
    const path = location.pathname.split("/").pop()
    if (path === "" || path === "dashboard") {
      setActiveSection("dashboard")
    } else if (path === "cars") {
      setActiveSection("cars")
    } else if (path === "reservations") {
      setActiveSection("reservations")
    } else if (path === "settings") {
      setActiveSection("settings")
    } else if (path === "customers") {
      setActiveSection("customers")
    } else if (path === "notifications") {
      setActiveSection("notifications")
    } else if (path === "analytics") {
      setActiveSection("analytics")
    }
  }, [location, setActiveSection])

  // Remove the description text under tab names, remove the "MAIN" section title,
  // remove extra navigation items, and remove the admin profile picture

  // First, update the navItems array to keep only the essential items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutGrid size={20} />,
      path: "/dashboard",
    },
    {
      id: "cars",
      label: "Cars",
      icon: <Car size={20} />,
      path: "/dashboard/cars",
    },
    {
      id: "reservations",
      label: "Bookings",
      icon: <Calendar size={20} />,
      path: "/dashboard/reservations",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/dashboard/settings",
    },
  ]

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""} ${darkMode ? "dark" : "light"}`}>
      <div className="sidebar-toggle-container">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Next, modify the sidebar-content section to remove the "MAIN" title */}
      {/* Replace this: */}
      {/* <div className="sidebar-content">
        <div className="nav-section">
          <div className="nav-section-title">{!collapsed && "MAIN"}</div>
          <nav className="sidebar-nav">
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                    onClick={() => setActiveSection(item.id)}
                    title={collapsed ? item.label : ""}
                  >
                    <div className="nav-icon-wrapper">
                      <span className="nav-icon">{item.icon}</span>
                    </div>
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      {!collapsed && item.description && <span className="nav-description">{item.description}</span>}
                    </div>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div> */}

      {/* With this simplified version: */}
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                  title={collapsed ? item.label : ""}
                >
                  <div className="nav-icon-wrapper">
                    <span className="nav-icon">{item.icon}</span>
                  </div>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Finally, modify the sidebar-footer to remove the user profile picture */}
      {/* Replace this: */}
      {/* <div className="sidebar-footer">
        <div className="user-profile">
          {!collapsed ? (
            <div className="user-avatar large">
              <span>A</span>
            </div>
          ) : (
            <div className="user-avatar small">
              <span>A</span>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={handleSignOut} title={collapsed ? "Logout" : ""}>
          <LogOut size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div> */}

      {/* With this simplified version: */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleSignOut} title={collapsed ? "Logout" : ""}>
          <LogOut size={20} className="logout-icon" />
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
