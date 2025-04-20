"use client"

import { useState } from "react"
import Header from "../components/Header"
import BookingSummary from "../components/BookingSummary"
import FilterHeading from "../components/FilterHeading"
import FilterSection from "../components/FilterSection"
import CarList from "../components/CarList"
import PromoBanner from "../components/promo-banner"
import CarBrands from "../components/CarBrands"
import Footer from "../components/footer"
import "../styles/CarSelection.css"

const CarSelection = () => {
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
      <Header />
      <div className="content-container">
        <BookingSummary />
        <PromoBanner />
        <div className="main-content">
          <FilterHeading />
          <div className="car-content-wrapper">
            <div className="filter-container">
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