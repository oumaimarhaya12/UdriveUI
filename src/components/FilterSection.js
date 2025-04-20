"use client"

import { useState, useEffect } from "react"
import { Banknote, Fuel, Car, Check } from 'lucide-react'
import "../styles/FilterSection.css"

const FilterSection = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1500]) // Changed from 45000 to 1500
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  const fuelTypes = [
    { id: "gasoline", label: "Gasoline" },
    { id: "diesel", label: "Diesel" },
    { id: "electric", label: "Electric" },
    { id: "hybrid", label: "Hybrid" },
  ]

  const categories = [
    { id: "compact", label: "Compact" },
    { id: "suv", label: "SUV" },
    { id: "luxury", label: "Luxury" },
    { id: "standard", label: "Standard" },
  ]

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange]
    newPriceRange[index] = Number.parseInt(e.target.value)
    setPriceRange(newPriceRange)
  }

  // Handle fuel type selection
  const handleFuelTypeChange = (fuelType) => {
    if (selectedFuelTypes.includes(fuelType)) {
      setSelectedFuelTypes(selectedFuelTypes.filter((type) => type !== fuelType))
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, fuelType])
    }
  }

  // Handle category selection
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 1500]) // Changed from 45000 to 1500
    setSelectedFuelTypes([])
    setSelectedCategories([])
  }

  // Update parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        priceRange,
        fuelTypes: selectedFuelTypes,
        categories: selectedCategories,
      })
    }
  }, [priceRange, selectedFuelTypes, selectedCategories, onFilterChange])

  return (
    <div className="filter-section">
      <div className="filter-title-container">
        <h2 className="filter-title">Filters</h2>
        <button
          className="reset-filters-btn"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <div className="filter-header">
          <Banknote size={16} className="filter-icon" />
          <h3>Price Range</h3>
        </div>
        <div className="price-range-container">
          <div className="price-inputs">
            <div className="price-input">
              <label>Min</label>
              <div className="price-value">
                <span>MAD</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  min="0"
                  max={priceRange[1]}
                />
              </div>
            </div>
            <div className="price-input">
              <label>Max</label>
              <div className="price-value">
                <span>MAD</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  min={priceRange[0]}
                  max="1500" // Changed from 45000 to 1500
                />
              </div>
            </div>
          </div>
          <div className="slider-container">
            <div
              className="slider-track"
              style={{
                left: `${(priceRange[0] / 1500) * 100}%`, // Changed from 45000 to 1500
                width: `${((priceRange[1] - priceRange[0]) / 1500) * 100}%`, // Changed from 45000 to 1500
              }}
            ></div>
            <input
              type="range"
              min="0"
              max="1500" // Changed from 45000 to 1500
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="price-slider min-slider"
            />
            <input
              type="range"
              min="0"
              max="1500" // Changed from 45000 to 1500
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="price-slider max-slider"
            />
          </div>
        </div>
      </div>

      {/* Fuel Type Filter */}
      <div className="filter-group">
        <div className="filter-header">
          <Fuel size={16} className="filter-icon" />
          <h3>Fuel Type</h3>
        </div>
        <div className="checkbox-group">
          {fuelTypes.map((fuel) => (
            <div
              key={fuel.id}
              className={`checkbox-item ${selectedFuelTypes.includes(fuel.id) ? "selected" : ""}`}
              onClick={() => handleFuelTypeChange(fuel.id)}
            >
              <div className="custom-checkbox">{selectedFuelTypes.includes(fuel.id) && <Check size={12} />}</div>
              <span>{fuel.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <div className="filter-header">
          <Car size={16} className="filter-icon" />
          <h3>Category</h3>
        </div>
        <div className="checkbox-group">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`checkbox-item ${selectedCategories.includes(category.id) ? "selected" : ""}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <div className="custom-checkbox">{selectedCategories.includes(category.id) && <Check size={12} />}</div>
              <span>{category.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterSection