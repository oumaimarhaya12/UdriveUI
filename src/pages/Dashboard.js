"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"
import DashboardStats from "../components/DashboardStats"
import CarsManagement from "../components/cars/CarsManagement"
import ReservationsSection from "../components/ReservationsSection"
import { useReservations } from "../hooks/use-reservations"
import { useAuthentication } from "../hooks/use-auth"
import "../styles/dashboard.css"

export default function Dashboard() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("reservations")
  const { isAuthenticated, userRole, handleSignOut, isLoading: authLoading } = useAuthentication()
  const {
    pendingReservations,
    confirmedReservations,
    isLoading: reservationsLoading,
    apiError,
    formatDate,
    fetchReservations,
    handleApproveReservation,
    handleRejectReservation,
    handleCancelReservation,
    debugAuthenticationIssue,
  } = useReservations()

  // Memoize the fetchReservations call to prevent unnecessary re-renders
  const loadReservations = useCallback(() => {
    if (isAuthenticated) {
      fetchReservations()
    }
  }, [isAuthenticated, fetchReservations])

  // Check authentication and load data
  useEffect(() => {
    if (isAuthenticated) {
      loadReservations()

      // Make the debug function globally available
      window.debugAuthenticationIssue = debugAuthenticationIssue
    }
  }, [isAuthenticated, loadReservations, debugAuthenticationIssue])

  // Determine if we're in a loading state
  const isLoading = authLoading || (reservationsLoading && activeSection === "reservations")

  // Show loading state
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // If not authenticated and not loading, don't render anything
  // This prevents the UI from flashing before redirect
  if (!isAuthenticated && !authLoading) {
    return null
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userRole={userRole}
        currentUser={currentUser}
        handleSignOut={handleSignOut}
      />

      <main className="main-content">
        <PageHeader />

        {activeSection === "dashboard" && (
          <DashboardStats
            stats={[
              { title: "Pending Reservations", value: pendingReservations.length },
              { title: "Confirmed Reservations", value: confirmedReservations.length },
              { title: "Total Reservations", value: pendingReservations.length + confirmedReservations.length },
            ]}
          />
        )}

        {activeSection === "cars" && <CarsManagement />}

        {activeSection === "reservations" && (
          <ReservationsSection
            pendingReservations={pendingReservations}
            confirmedReservations={confirmedReservations}
            isLoading={reservationsLoading}
            handleApproveReservation={handleApproveReservation}
            handleRejectReservation={handleRejectReservation}
            handleCancelReservation={handleCancelReservation}
            formatDate={formatDate}
            fetchReservations={fetchReservations}
          />
        )}
      </main>
    </div>
  )
}
