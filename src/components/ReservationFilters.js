"use client"

import { useState } from "react"
import { Calendar, DollarSign, X, SlidersHorizontal } from "lucide-react"
import "../styles/dashboard.css"

const ReservationFilters = ({ onApplyFilters, activeTab }) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [isFiltersActive, setIsFiltersActive] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleApplyFilters = () => {
    const newFilters = {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      minPrice: minPrice ? Number.parseFloat(minPrice) : null,
      maxPrice: maxPrice ? Number.parseFloat(maxPrice) : null,
    }

    // Check if any filter is active
    const hasActiveFilter = newFilters.startDate || newFilters.endDate || newFilters.minPrice || newFilters.maxPrice

    setIsFiltersActive(hasActiveFilter)
    onApplyFilters(newFilters)
    setIsExpanded(false)
  }

  const handleClearFilters = () => {
    setStartDate("")
    setEndDate("")
    setMinPrice("")
    setMaxPrice("")
    setIsFiltersActive(false)
    onApplyFilters({
      startDate: null,
      endDate: null,
      minPrice: null,
      maxPrice: null,
    })
  }

  return (
    <div className={`modern-filters ${isExpanded ? "expanded" : ""} ${isFiltersActive ? "active" : ""}`}>
      <div className="filters-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <SlidersHorizontal size={16} />
        <span>Filters {isFiltersActive && <span className="filter-badge"></span>}</span>
      </div>

      <div className="filters-content">
        <div className="filters-row">
          <div className="filter-field">
            <label>
              <Calendar size={14} />
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="modern-input"
            />
          </div>

          <div className="filter-field">
            <label>
              <Calendar size={14} />
              To
            </label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="modern-input" />
          </div>

          {activeTab === "pending" && (
            <>
              <div className="filter-field">
                <label>
                  <DollarSign size={14} />
                  Min
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="modern-input"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="filter-field">
                <label>
                  <DollarSign size={14} />
                  Max
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="modern-input"
                  placeholder="Any"
                  min="0"
                />
              </div>
            </>
          )}

          <div className="filter-actions">
            <button className="modern-button apply" onClick={handleApplyFilters}>
              Apply
            </button>

            {isFiltersActive && (
              <button className="modern-button clear" onClick={handleClearFilters}>
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationFilters
