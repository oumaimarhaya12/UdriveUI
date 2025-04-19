"use client"

import { X, Filter, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

const CarFilters = ({ cars, filters, onApplyFilters, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)

    // Count active filters
    let count = 0
    if (filters.category) count++
    if (filters.fuelType) count++
    if (filters.transmissionType) count++
    if (filters.status !== undefined) count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++

    setActiveFiltersCount(count)
  }, [filters])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onApplyFilters(newFilters)
  }

  // Reset filters
  const handleReset = () => {
    setLocalFilters({})
    onResetFilters()
  }

  return (
    <div className="modern-car-filters">
      <div className="filters-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <Filter size={18} />
        <span>Filters</span>
        {activeFiltersCount > 0 && <span className="filters-badge">{activeFiltersCount}</span>}
        <ChevronDown size={16} className={`toggle-icon ${isExpanded ? "expanded" : ""}`} />
      </div>

      <div className={`filters-panel ${isExpanded ? "expanded" : ""}`}>
        <div className="filters-header">
          <h3>Filter Cars</h3>
          {activeFiltersCount > 0 && (
            <button className="filter-reset" onClick={handleReset}>
              <X size={14} />
              Reset All
            </button>
          )}
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Category</label>
            <select
              className="filter-select"
              value={localFilters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value || null)}
            >
              <option value="">All Categories</option>
              {Array.from(new Set(cars.map((car) => car.category))).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Fuel Type</label>
            <select
              className="filter-select"
              value={localFilters.fuelType || ""}
              onChange={(e) => handleFilterChange("fuelType", e.target.value || null)}
            >
              <option value="">All Fuel Types</option>
              {Array.from(new Set(cars.map((car) => car.fuelType))).map((fuelType) => (
                <option key={fuelType} value={fuelType}>
                  {fuelType}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Transmission</label>
            <select
              className="filter-select"
              value={localFilters.transmissionType || ""}
              onChange={(e) => handleFilterChange("transmissionType", e.target.value || null)}
            >
              <option value="">All Transmissions</option>
              {Array.from(new Set(cars.map((car) => car.transmissionType))).map((transmission) => (
                <option key={transmission} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              className="filter-select"
              value={localFilters.status === undefined ? "" : localFilters.status ? "available" : "unavailable"}
              onChange={(e) => {
                const value = e.target.value
                handleFilterChange("status", value === "" ? undefined : value === "available")
              }}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price (MAD)</label>
            <input
              type="number"
              className="filter-input"
              placeholder="Min Price"
              value={localFilters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <div className="filter-group">
            <label>Max Price (MAD)</label>
            <input
              type="number"
              className="filter-input"
              placeholder="Max Price"
              value={localFilters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>

        <div className="filters-actions">
          <button className="filter-apply" onClick={() => setIsExpanded(false)}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarFilters
