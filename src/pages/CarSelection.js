"use client"

import { useState } from "react"
import Header2 from "../components/Header2"
import BookingSummary from "../components/BookingSummary"
import FilterHeading from "../components/FilterHeading"
import FilterSection from "../components/FilterSection"
import CarList from "../components/CarList"
import PromoBanner from "../components/promo-banner"
import CarBrands from "../components/CarBrands"
import Footer from "../components/footer"
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
          <PromoBanner />
          <div className="main-content">
            <FilterHeading />
            <div className="filter-and-cars">
              <div className="sidebar">
                <FilterSection onFilterChange={handleFilterChange} />
              </div>
              <div className="car-content">
                <CarList filters={filters} />
              </div>
            </div>
            <CarBrands /> 
          </div>
        </div>
        <Footer />
      </div>
    )
}

export default CarSelection