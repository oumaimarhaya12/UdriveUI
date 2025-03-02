import { useState, useEffect } from "react";
import "../styles/HeroForm.css";

const HeroForm = () => {
  const [pickupDetails, setPickupDetails] = useState("");
  const [dropoffDetails, setDropoffDetails] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [minPickupDate, setMinPickupDate] = useState("");
  const [minDropoffDate, setMinDropoffDate] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedToday = formatDateForInput(today);
    setMinPickupDate(formattedToday);
    setMinDropoffDate(formattedToday);
  }, []);

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handlePickupDateChange = (e) => {
    const selectedDate = e.target.value;
    setPickupDate(selectedDate);
    setMinDropoffDate(selectedDate);

    if (dropoffDate && dropoffDate < selectedDate) {
      setDropoffDate("");
      setDateError("Drop-off date cannot be before pick-up date");
    } else {
      setDateError("");
    }
  };

  const handleDropoffDateChange = (e) => {
    const selectedDate = e.target.value;

    if (pickupDate && selectedDate < pickupDate) {
      setDateError("Drop-off date cannot be before pick-up date");
      return;
    }

    setDropoffDate(selectedDate);
    setDateError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pickupDetails || !dropoffDetails || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime) {
      setDateError("Please fill in all fields");
      return;
    }

    if (dateError) {
      return;
    }

    console.log("Form submitted:", {
      pickupDetails,
      dropoffDetails,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
    });
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Your Journey Starts with Udrive!</h1>
        <p className="hero-subtitle">Your freedom on four wheels—book, drive, and explore with ease.</p>
      </div>

      <div className="form-container">
        <h2 className="form-title">Book now</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Pick-up Location</label>
            <input
              type="text"
              placeholder="Enter pick-up Address in Agadir"
              className="form-input"
              value={pickupDetails}
              onChange={(e) => setPickupDetails(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label">Drop-off Location</label>
            <input
              type="text"
              placeholder="Enter drop-off Address in Agadir"
              className="form-input"
              value={dropoffDetails}
              onChange={(e) => setDropoffDetails(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label">Pick-up Date & Time</label>
            <div className="date-time-wrapper">
              <input
                type="date"
                className="form-input date-input"
                value={pickupDate}
                onChange={handlePickupDateChange}
                min={minPickupDate}
                required
              />
              <select
                className="form-input time-input"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Drop-off Date & Time</label>
            <div className="date-time-wrapper">
              <input
                type="date"
                className="form-input date-input"
                value={dropoffDate}
                onChange={handleDropoffDateChange}
                min={minDropoffDate}
                required
              />
              <select
                className="form-input time-input"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {dateError && <div className="error-message">{dateError}</div>}
          <button type="submit" className="book-button">
            Book now
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroForm;