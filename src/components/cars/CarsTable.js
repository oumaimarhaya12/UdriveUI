"use client"

import { Car, X } from "lucide-react"

const CarsTable = ({ cars, allCars, isLoading, error, onToggleAvailability, onRetry }) => {
  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cars...</p>
      </div>
    )
  }

  // Render error state
  if (error) {
    // Check if it's an authentication error
    const isAuthError = error.includes("Authentication") || error.includes("401")

    return (
      <div className="error-container glass-card">
        <X size={48} className="error-icon" />
        <h3>{isAuthError ? "Authentication Issue" : "Error Loading Cars"}</h3>
        <p>{error}</p>
        {isAuthError ? (
          <div className="error-actions">
            <button className="modern-button apply" onClick={() => (window.location.href = "/login")}>
              Go to Login
            </button>
            <button className="modern-button secondary" onClick={onRetry}>
              Try Again
            </button>
          </div>
        ) : (
          <button className="modern-button apply" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    )
  }

  // Render empty state
  if (cars.length === 0 && allCars.length === 0) {
    return (
      <div className="empty-state">
        <Car size={48} />
        <p>No cars found.</p>
        <p className="empty-state-subtitle">Add cars to your fleet to see them here.</p>
      </div>
    )
  }

  return (
    <>
      {cars.length === 0 && allCars.length > 0 ? (
        <div className="empty-state">
          <Car size={48} />
          <p>No cars match your filters.</p>
          <p className="empty-state-subtitle">Try adjusting your filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="cars-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Fuel Type</th>
                  <th>Transmission</th>
                  <th>Price/Day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car, index) => (
                  <tr key={index}>
                    <td className="car-model">{car.model}</td>
                    <td>{car.category}</td>
                    <td>{car.fuelType}</td>
                    <td>{car.transmissionType}</td>
                    <td className="car-price">{formatPrice(car.price)}</td>
                    <td>
                      <span className={`status-badge ${car.status ? "available" : "unavailable"}`}>
                        {car.status ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div className="toggle-container">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={car.status}
                            onChange={() => {
                              // Log the car object to see what properties are available
                              console.log("Car object:", car)
                              // Try to use idCar if available, otherwise fall back to model
                              const carId = car.idCar || car.model
                              console.log(`Toggling availability for car ID: ${carId}`)
                              onToggleAvailability(carId)
                            }}
                            disabled={isLoading}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cars.length !== allCars.length && (
            <div className="filter-indicator">
              Showing {cars.length} of {allCars.length} cars
            </div>
          )}
        </>
      )}
    </>
  )
}

export default CarsTable
