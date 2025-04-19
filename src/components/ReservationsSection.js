"use client"

import { useState, useEffect } from "react"
import TabsComponent from "./TabsComponent"
import ReservationsTable from "./ReservationsTable"
import ReservationStats from "./ReservationStats"
import ReservationFilters from "./ReservationFilters"
import { RefreshCw } from "lucide-react"
import "../styles/dashboard.css"

const ReservationsSection = ({
  pendingReservations,
  confirmedReservations,
  isLoading,
  handleApproveReservation,
  handleRejectReservation,
  handleCancelReservation,
  formatDate,
  fetchReservations,
}) => {
  const [activeTab, setActiveTab] = useState("pending")
  const [filteredPendingReservations, setFilteredPendingReservations] = useState(pendingReservations)
  const [filteredConfirmedReservations, setFilteredConfirmedReservations] = useState(confirmedReservations)
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    minPrice: null,
    maxPrice: null,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Apply filters whenever the original data or filters change
  useEffect(() => {
    // Filter pending reservations
    const filteredPending = pendingReservations.filter((reservation) => {
      // Date filtering
      if (filters.startDate && reservation.pickupDate) {
        const pickupDate = new Date(reservation.pickupDate)
        if (pickupDate < filters.startDate) return false
      }

      if (filters.endDate && reservation.dropoffDate) {
        const dropoffDate = new Date(reservation.dropoffDate)
        if (dropoffDate > filters.endDate) return false
      }

      // Price filtering (only for pending reservations)
      if (filters.minPrice !== null && reservation.price < filters.minPrice) return false
      if (filters.maxPrice !== null && reservation.price > filters.maxPrice) return false

      return true
    })

    setFilteredPendingReservations(filteredPending)

    // Filter confirmed reservations (only by date)
    const filteredConfirmed = confirmedReservations.filter((reservation) => {
      // Date filtering
      if (filters.startDate && reservation.pickupDate) {
        const pickupDate = new Date(reservation.pickupDate)
        if (pickupDate < filters.startDate) return false
      }

      if (filters.endDate && reservation.dropoffDate) {
        const dropoffDate = new Date(reservation.dropoffDate)
        if (dropoffDate > filters.endDate) return false
      }

      return true
    })

    setFilteredConfirmedReservations(filteredConfirmed)
  }, [pendingReservations, confirmedReservations, filters])

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchReservations()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500) // Add a small delay to make the refresh animation visible
  }

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
  ]

  return (
    <div className="reservations-section">
      <div className="modern-header">
        <h2>Reservations</h2>
        <button className={`modern-refresh ${isRefreshing ? "refreshing" : ""}`} onClick={handleRefresh}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <ReservationStats pendingCount={pendingReservations.length} confirmedCount={confirmedReservations.length} />

      <div className="modern-controls">
        <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        <ReservationFilters onApplyFilters={handleApplyFilters} activeTab={activeTab} />
      </div>

      {activeTab === "pending" && (
        <>
          {filteredPendingReservations.length !== pendingReservations.length && (
            <div className="filter-indicator">
              Showing {filteredPendingReservations.length} of {pendingReservations.length} pending reservations
            </div>
          )}
          <ReservationsTable
            reservations={filteredPendingReservations}
            isLoading={isLoading}
            activeTab={activeTab}
            handleApproveReservation={handleApproveReservation}
            handleRejectReservation={handleRejectReservation}
            handleCancelReservation={handleCancelReservation}
            formatDate={formatDate}
          />
        </>
      )}

      {activeTab === "confirmed" && (
        <>
          {filteredConfirmedReservations.length !== confirmedReservations.length && (
            <div className="filter-indicator">
              Showing {filteredConfirmedReservations.length} of {confirmedReservations.length} confirmed reservations
            </div>
          )}
          <ReservationsTable
            reservations={filteredConfirmedReservations}
            isLoading={isLoading}
            activeTab={activeTab}
            handleApproveReservation={handleApproveReservation}
            handleRejectReservation={handleRejectReservation}
            handleCancelReservation={handleCancelReservation}
            formatDate={formatDate}
          />
        </>
      )}
    </div>
  )
}

export default ReservationsSection
