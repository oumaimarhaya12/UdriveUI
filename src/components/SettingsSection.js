"use client"

import { useState } from "react"
import "../styles/SettingsSection.css"

const SettingsSection = ({ darkMode }) => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Udrive Car Rental",
    email: "admin@udrive.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newReservationAlert: true,
    cancelledReservationAlert: true,
  })

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    })
  }

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  return (
    <div className={`settings-section ${darkMode ? "dark" : "light"}`}>
      <h1 className="section-title">Settings</h1>

      <div className="settings-container">
        <div className={`settings-card ${darkMode ? "dark" : "light"}`}>
          <h2 className="settings-card-title">General Settings</h2>

          <form className="settings-form">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={generalSettings.companyName}
                onChange={handleGeneralSettingsChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={generalSettings.email}
                onChange={handleGeneralSettingsChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={generalSettings.phone}
                onChange={handleGeneralSettingsChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Business Address</label>
              <textarea
                id="address"
                name="address"
                value={generalSettings.address}
                onChange={handleGeneralSettingsChange}
              />
            </div>

            <button type="button" className="save-button">
              Save Changes
            </button>
          </form>
        </div>

        <div className={`settings-card ${darkMode ? "dark" : "light"}`}>
          <h2 className="settings-card-title">Notification Settings</h2>

          <div className="toggle-settings">
            <div className="toggle-group">
              <span className="toggle-label">Email Notifications</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleNotificationToggle("emailNotifications")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-group">
              <span className="toggle-label">SMS Notifications</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={() => handleNotificationToggle("smsNotifications")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-group">
              <span className="toggle-label">New Reservation Alerts</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.newReservationAlert}
                  onChange={() => handleNotificationToggle("newReservationAlert")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-group">
              <span className="toggle-label">Cancelled Reservation Alerts</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.cancelledReservationAlert}
                  onChange={() => handleNotificationToggle("cancelledReservationAlert")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <button type="button" className="save-button">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsSection
