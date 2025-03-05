"use client"

import { useState } from "react"
import Header2 from "../components/Header2"
import BookingSummary from "../components/BookingSummary"
import FilterHeading from "../components/FilterHeading"
import FilterSection from "../components/FilterSection"
import CarList from "../components/CarList"
import PromoBanner from "../components/promo-banner"
import "../styles/CarSelection.css"

function CarSelection() {
    const [filters, setFilters] = useState({
      priceRange: [0, 45000],
      fuelTypes: [],
      categories: [],
    })
  
    const handleFilterChange = (newFilters) => {
      setFilters(newFilters)
    }
  
    return (
      <div className="car-selection-page">
        <Header2 />
        <div className="content-container">
          <BookingSummary />
  
          <div className="main-content">
            <div className="sidebar">
              <FilterSection onFilterChange={handleFilterChange} />
            </div>
  
            <div className="car-content">
              {/* Déplacement du PromoBanner au-dessus de FilterHeading */}
              <PromoBanner />
              <FilterHeading />
              <CarList filters={filters} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default CarSelection
